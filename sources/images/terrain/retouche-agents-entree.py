"""Retouche de la photo « deux agents a l'entree d'une salle » (photo d'un tirage papier, avec reflet).

Etapes : retrait du voile de reflet, tonalite douce, flou du visage du passant a l'arriere-plan,
cadrage 3:2 a mi-cuisse, nettete legere. Rien n'est genere.
  Modele du reflet : image observee = image reelle + voile. Le voile couvre l'image sauf une zone centrale.
  On mesure l'ecart entre le noir voile et le noir sans voile, puis on le retire la ou il se trouve,
  sur les tons sombres et moyens seulement. Chemises, mains et decor clair ne sont pas modifies ;
  sur les deux visages, la peau n'est pas touchee.
Cadrage de depart, tonalite et flou repris du script propose par ChatGPT ; retrait du reflet ajoute ensuite,
puis corrige apres une relecture independante (cadrage resserre, visages, teinte unique des costumes).

Utilisation : python retouche-agents-entree.py original.jpg sortie.jpg
L'original n'est pas dans le depot (un passant y est reconnaissable) : voir sources/LISEZMOI.md.
Le resultat est identique a sources/fiche-google/agents-entree-salle.jpg.
"""
import argparse
from pathlib import Path
import cv2
import numpy as np
from PIL import Image, ImageOps, ImageFilter

cv2.setNumThreads(1)
cv2.ocl.setUseOpenCL(False)
FACE = (0.471, 0.324, 0.019, 0.045)                 # visage du passant : centre x/y, rayons x/y
CROP1 = (0.19608, 0.065, 0.81048, 0.79316)          # cadrage 3:2 a mi-cuisse (le bas garde des traces du reflet)
TETES = [(0.385, 0.176, 0.034, 0.076), (0.585, 0.178, 0.040, 0.083)]   # visages des agents : centre x/y, rayons x/y
COSTUMES = (0.26, 0.10, 0.73, 1.0)                  # zone des deux agents (retrait de la couture du reflet)
EPAULES = 0.225                                     # au-dessus : tetes et decor, jamais du costume
LUM = np.array([0.114, 0.587, 0.299], np.float32)   # poids B, V, R


def read(path):
    with Image.open(path) as im:
        return ImageOps.exif_transpose(im).convert("RGB")


def crop(im, box):
    w, h = im.size
    return im.crop(tuple(round(v * d) for v, d in zip(box, (w, h, w, h))))


def resize_width(im, width):
    return im.resize((width, round(im.height * width / im.width)), Image.Resampling.LANCZOS)


def tone(im, gains=(1, 1, 1), exposure=1.0, saturation=1.0):
    a = np.asarray(im, dtype=np.float32) / 255.0
    a *= np.array(gains, dtype=np.float32) * exposure
    a = np.clip(a, 0, 1)
    a = np.interp(a, [0, .08, .25, .50, .75, .92, 1], [0, .065, .225, .495, .760, .920, 1]).astype(np.float32)
    lum = np.sum(a * np.array([.2126, .7152, .0722]), axis=2)
    a = lum[..., None] + saturation * (a - lum[..., None])
    return Image.fromarray(np.uint8(np.rint(np.clip(a, 0, 1) * 255)))


def blur_face(im):
    w, h = im.size
    cx, cy, rx, ry = FACE
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    r = np.sqrt(((xx / w - cx) / rx) ** 2 + ((yy / h - cy) / ry) ** 2)
    mask = np.clip((1 - r) / .2, 0, 1)[..., None]
    a = np.asarray(im, dtype=np.float32)
    b = cv2.GaussianBlur(a, (0, 0), sigmaX=.008 * w, sigmaY=.008 * w, borderType=cv2.BORDER_REFLECT_101)
    return Image.fromarray(np.uint8(np.rint(a * (1 - mask) + b * mask)))


def save(im, path):
    im = im.filter(ImageFilter.UnsharpMask(radius=1, percent=30, threshold=3))
    im.save(path, "JPEG", quality=92, subsampling=0, optimize=True)
    print(f"{path.name}: {im.width} x {im.height}")


def smoothstep(x, a, b):
    t = np.clip((x - a) / (b - a), 0, 1)
    return t * t * (3 - 2 * t)


def masque_tetes(h, w):
    """1 sur les visages et les cheveux des deux agents, 0 ailleurs, raccord progressif."""
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    m = np.zeros((h, w), np.float32)
    for cx, cy, rx, ry in TETES:
        r = np.sqrt(((xx / w - cx) / rx) ** 2 + ((yy / h - cy) / ry) ** 2)
        m = np.maximum(m, 1 - smoothstep(r, 1.0, 1.3))
    return m


def retirer_voile(im):
    """im : tableau BGR float32. Retourne l'image sans l'ecart de voile et la carte du voile (0 a 1)."""
    lum = im @ LUM
    chroma = im.max(axis=2) - im.min(axis=2)
    moy = cv2.blur(lum, (7, 7))
    std = np.sqrt(np.maximum(cv2.blur(lum * lum, (7, 7)) - moy * moy, 0))
    sans = lum < 59                                                      # sombre sans voile : certain
    noir_voile = (chroma < 34) & (lum >= 64) & (lum <= 108) & (std < 5)  # noir sous le voile : gris plat
    rouge = (im[..., 2] - im[..., 1] > 40) & (im[..., 2] - im[..., 0] > 40)
    tapis_voile = rouge & (lum >= 72) & (lum <= 125) & (std < 6)         # tapis rouge sous le voile
    voile = noir_voile | tapis_voile
    v0 = cv2.GaussianBlur(sans.astype(np.float32), (0, 0), 14)
    v1 = cv2.GaussianBlur(voile.astype(np.float32), (0, 0), 14)
    carte = smoothstep(v1 / (v1 + v0 + 1e-3), 0.35, 0.65)
    carte = np.where(voile, 1.0, np.where(sans, 0.0, carte)).astype(np.float32)
    carte = cv2.GaussianBlur(carte, (0, 0), 1.2)
    tetes = masque_tetes(*lum.shape)
    # Ecart de voile, mesure par matiere (noir des costumes, rouge du tapis) : zone voilee moins zone sans voile,
    # du plus large au plus local, pour etre exact a la limite.
    def ecart_local(voilee, non_voilee):
        m1 = voilee.astype(np.float32)
        m0 = non_voilee.astype(np.float32)
        e = np.broadcast_to(np.median(im[voilee], axis=0) - np.median(im[non_voilee], axis=0), im.shape)
        e = e.astype(np.float32).copy()
        for sigma, a, b in [(70, 0.02, 0.10), (28, 0.04, 0.16), (10, 0.06, 0.22)]:
            p1 = cv2.GaussianBlur(m1, (0, 0), sigma)
            p0 = cv2.GaussianBlur(m0, (0, 0), sigma)
            moy1 = cv2.GaussianBlur(im * m1[..., None], (0, 0), sigma) / np.maximum(p1, 1e-4)[..., None]
            moy0 = cv2.GaussianBlur(im * m0[..., None], (0, 0), sigma) / np.maximum(p0, 1e-4)[..., None]
            confiance = smoothstep(np.minimum(p1, p0), a, b)[..., None]
            e = confiance * (moy1 - moy0) + (1 - confiance) * e
        return cv2.GaussianBlur(np.clip(e, 0, 75), (0, 0), 4)

    ecart_noir = ecart_local(noir_voile, sans & (chroma < 34))
    ecart_rouge = ecart_local(tapis_voile, sans & rouge)
    part_rouge = cv2.GaussianBlur(smoothstep(im[..., 2] - im[..., 1], 25, 50), (0, 0), 1.5)[..., None]
    ecart = part_rouge * ecart_rouge + (1 - part_rouge) * ecart_noir
    # Tons clairs (chemises, mains, decor clair) : non modifies. Sur les deux visages, la protection commence
    # plus bas : la peau n'est pas touchee, seuls les noirs (cheveux, decor sombre derriere la tete) sont corriges.
    protege = (1 - tetes) * (1 - smoothstep(lum, 104, 160)) + tetes * (1 - smoothstep(lum, 92, 118))
    out = np.clip(im - ecart * (carte * protege)[..., None], 0, 255)
    # Couture : sur une bande etroite autour de la limite du voile, filtre median (tons sombres, zone des agents).
    h, w = lum.shape
    x0, y0, x1, y1 = COSTUMES
    zone = np.zeros((h, w), np.float32)
    zone[int(max(y0, 0.30) * h):int(y1 * h), int(x0 * w):int(x1 * w)] = 1
    bord = cv2.morphologyEx((carte > 0.5).astype(np.uint8), cv2.MORPH_GRADIENT, np.ones((3, 3), np.uint8))
    bande = cv2.GaussianBlur(cv2.dilate(bord, np.ones((9, 9), np.uint8)).astype(np.float32), (0, 0), 2)
    bande = (bande * zone * (1 - smoothstep(out @ LUM, 80, 115)))[..., None]
    mediane = cv2.medianBlur(np.uint8(np.rint(out)), 11).astype(np.float32)
    return out * (1 - bande) + mediane * bande, carte


def unifier_costumes(im, carte):
    """Efface les taches et les coutures du reflet sur les costumes ; teinte unique, mesuree hors reflet."""
    h, w = im.shape[:2]
    lum = im @ LUM
    chroma = im.max(axis=2) - im.min(axis=2)
    x0, y0, x1, y1 = COSTUMES
    zone = np.zeros((h, w), np.uint8)
    zone[int(max(y0, EPAULES) * h):int(y1 * h), int(x0 * w):int(x1 * w)] = 1   # pas le plafond sombre entre les tetes
    hors_tetes = masque_tetes(h, w) < 0.02
    noir = (lum < 74) & (chroma < 32) & (zone > 0) & hors_tetes      # noir neutre : le tapis rouge n'en fait pas partie
    s = cv2.morphologyEx(noir.astype(np.uint8), cv2.MORPH_OPEN, np.ones((5, 5), np.uint8))
    # Fermeture : englobe les coutures et les marbrures etroites restees hors du masque (tons sombres seulement).
    ferme = cv2.morphologyEx(s, cv2.MORPH_CLOSE, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (15, 15)))
    s = (ferme.astype(bool) & (lum < 105) & (im[..., 2] - im[..., 1] < 25) & (zone > 0) & hors_tetes).astype(np.uint8)
    n, etiquettes, stats, _ = cv2.connectedComponentsWithStats(s, 8)
    grand = np.zeros_like(s)
    for i in range(1, n):
        if stats[i, cv2.CC_STAT_AREA] > 0.004 * h * w:
            grand[etiquettes == i] = 1
    s = grand.astype(np.float32)
    doux = cv2.GaussianBlur(s, (0, 0), 1.5)

    def lisse(v, sigma):
        return cv2.GaussianBlur(v * s, (0, 0), sigma) / np.maximum(cv2.GaussianBlur(s, (0, 0), sigma), 1e-3)

    # Sur les coutures (limite du voile), le detail est coupe : il ne contient que la trace du reflet.
    bord = cv2.morphologyEx((carte > 0.5).astype(np.uint8), cv2.MORPH_GRADIENT, np.ones((3, 3), np.uint8))
    couture = cv2.GaussianBlur(cv2.dilate(bord, np.ones((13, 13), np.uint8)).astype(np.float32), (0, 0), 3)
    cible = 0.5 * lisse(lum, 140) + 0.5 * float(np.median(lum[s > 0]))
    lum2 = cible + 0.75 * (1 - couture) * (lum - lisse(lum, 7))
    # Teinte unique : celle du costume la ou il n'y a jamais eu de reflet (mediane mesuree, rien d'invente).
    reference = np.median(im[(s > 0) & noir & (carte < 0.05)], axis=0)
    teinte = reference / float(reference @ LUM)
    couleur = lum2[..., None] * teinte
    return np.clip(im * (1 - doux[..., None]) + couleur * doux[..., None], 0, 255)


def sans_reflet(im):
    bgr = np.asarray(im, dtype=np.float32)[..., ::-1].copy()
    bgr, carte = retirer_voile(bgr)
    bgr = unifier_costumes(bgr, carte)
    return Image.fromarray(np.uint8(np.rint(bgr[..., ::-1])))


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("entree", type=Path)
    parser.add_argument("sortie", type=Path)
    args = parser.parse_args()
    p1 = sans_reflet(read(args.entree))
    p1 = tone(p1, gains=(1.008, 1.000, .990), saturation=1.02)
    p1 = crop(blur_face(p1), CROP1)
    save(resize_width(p1, 1228), args.sortie)


if __name__ == "__main__":
    main()
