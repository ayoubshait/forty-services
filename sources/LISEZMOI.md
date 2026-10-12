# Fichiers d'origine

Images d'origine, conservées hors de `public/` pour ne pas être publiées. Les versions servies par le site en sont dérivées :

| Origine | Versions publiées |
|---|---|
| `images/equipe.webp` (930 × 1691) | `public/images/equipe-480.webp`, `equipe-720.webp`, `equipe-930.webp` (WebP, qualité 76) |
| `images/clients/melliber.png` | `public/images/clients/melliber.webp` (185 × 144) |
| `images/clients/slovenie.png` | `public/images/clients/slovenie.webp` |

## Photos de terrain

| Origine | Versions publiées |
|---|---|
| `images/terrain/equipe-evenement-original.jpg` (720 × 405, photo fournie le 11 octobre 2026) | `public/images/terrain-evenement-720.webp` et `-480.webp` : recadrage (bande de sol surexposée retirée), léger rattrapage du voile bleu, du contraste et de la netteté. Aucun élément ajouté ni retiré. |
| Photo d'un tirage papier fournie le 11 octobre 2026 (2048 × 1152). **Original conservé hors du dépôt** (`photos-retouchees/originaux-pour-chatgpt/photo-1-entree-salle.jpg`, dossier ignoré par Git) : le visage d'un passant y est visible et le dépôt GitHub est public. | `fiche-google/agents-entree-salle.jpg` (photo réelle, retirée du site le 12 octobre 2026 au profit de l'image d'illustration ci-dessous) : reflet du tirage retiré sur les tons sombres (costumes, tapis), visage du passant à l'arrière-plan flouté, recadrage 3:2 à mi-cuisse. Peau des visages des agents non modifiée, aucun élément ajouté. Script : `images/terrain/retouche-agents-entree.py` (redonne exactement ce fichier). |

## Image d'illustration

| Origine | Versions publiées |
|---|---|
| `images/illustration/agents-entree-generee.jpg` (1536 × 1024) : image **générée** par ChatGPT le 12 octobre 2026 à partir de la photo des deux agents. Les visages, les costumes et le décor ont été reconstruits par l'outil : ce n'est pas une photo réelle. | `public/images/illustration-agents-720.webp` et `-480.webp`, affichées page Surveillance. La mention « Image d'illustration » est dans le texte alternatif ; la légende visible a été retirée le 12 octobre 2026 (choix de présentation). À ne pas envoyer dans la fiche Google, qui demande des photos réelles. |

`fiche-google/` contient les mêmes photos en JPEG, prêtes à être envoyées dans la fiche Google Business Profile.
