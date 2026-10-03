// Forty Services — une scène 3D réaliste par métier (Three.js r128)
// 0 Surveillance : ronde et contrôle d'accès · 1 Gardiennage : poste de garde, jour et nuit
// 2 Nettoyage de locaux : bureau passé à la serpillère · 3 Fin de chantier : remise en état
// Chaque scène est pensée seule (un décor, un agent). Piloté par l'événement « metier » (main.js).
(function () {
  if (typeof THREE === 'undefined') return;
  var F = {
    visibilite: function (el, cb) {
      if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { cb(es[0].isIntersecting); }).observe(el);
    }
  };
  var PETIT = window.matchMedia('(max-width: 920px)').matches;   // téléphone / petite tablette : rendu allégé
  var canvas = document.getElementById('scene3d');
  var vue = canvas && canvas.parentElement;
  var cadre = document.getElementById('accueil');
  if (!canvas || !vue || !cadre) return;

  var rendu;
  try {
    rendu = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    rendu.setClearColor(0x000000, 0);
  } catch (e) { cadre.classList.add('sans-3d'); return; }
  rendu.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  rendu.outputEncoding = THREE.sRGBEncoding;
  rendu.toneMapping = THREE.ACESFilmicToneMapping;
  rendu.toneMappingExposure = 0.92;
  rendu.shadowMap.enabled = true;
  rendu.shadowMap.type = THREE.PCFSoftShadowMap;

  var camera = new THREE.PerspectiveCamera(28, 1, 0.5, 140);

  /* ═════════ Couleurs (pipeline sRGB) ═════════ */
  function col(hex) { return new THREE.Color(hex).convertSRGBToLinear(); }
  var CYAN = 0x29A8DF, MARINE = 0x1B3A6B;
  var JOUR = 0xDCE7F2, NUIT = 0x0E2142;
  var SOL = 0xBFCBD8, MUR = 0xE9EDF2, TOIT = 0x1B3A6B, CADRE = 0x28323F;
  var registre = [];

  function mat(c, o) {
    o = o || {};
    var m = new THREE.MeshStandardMaterial({
      color: col(c), roughness: o.r == null ? 0.88 : o.r, metalness: o.m || 0,
      emissive: col(o.emissive || 0x000000), emissiveIntensity: o.ei || 0,
      envMapIntensity: o.env == null ? 0.4 : o.env
    });
    if (o.map) m.map = o.map;
    if (o.bump) { m.bumpMap = o.bump; m.bumpScale = o.bs || 0.6; }
    m.userData.env = m.envMapIntensity;
    registre.push(m);
    return m;
  }
  function teinte(m, hex) { m.color.copy(col(hex)); }
  function lum(geo, hex, opacite) {
    return new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: col(hex), transparent: opacite != null, opacity: opacite == null ? 1 : opacite }));
  }

  /* ═════════ Textures procédurales ═════════ */
  function texture(fn, rx, ry, couleur) {
    var c = document.createElement('canvas');
    c.width = c.height = 256;
    fn(c.getContext('2d'), 256);
    var t = new THREE.CanvasTexture(c);
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(rx, ry);
    t.anisotropy = 4;
    if (couleur) t.encoding = THREE.sRGBEncoding;
    return t;
  }
  function bruit(x, s, base, n, amp, taille) {
    x.fillStyle = base; x.fillRect(0, 0, s, s);
    for (var i = 0; i < n; i++) {
      var v = Math.floor(128 + (Math.random() - 0.5) * amp);
      x.fillStyle = 'rgb(' + v + ',' + v + ',' + v + ')';
      x.globalAlpha = 0.5;
      x.fillRect(Math.random() * s, Math.random() * s, taille, taille);
    }
    x.globalAlpha = 1;
  }
  var texHerbe = texture(function (x, s) {
    x.fillStyle = '#5FA878'; x.fillRect(0, 0, s, s);
    var tons = ['#4E9468', '#6DB687', '#56A072', '#3F8359', '#7CC095'];
    for (var i = 0; i < 2600; i++) {
      x.strokeStyle = tons[i % tons.length];
      x.lineWidth = 1.2;
      var px = Math.random() * s, py = Math.random() * s;
      x.beginPath(); x.moveTo(px, py); x.lineTo(px + (Math.random() - 0.5) * 3, py - 3 - Math.random() * 4); x.stroke();
    }
  }, 5, 4, true);
  var texAsphalte = texture(function (x, s) {
    bruit(x, s, '#6F7986', 3500, 70, 2);
  }, 6, 1, true);
  var bumpAsphalte = texture(function (x, s) { bruit(x, s, '#808080', 4500, 120, 2); }, 6, 1, false);
  var texBeton = texture(function (x, s) {
    bruit(x, s, '#B3BDC9', 2200, 50, 3);
    for (var i = 0; i < 14; i++) {
      x.fillStyle = 'rgba(120,130,142,0.07)';
      x.beginPath(); x.arc(Math.random() * s, Math.random() * s, 10 + Math.random() * 30, 0, 7); x.fill();
    }
  }, 4, 3, true);
  var bumpBeton = texture(function (x, s) { bruit(x, s, '#808080', 3000, 90, 2); }, 4, 3, false);
  var texPoussiere = texture(function (x, s) { bruit(x, s, '#B49F86', 3200, 60, 3); }, 3, 3, true);

  /* ═════════ Géométrie ═════════ */
  function geoRonde(w, h, d, r) {
    r = Math.min(r, w / 2 - 0.001, h / 2 - 0.001, d / 2 - 0.001);
    var s = new THREE.Shape(), a = (w - 2 * r) / 2, b = (h - 2 * r) / 2;
    s.moveTo(-a, -b); s.lineTo(a, -b); s.lineTo(a, b); s.lineTo(-a, b); s.closePath();
    var g = new THREE.ExtrudeGeometry(s, { depth: d - 2 * r, bevelEnabled: true, bevelThickness: r, bevelSize: r, bevelSegments: 3, curveSegments: 1, steps: 1 });
    g.translate(0, 0, -(d - 2 * r) / 2);
    return g;
  }
  // boîte (arrondie si r > 0) ; c = couleur hex ou matériau
  function boite(w, h, d, c, x, y, z, parent, ombre, r) {
    var geo = r ? geoRonde(w, h, d, r) : new THREE.BoxGeometry(w, h, d);
    var m = new THREE.Mesh(geo, c && c.isMaterial ? c : mat(c));
    m.position.set(x, y, z);
    m.castShadow = ombre !== false;
    m.receiveShadow = true;
    parent.add(m);
    return m;
  }
  function plan(g, w, d, x, y, z, m) {
    var p = new THREE.Mesh(new THREE.PlaneGeometry(w, d), m);
    p.rotation.x = -Math.PI / 2;
    p.position.set(x, y, z);
    p.receiveShadow = true;
    g.add(p);
    return p;
  }
  function creer() {
    registre = [];
    var s = new THREE.Scene();
    s.environment = ENV;
    var g = new THREE.Group();
    s.add(g);
    var hemi = new THREE.HemisphereLight(0xFFFFFF, 0xB7C4D4, 0.28);
    s.add(hemi);
    var sun = new THREE.DirectionalLight(0xFFF4E2, 2.1);
    sun.position.set(7, 12, 6);
    sun.castShadow = true;
    sun.shadow.mapSize.set(PETIT ? 1024 : 2048, PETIT ? 1024 : 2048);
    sun.shadow.camera.left = -9; sun.shadow.camera.right = 9;
    sun.shadow.camera.top = 9; sun.shadow.camera.bottom = -9;
    sun.shadow.camera.near = 1; sun.shadow.camera.far = 40;
    sun.shadow.radius = 5;
    sun.shadow.bias = -0.0004;
    s.add(sun);
    return { scene: s, g: g, hemi: hemi, sun: sun, mats: registre };
  }
  // dalle de terrain + ombre portée douce sous la maquette
  function plaque(g, w, d) {
    boite(w + 0.6, 0.3, d + 0.6, 0x14305A, 0, -0.5, 0, g, false);
    boite(w, 0.4, d, SOL, 0, -0.2, 0, g, false, 0.03);
    var c = document.createElement('canvas'); c.width = c.height = 128;
    var x = c.getContext('2d'), gr = x.createRadialGradient(64, 64, 10, 64, 64, 64);
    gr.addColorStop(0, 'rgba(10,25,50,0.5)'); gr.addColorStop(1, 'rgba(10,25,50,0)');
    x.fillStyle = gr; x.fillRect(0, 0, 128, 128);
    var ombre = new THREE.Mesh(new THREE.PlaneGeometry(w * 1.7, d * 1.7), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(c), transparent: true, depthWrite: false }));
    ombre.rotation.x = -Math.PI / 2; ombre.position.y = -0.69; g.add(ombre);
  }
  function pelouse(g, w, d, z) {
    var m = mat(0xFFFFFF, { map: texHerbe.clone(), r: 1 });
    m.map.needsUpdate = true;
    m.map.repeat.set(w * 0.6, d * 0.6);
    plan(g, w, d, 0, 0.012, z || 0, m);
  }
  function dallage(g, w, d, x, z) {
    var m = mat(0xFFFFFF, { map: texBeton.clone(), bump: bumpBeton, bs: 0.4, r: 0.95 });
    m.map.needsUpdate = true;
    m.map.repeat.set(w * 0.5, d * 0.5);
    plan(g, w, d, x, 0.03, z, m);
  }
  function arbre(g, x, z, k) {
    var a = new THREE.Group();
    var tronc = new THREE.Mesh(new THREE.CylinderGeometry(0.07 * k, 0.1 * k, 0.55 * k, 8), mat(0x6B5A48));
    tronc.position.y = 0.27 * k; tronc.castShadow = true; a.add(tronc);
    [[0, 0.95, 0, 0.5, 0x4FA67E], [0.18, 1.3, 0.05, 0.36, 0x5DB48A], [-0.12, 1.25, -0.1, 0.34, 0x42966F]].forEach(function (f) {
      var s = new THREE.Mesh(new THREE.IcosahedronGeometry(f[3] * k, 1), mat(f[4], { r: 0.95 }));
      s.position.set(f[0] * k, f[1] * k, f[2] * k); s.castShadow = true; a.add(s);
    });
    a.position.set(x, 0, z);
    g.add(a);
  }
  function arbuste(g, x, z, k) {
    for (var i = 0; i < 3; i++) {
      var s = new THREE.Mesh(new THREE.IcosahedronGeometry(0.22 * k, 1), mat(i % 2 ? 0x4FA67E : 0x5DB48A, { r: 0.95 }));
      s.scale.y = 0.8; s.position.set(x + i * 0.2 * k - 0.2 * k, 0.17 * k, z + (i % 2) * 0.1);
      s.castShadow = true; g.add(s);
    }
  }
  function cloture(g, fx, fz, gap) {
    var n1 = Math.round(2 * fx / 0.8), n2 = Math.round(2 * fz / 0.8), C = 0x7A8CA3;
    function p(x1, z1, x2, z2, n, saut) {
      for (var i = 0; i <= n; i++) {
        var x = x1 + (x2 - x1) * i / n, z = z1 + (z2 - z1) * i / n;
        if (saut && saut(x)) continue;
        var m = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.6, 8), mat(C, { m: 0.5, r: 0.45 }));
        m.position.set(x, 0.3, z); m.castShadow = true; g.add(m);
      }
    }
    p(-fx, -fz, fx, -fz, n1);
    p(-fx, -fz, -fx, fz, n2);
    p(fx, -fz, fx, fz, n2);
    p(-fx, fz, fx, fz, n1, function (x) { return Math.abs(x) < gap; });
    function rail(w, d, x, z) {
      boite(w, 0.035, d, mat(C, { m: 0.5, r: 0.45 }), x, 0.52, z, g, false);
      boite(w, 0.02, d, mat(C, { m: 0.5, r: 0.45 }), x, 0.14, z, g, false);
    }
    rail(2 * fx, 0.035, 0, -fz); rail(0.035, 2 * fz, -fx, 0); rail(0.035, 2 * fz, fx, 0);
    rail(fx - gap, 0.035, -(fx + gap) / 2, fz); rail(fx - gap, 0.035, (fx + gap) / 2, fz);
  }
  function palmier(g, x, z, k) {
    var a = new THREE.Group();
    var tronc = new THREE.Mesh(new THREE.CylinderGeometry(0.045 * k, 0.08 * k, 1.7 * k, 8), mat(0x8A6B4A, { r: 0.95 }));
    tronc.position.y = 0.85 * k; tronc.rotation.z = 0.08; tronc.castShadow = true; a.add(tronc);
    for (var i = 0; i < 8; i++) {
      var pivot = new THREE.Group();
      pivot.position.set(0.07 * k, 1.68 * k, 0);
      pivot.rotation.y = -(i / 8) * Math.PI * 2;
      pivot.rotation.z = -0.4;
      var feuille = new THREE.Mesh(new THREE.SphereGeometry(1, 8, 6), mat(i % 2 ? 0x3F9A66 : 0x4FAE78, { r: 0.9 }));
      feuille.scale.set(0.55 * k, 0.03 * k, 0.12 * k);
      feuille.position.x = 0.5 * k; feuille.castShadow = true;
      pivot.add(feuille);
      a.add(pivot);
    }
    a.position.set(x, 0, z);
    g.add(a);
  }
  function lampadaire(g, x, z, h, lampeMat) {
    var m = mat(0x4B5B70, { m: 0.6, r: 0.4 });
    var pole = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.06, h, 10), m);
    pole.position.set(x, h / 2, z); pole.castShadow = true; g.add(pole);
    boite(0.34, 0.06, 0.14, m, x + 0.12, h, z, g, true);
    var tete = new THREE.Mesh(new THREE.SphereGeometry(0.1, 12, 8), lampeMat || mat(0xFFF2CC, { emissive: 0xFFD98A, ei: 0.2 }));
    tete.position.set(x + 0.2, h - 0.07, z); g.add(tete);
    return tete;
  }

  // vitrage réaliste : cadre, intérieur sombre, vitre réfléchissante
  function vitre(g, w, h, x, y, z, axe, o) {
    o = o || {};
    var gr = new THREE.Group();
    gr.position.set(x, y, z);
    if (axe === 'x') gr.rotation.y = Math.PI / 2;
    var cm = mat(CADRE, { r: 0.4, m: 0.3 });
    var t = 0.05;
    boite(w, t, 0.07, cm, 0, h / 2, 0, gr, false); boite(w, t, 0.07, cm, 0, -h / 2, 0, gr, false);
    boite(t, h, 0.07, cm, -w / 2, 0, 0, gr, false); boite(t, h, 0.07, cm, w / 2, 0, 0, gr, false);
    if (w > 0.7) boite(0.03, h, 0.06, cm, 0, 0, 0, gr, false);
    var fond = mat(o.fond || 0x2B3A4D, { r: 0.9, emissive: o.lueur || 0x000000, ei: 0 });
    boite(w - 0.04, h - 0.04, 0.02, fond, 0, 0, -0.03, gr, false);
    var verre = new THREE.MeshPhysicalMaterial({
      color: col(o.teinte || 0x78B4DE), roughness: 0.05, metalness: 0.15, transparent: true, opacity: 0.5,
      envMapIntensity: 1.7, emissive: col(CYAN), emissiveIntensity: 0
    });
    verre.userData.env = 1.7;
    registre.push(verre);
    var p = new THREE.Mesh(new THREE.BoxGeometry(w - 0.04, h - 0.04, 0.02), verre);
    p.position.z = 0.01; gr.add(p);
    g.add(gr);
    return { verre: verre, fond: fond, groupe: gr };
  }

  /* ═════════ Personnage ═════════ */
  function humain(o) {
    o = o || {};
    var veste = o.veste || 0x1B3A6B, pantalon = o.pantalon || 0x131F33, chaussure = o.chaussure || 0x0B0F17;
    var peau = 0xDDB591, cheveux = 0x2B2119;
    var g = new THREE.Group();
    function cyl(rt, rb, h, c, r) {
      var m = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, 20), mat(c, { r: r == null ? 0.78 : r }));
      m.castShadow = true; return m;
    }
    function sph(r, c, sx, sy, sz, rug) {
      var m = new THREE.Mesh(new THREE.SphereGeometry(r, 20, 14), mat(c, { r: rug == null ? 0.7 : rug }));
      m.scale.set(sx || 1, sy || 1, sz || 1); m.castShadow = true; return m;
    }
    var torse = cyl(0.36, 0.31, 0.98, veste); torse.scale.z = 0.62; torse.position.y = 1.38; g.add(torse);
    var epaules = sph(0.38, veste, 1, 0.42, 0.62); epaules.position.y = 1.84; g.add(epaules);
    var hanches = cyl(0.33, 0.3, 0.26, pantalon); hanches.scale.z = 0.62; hanches.position.y = 0.88; g.add(hanches);
    var ceinture = cyl(0.335, 0.335, 0.07, 0x0B0F17, 0.5); ceinture.scale.z = 0.62; ceinture.position.y = 0.97; g.add(ceinture);
    var boucle = boite(0.07, 0.05, 0.02, mat(0xC9D2DC, { m: 0.8, r: 0.3 }), 0, 0.97, 0.215, g, false);
    var collier = cyl(0.14, 0.17, 0.1, 0xFFFFFF); collier.position.y = 1.95; g.add(collier);
    var cravate = boite(0.09, 0.52, 0.02, mat(o.cravate || CYAN, { r: 0.5 }), 0, 1.63, 0.205, g, false);
    var badge = boite(0.12, 0.09, 0.02, mat(CYAN, { emissive: CYAN, ei: 0.2 }), 0.2, 1.74, 0.205, g, false);
    var radio = boite(0.09, 0.18, 0.07, mat(0x111820, { r: 0.4 }), -0.3, 1.66, 0.12, g, true, 0.02);

    var tete = new THREE.Group(); tete.position.y = 2.15; g.add(tete);
    tete.add(sph(0.27, peau, 0.92, 1.08, 0.95, 0.6));
    [-1, 1].forEach(function (s) {
      var oreille = sph(0.055, peau, 0.6, 1, 0.8); oreille.position.set(s * 0.25, -0.01, 0); tete.add(oreille);
      var oeil = sph(0.026, 0x1A1410, 1, 1, 0.6, 0.3); oeil.position.set(s * 0.095, 0.03, 0.245); tete.add(oeil);
      var sourcil = boite(0.1, 0.02, 0.02, mat(cheveux), s * 0.095, 0.1, 0.235, tete, false); sourcil.rotation.z = -s * 0.15;
    });
    var nez = sph(0.045, peau, 0.8, 1, 1); nez.position.set(0, -0.02, 0.27); tete.add(nez);
    if (o.casquette !== false) {
      var calotte = cyl(0.285, 0.3, 0.16, 0x14243D, 0.7); calotte.position.y = 0.22; tete.add(calotte);
      var dessus = sph(0.285, 0x14243D, 1, 0.45, 1, 0.7); dessus.position.y = 0.29; tete.add(dessus);
      var visiere = new THREE.Mesh(new THREE.CylinderGeometry(0.31, 0.31, 0.035, 24, 1, false, -Math.PI / 2, Math.PI), mat(0x0F1A2E, { r: 0.45 }));
      visiere.position.set(0, 0.15, 0.04); visiere.scale.z = 1.2; visiere.rotation.x = 0.12; visiere.castShadow = true; tete.add(visiere);
      var bande = cyl(0.302, 0.302, 0.035, CYAN, 0.5); bande.position.y = 0.18; tete.add(bande);
      boite(0.1, 0.08, 0.02, mat(CYAN, { emissive: CYAN, ei: 0.3 }), 0, 0.24, 0.3, tete, false);
    } else {
      var cheveu = new THREE.Mesh(new THREE.SphereGeometry(0.285, 20, 12, 0, Math.PI * 2, 0, Math.PI * 0.55), mat(cheveux, { r: 0.9 }));
      cheveu.position.y = 0.03; cheveu.scale.set(0.95, 1, 1); cheveu.castShadow = true; tete.add(cheveu);
    }

    function bras(x) {
      var p = new THREE.Group(); p.position.set(x, 1.84, 0);
      var ep = sph(0.1, veste); p.add(ep);
      var haut = cyl(0.1, 0.085, 0.46, veste); haut.position.y = -0.24; p.add(haut);
      var bas = cyl(0.085, 0.07, 0.42, veste); bas.position.y = -0.65; p.add(bas);
      var manchette = cyl(0.075, 0.075, 0.04, 0xFFFFFF); manchette.position.y = -0.86; p.add(manchette);
      var main = sph(0.075, peau, 1, 1.1, 0.9); main.position.y = -0.92; p.add(main);
      g.add(p); return p;
    }
    function jambe(x) {
      var p = new THREE.Group(); p.position.set(x, 0.95, 0);
      var cuisse = cyl(0.15, 0.115, 0.52, pantalon); cuisse.position.y = -0.27; p.add(cuisse);
      var mollet = cyl(0.115, 0.095, 0.46, pantalon); mollet.position.y = -0.74; p.add(mollet);
      boite(0.2, 0.12, 0.42, mat(chaussure, { r: 0.45 }), 0, -0.94, 0.08, p, true, 0.04);
      g.add(p); return p;
    }
    var brasG = bras(-0.47), brasD = bras(0.47), jambeG = jambe(-0.19), jambeD = jambe(0.19);
    return { g: g, tete: tete, jambeG: jambeG, jambeD: jambeD, brasG: brasG, brasD: brasD };
  }

  /* ═════════ Utilitaires d'animation ═════════ */
  function tournerVers(obj, cibleY, k) {
    var d = cibleY - obj.rotation.y;
    d = Math.atan2(Math.sin(d), Math.cos(d));
    obj.rotation.y += d * k;
  }
  function lisser(x) { x = Math.max(0, Math.min(1, x)); return x * x * (3 - 2 * x); }
  function borne(x) { return Math.max(0, Math.min(1, x)); }
  function etoile(taille) {
    var g = new THREE.Group();
    var a = lum(new THREE.OctahedronGeometry(1), 0xFFFFFF); a.scale.set(0.09 * taille, 0.34 * taille, 0.09 * taille);
    var b = lum(new THREE.OctahedronGeometry(1), CYAN); b.scale.set(0.34 * taille, 0.09 * taille, 0.09 * taille);
    g.add(a, b);
    return g;
  }
  // manche + tête d'outil au sol (serpillère, balai)
  function outil(a, largeur, couleurTete) {
    var o = new THREE.Group();
    var bout = new THREE.Vector3(0.2, 0.06, 0.95), main = new THREE.Vector3(0.42, 1.2, 0.3);
    var dir = bout.clone().sub(main);
    var manche = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, dir.length(), 8), mat(0x5B6B7E, { r: 0.4, m: 0.4 }));
    manche.position.copy(main.clone().add(bout).multiplyScalar(0.5));
    manche.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());
    manche.castShadow = true;
    o.add(manche);
    var tete = boite(largeur, 0.1, 0.24, mat(couleurTete, { r: 1 }), bout.x, bout.y, bout.z, o, false, 0.03);
    a.g.add(o);
    a.brasD.rotation.x = -0.9;
    a.brasG.rotation.x = -0.7;
    return { o: o, tete: tete };
  }

  // environnement : ciel doux + panneaux lumineux, pour les reflets et l'éclairage ambiant
  var ENV = (function () {
    var pm = new THREE.PMREMGenerator(rendu);
    var s = new THREE.Scene();
    var c = document.createElement('canvas'); c.width = 4; c.height = 256;
    var x = c.getContext('2d'), gr = x.createLinearGradient(0, 0, 0, 256);
    gr.addColorStop(0, '#8DB8E6'); gr.addColorStop(0.5, '#E4EEF8'); gr.addColorStop(1, '#BCC8D4');
    x.fillStyle = gr; x.fillRect(0, 0, 4, 256);
    var tex = new THREE.CanvasTexture(c); tex.encoding = THREE.sRGBEncoding;
    s.add(new THREE.Mesh(new THREE.SphereGeometry(50, 32, 16), new THREE.MeshBasicMaterial({ map: tex, side: THREE.BackSide })));
    function panneau(px, py, pz, w, h, i) {
      var m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: new THREE.Color(i, i, i), side: THREE.DoubleSide }));
      m.position.set(px, py, pz); m.lookAt(0, 0, 0); s.add(m);
    }
    panneau(22, 26, 16, 20, 12, 5); panneau(-26, 16, 12, 14, 9, 2.2); panneau(0, 30, -20, 22, 8, 2.5);
    var rt = pm.fromScene(s, 0.02);
    pm.dispose();
    return rt.texture;
  })();

  /* ═════════ 0 · SURVEILLANCE : ronde et contrôle d'accès ═════════ */
  function sceneSurveillance() {
    var o = creer(), g = o.g;
    plaque(g, 9, 6.4);
    pelouse(g, 8.4, 5.8);
    dallage(g, 1.3, 2.6, 0, 2.0);
    dallage(g, 3.6, 0.8, 0, 0.9);

    // hôtel à protéger : trois niveaux, balcons, hall vitré, enseigne
    var creme = mat(0xF1ECE2, { r: 0.75 }), pierre = mat(0xD9D2C4, { r: 0.8 }), acierH = mat(0x7D8FA5, { m: 0.6, r: 0.4 });
    boite(4.4, 3.4, 2.2, creme, 0, 1.7, -0.9, g, true, 0.04);
    boite(4.6, 0.16, 2.4, mat(TOIT, { r: 0.55 }), 0, 3.48, -0.9, g, true, 0.04);
    boite(1.2, 0.35, 0.8, mat(0xA9B6C6, { m: 0.5, r: 0.5 }), -1.3, 3.74, -1.2, g, true, 0.02);
    [1.1, 2.2].forEach(function (y) { boite(4.5, 0.07, 2.3, pierre, 0, y, -0.9, g, false); });
    var chambres = [];
    [1.65, 2.8].forEach(function (y) {
      [-1.65, -0.55, 0.55, 1.65].forEach(function (x) {
        var v = vitre(g, 0.7, 0.72, x, y, 0.22, 'z', { lueur: 0xFFE2A8, fond: 0x3A4658 });
        v.fond.emissiveIntensity = Math.random() < 0.35 ? 0.5 : 0;           // quelques chambres éclairées
        chambres.push(v);
        boite(0.95, 0.05, 0.3, pierre, x, y - 0.42, 0.36, g, true);           // balcon
        boite(0.95, 0.03, 0.02, acierH, x, y - 0.3, 0.5, g, false);
      });
    });
    // hall : grandes baies vitrées, porte tambour, auvent
    vitre(g, 1.15, 0.9, -1.45, 0.55, 0.22, 'z', { lueur: 0xFFE2A8, fond: 0x3A4658 }).fond.emissiveIntensity = 0.3;
    vitre(g, 1.15, 0.9, 1.45, 0.55, 0.22, 'z', { lueur: 0xFFE2A8, fond: 0x3A4658 }).fond.emissiveIntensity = 0.3;
    var tambour = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 0.9, 20, 1, true),
      new THREE.MeshPhysicalMaterial({ color: col(0x9CC9E8), roughness: 0.05, metalness: 0.1, transparent: true, opacity: 0.45, side: THREE.DoubleSide, envMapIntensity: 1.6 }));
    registre.push(tambour.material);
    tambour.position.set(0, 0.5, 0.42); g.add(tambour);
    var pales = new THREE.Group();
    [0, Math.PI / 2].forEach(function (r) { var p = boite(0.7, 0.8, 0.03, acierH, 0, 0, 0, pales, false); p.rotation.y = r; });
    pales.position.set(0, 0.5, 0.42); g.add(pales);
    boite(2.2, 0.08, 1.0, mat(CYAN, { r: 0.45, emissive: CYAN, ei: 0.08 }), 0, 1.02, 0.78, g, true, 0.02);
    [-0.95, 0.95].forEach(function (x) {
      var col2 = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 1.0, 10), acierH);
      col2.position.set(x, 0.5, 1.2); col2.castShadow = true; g.add(col2);
    });
    // enseigne sur le toit
    var cv = document.createElement('canvas'); cv.width = 512; cv.height = 128;
    var cx = cv.getContext('2d');
    cx.fillStyle = '#14305A'; cx.fillRect(0, 0, 512, 128);
    cx.strokeStyle = '#29A8DF'; cx.lineWidth = 6; cx.strokeRect(6, 6, 500, 116);
    cx.fillStyle = '#FFFFFF'; cx.font = '700 74px system-ui, sans-serif'; cx.textAlign = 'center'; cx.textBaseline = 'middle';
    cx.fillText('H\u00d4TEL', 256, 70);
    var tex = new THREE.CanvasTexture(cv); tex.encoding = THREE.sRGBEncoding; tex.anisotropy = 4;
    var enseigne = new THREE.Mesh(new THREE.PlaneGeometry(1.9, 0.475), new THREE.MeshBasicMaterial({ map: tex }));
    enseigne.position.set(0, 4.0, 0.32); g.add(enseigne);
    boite(1.9, 0.475, 0.05, mat(0x14305A), 0, 4.0, 0.28, g, false);
    [-0.8, 0.8].forEach(function (x) { boite(0.05, 0.3, 0.05, acierH, x, 3.7, 0.28, g, false); });
    var porte = { verre: { emissiveIntensity: 0 } }, fenetres = chambres;

    cloture(g, 3.9, 2.7, 0.9);
    arbre(g, -3.3, -2.0, 1); arbre(g, 3.3, -2.0, 1.1);
    palmier(g, -2.7, 1.0, 1.1); palmier(g, 2.7, 1.0, 1.0); palmier(g, -3.2, -0.3, 0.9);
    arbuste(g, -1.5, 0.75, 1); arbuste(g, 1.5, 0.75, 1);
    lampadaire(g, -1.0, 1.5, 1.9); lampadaire(g, 1.0, 1.5, 1.9);

    // portail et lecteur de badge
    var acier = mat(0x7D8FA5, { m: 0.6, r: 0.4 });
    boite(0.16, 0.9, 0.16, acier, -0.9, 0.45, 2.7, g, true, 0.02);
    boite(0.16, 0.9, 0.16, acier, 0.9, 0.45, 2.7, g, true, 0.02);
    var pivot = new THREE.Group();
    pivot.position.set(-0.9, 0.8, 2.7);
    g.add(pivot);
    for (var i = 0; i < 5; i++) boite(0.36, 0.09, 0.09, mat(i % 2 ? 0xFFFFFF : 0xE0533D, { r: 0.5 }), 0.2 + i * 0.36, 0, 0, pivot, true, 0.02);
    var lecteurM = mat(CYAN, { emissive: CYAN, ei: 0.4 });
    boite(0.2, 0.7, 0.2, acier, 1.45, 0.35, 2.3, g, true, 0.03);
    boite(0.16, 0.16, 0.05, lecteurM, 1.45, 0.62, 2.41, g, false);

    // parcours de la ronde et ses quatre points de contrôle
    var courbe = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-3.4, 0.06, -2.2), new THREE.Vector3(0, 0.06, -2.2), new THREE.Vector3(3.4, 0.06, -2.2),
      new THREE.Vector3(3.4, 0.06, 0), new THREE.Vector3(3.4, 0.06, 2.2), new THREE.Vector3(0, 0.06, 2.2),
      new THREE.Vector3(-3.4, 0.06, 2.2), new THREE.Vector3(-3.4, 0.06, 0)
    ], true, 'catmullrom', 0.25);
    g.add(new THREE.Mesh(new THREE.TubeGeometry(courbe, 160, 0.035, 6, true), new THREE.MeshBasicMaterial({ color: col(CYAN), transparent: true, opacity: 0.55 })));
    var points = [[-3.4, -2.2], [3.4, -2.2], [3.4, 2.2], [-3.4, 2.2]].map(function (p) {
      var m = mat(0xA9B6C6, { emissive: CYAN, ei: 0, r: 0.3 });
      var pot = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 0.7, 10), mat(0x5B6B7E, { m: 0.5, r: 0.4 }));
      pot.position.set(p[0], 0.35, p[1]); pot.castShadow = true; g.add(pot);
      var bulbe = new THREE.Mesh(new THREE.SphereGeometry(0.17, 18, 14), m);
      bulbe.position.set(p[0], 0.85, p[1]);
      g.add(bulbe);
      return { x: p[0], z: p[1], m: m, lit: 0 };
    });

    // l'agent, lampe torche allumée
    var a = humain({});
    a.g.scale.setScalar(0.5);
    g.add(a.g);
    var faisceau = new THREE.Mesh(
      new THREE.ConeGeometry(0.55, 1.7, 24, 1, true),
      new THREE.MeshBasicMaterial({ color: col(0xBFE8FA), transparent: true, opacity: 0.22, side: THREE.DoubleSide, depthWrite: false })
    );
    faisceau.rotation.x = -Math.PI / 2;
    faisceau.position.set(0, 1.0, 0.4 + 0.85);
    a.g.add(faisceau);
    a.brasD.rotation.x = -0.9;

    return {
      o: o, cam: { t: new THREE.Vector3(0, 1.1, 0), d: 17.5 },
      anim: function (t, dt) {
        var u = (t * 0.04) % 1;
        var p = courbe.getPointAt(u), tg = courbe.getTangentAt(u);
        a.g.position.x = p.x; a.g.position.z = p.z;
        tournerVers(a.g, Math.atan2(tg.x, tg.z), 0.15);
        var pas = Math.sin(t * 7);
        a.jambeG.rotation.x = pas * 0.55;
        a.jambeD.rotation.x = -pas * 0.55;
        a.brasG.rotation.x = -pas * 0.4;
        a.g.position.y = Math.abs(pas) * 0.03;
        points.forEach(function (c) {
          var d = Math.hypot(c.x - p.x, c.z - p.z);
          if (d < 0.9) c.lit = 1; else c.lit = Math.max(0, c.lit - dt * 0.35);
          c.m.emissiveIntensity = c.lit * 1.4;
          teinte(c.m, c.lit > 0.05 ? 0x7FD6F7 : 0xA9B6C6);
        });
        var proche = Math.hypot(p.x, p.z - 2.2) < 1.8;
        pivot.rotation.z += ((proche ? 1.15 : 0) - pivot.rotation.z) * 0.08;
        lecteurM.emissiveIntensity = 0.3 + (proche ? 0.8 : 0) + Math.sin(t * 4) * 0.1;
      }
    };
  }

  /* ═════════ 1 · GARDIENNAGE : poste de garde, jour comme nuit ═════════ */
  function sceneGardiennage() {
    var o = creer(), g = o.g;
    plaque(g, 9, 6.4);
    pelouse(g, 8.4, 5.8);
    // route
    var route = mat(0xFFFFFF, { map: texAsphalte.clone(), bump: bumpAsphalte, bs: 0.5, r: 0.95 });
    route.map.needsUpdate = true; route.map.repeat.set(5, 1);
    plan(g, 9.4, 1.7, 0, 0.03, 2.2, route);
    for (var i = -4; i <= 4; i++) plan(g, 0.5, 0.07, i * 1.0, 0.045, 2.2, mat(0xF4F4F0, { r: 0.8 }));
    boite(9.4, 0.08, 0.1, mat(0xB8C2CE, { r: 0.9 }), 0, 0.05, 1.3, g, false);
    boite(9.4, 0.08, 0.1, mat(0xB8C2CE, { r: 0.9 }), 0, 0.05, 3.1, g, false);
    dallage(g, 2.6, 1.4, -1.6, 0.75);

    // poste de garde : murs, grandes baies vitrées, toit débordant
    boite(1.5, 1.8, 1.3, mat(MUR, { r: 0.7 }), -1.6, 0.9, -0.3, g, true, 0.03);
    boite(1.9, 0.12, 1.7, mat(TOIT, { r: 0.55 }), -1.6, 1.88, -0.3, g, true, 0.03);
    var baie = vitre(g, 1.0, 0.72, -1.55, 1.15, 0.37, 'z', { lueur: 0xFFE2A8, fond: 0x3A4658 });
    var baie2 = vitre(g, 0.7, 0.72, -0.84, 1.15, -0.3, 'x', { lueur: 0xFFE2A8, fond: 0x3A4658 });
    boite(0.55, 0.9, 0.06, mat(CADRE, { r: 0.4, m: 0.3 }), -2.15, 0.45, 0.37, g, false);
    // intérieur visible : bureau et écran
    boite(0.8, 0.06, 0.4, mat(0xDDE4EC), -1.5, 0.7, -0.15, g, false);
    boite(0.3, 0.2, 0.03, mat(CYAN, { emissive: CYAN, ei: 0.8 }), -1.5, 0.9, -0.28, g, false);
    arbre(g, -3.6, -1.8, 1); arbre(g, 3.5, -1.8, 1.1); arbre(g, 3.6, 0.2, 0.9);
    arbuste(g, 0.2, -0.4, 1); arbuste(g, -3.0, 0.1, 1);

    // barrière
    var acier = mat(0x7D8FA5, { m: 0.6, r: 0.4 });
    boite(0.18, 0.9, 0.18, acier, 0.9, 0.45, 1.35, g, true, 0.02);
    var pivot = new THREE.Group();
    pivot.position.set(0.9, 0.85, 1.35);
    g.add(pivot);
    for (var k = 0; k < 5; k++) boite(0.09, 0.09, 0.36, mat(k % 2 ? 0xFFFFFF : 0xE0533D, { r: 0.5 }), 0, 0, 0.2 + k * 0.36, pivot, true, 0.02);

    // lampadaire
    var lampe = mat(0xFFF2CC, { emissive: 0xFFD98A, ei: 0 });
    lampadaire(g, -3.1, 0.9, 2.0, lampe);
    var feu = new THREE.PointLight(0xFFD98A, 0, 8, 2);
    feu.position.set(-2.9, 1.9, 0.9);
    g.add(feu);

    // l'agent, carnet de comptes rendus
    var a = humain({});
    a.g.scale.setScalar(0.55);
    a.g.position.set(-1.1, 0, 0.85);
    a.g.rotation.y = 0.35;
    g.add(a.g);
    var carnet = new THREE.Group();
    var planche = lum(new THREE.BoxGeometry(0.36, 0.48, 0.04), 0xFFFFFF);
    carnet.add(planche);
    carnet.position.set(0, -0.85, 0.2);
    carnet.rotation.x = 1.15;
    a.brasD.add(carnet);
    a.brasD.rotation.x = -1.15;

    // véhicule
    var voit = new THREE.Group();
    var carrosserie = mat(0x2A528F, { r: 0.28, m: 0.5, env: 1.1 });
    boite(1.55, 0.42, 0.82, carrosserie, 0, 0.4, 0, voit, true, 0.09);
    boite(0.85, 0.34, 0.74, carrosserie, -0.1, 0.78, 0, voit, true, 0.1);
    var parebrise = new THREE.MeshPhysicalMaterial({ color: col(0x14202E), roughness: 0.05, metalness: 0.2, envMapIntensity: 1.8 });
    registre.push(parebrise);
    boite(0.8, 0.26, 0.76, parebrise, -0.1, 0.8, 0, voit, false, 0.06);
    var phare = mat(0xFFFFFF, { emissive: 0xFFF2CC, ei: 0.1 });
    var feuAr = mat(0xFF3B30, { emissive: 0xFF3B30, ei: 0.2 });
    [-0.27, 0.27].forEach(function (z) {
      boite(0.04, 0.09, 0.16, phare, 0.78, 0.42, z, voit, false);
      boite(0.04, 0.09, 0.16, feuAr, -0.78, 0.42, z, voit, false);
    });
    [[-0.5, 0.42], [0.5, 0.42], [-0.5, -0.42], [0.5, -0.42]].forEach(function (w) {
      var r = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.17, 0.14, 18), mat(0x151B26, { r: 0.7 }));
      r.rotation.x = Math.PI / 2; r.position.set(w[0], 0.17, w[1]); r.castShadow = true; voit.add(r);
      var j = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.15, 14), mat(0xC9D2DC, { m: 0.9, r: 0.25 }));
      j.rotation.x = Math.PI / 2; j.position.set(w[0], 0.17, w[1] * 1.02); voit.add(j);
    });
    voit.position.set(-7, 0, 2.2);
    g.add(voit);

    var soleil = lum(new THREE.SphereGeometry(0.3, 18, 14), 0xFFC94D);
    var lune = lum(new THREE.SphereGeometry(0.26, 18, 14), 0xEEF3FA);
    g.add(soleil, lune);

    var cJour = col(JOUR), cNuit = col(NUIT);
    return {
      o: o, cam: { t: new THREE.Vector3(0, 0.8, 0.9), d: 14 },
      anim: function (t) {
        var ang = (t % 20) / 20 * Math.PI * 2;
        var jour = borne(0.5 + Math.sin(ang) * 0.8);
        var nuit = 1 - jour;
        o.hemi.intensity = 0.12 + 0.3 * jour;
        o.sun.intensity = 0.25 + 1.85 * jour;
        o.sun.color.copy(col(jour > 0.4 ? 0xFFF4E2 : 0x8FA9E8));
        o.mats.forEach(function (m) { m.envMapIntensity = m.userData.env * (0.12 + 0.88 * jour); });
        baie.fond.emissiveIntensity = baie2.fond.emissiveIntensity = 0.15 + nuit * 1.1;
        lampe.emissiveIntensity = 0.1 + nuit * 1.6;
        feu.intensity = nuit * 2.2;
        phare.emissiveIntensity = 0.1 + nuit * 2.2;
        feuAr.emissiveIntensity = 0.2 + nuit * 1.2;
        soleil.position.set(Math.cos(ang) * 4.6, 2.2 + Math.sin(ang) * 2.6, -2.6);
        lune.position.set(-Math.cos(ang) * 4.6, 2.2 - Math.sin(ang) * 2.6, -2.6);
        soleil.visible = soleil.position.y > 0.3;
        lune.visible = lune.position.y > 0.3;

        var u = t % 12, x;
        if (u < 2.6) x = -6.5 + 6.1 * (1 - Math.pow(1 - u / 2.6, 2));
        else if (u < 4.6) x = -0.4;
        else if (u < 7.6) { var q = (u - 4.6) / 3; x = -0.4 + 7.4 * q * q; }
        else x = 7;
        voit.position.x = x;
        var ouvert = u > 3.4 && u < 6.4;
        pivot.rotation.x += ((ouvert ? -1.2 : 0) - pivot.rotation.x) * 0.08;

        var visible = x > -5 && x < 5;
        var cibleTete = visible ? Math.max(-1.0, Math.min(1.0, Math.atan2(x - a.g.position.x, 1.4) - 0.35)) : Math.sin(t * 0.9) * 0.5;
        a.tete.rotation.y += (cibleTete - a.tete.rotation.y) * 0.1;
        a.brasD.rotation.x = -1.15 + Math.sin(t * 3) * 0.04;
        a.g.position.y = Math.sin(t * 1.6) * 0.012;
      }
    };
  }

  /* ═════════ 2 · NETTOYAGE DE LOCAUX : un bureau passé à la serpillère ═════════ */
  function sceneNettoyage() {
    var o = creer(), g = o.g;
    plaque(g, 7.6, 5.2);
    // dalles de carrelage : ternes au départ, brillantes et réfléchissantes une fois passées
    var DULL = col(0xAEB9C5), PROPRE = col(0xF4FAFF);
    var dalles = [];
    for (var r = 0; r < 4; r++) {
      for (var c = 0; c < 7; c++) {
        var m = mat(0xAEB9C5, { r: 0.85, env: 0.3, emissive: CYAN, ei: 0, map: texBeton, bump: bumpBeton, bs: 0.3 });
        var x = -3 + c, z = -1.725 + r * 1.15;
        boite(0.97, 0.05, 1.12, m, x, 0.03, z, g, false);
        dalles.push({ m: m, x: x, z: z, k: 0, tint: (Math.random() - 0.5) * 0.06 });
      }
    }
    // murs, plinthes, fenêtres
    var mur = mat(MUR, { r: 0.75 });
    boite(7.6, 2.4, 0.2, mur, 0, 1.2, -2.6, g, true);
    boite(0.2, 2.4, 5.2, mur, -3.8, 1.2, 0, g, true);
    boite(7.4, 0.12, 0.06, mat(0xC4CED9), 0, 0.08, -2.47, g, false);
    boite(0.06, 0.12, 5.0, mat(0xC4CED9), -3.67, 0.08, 0, g, false);
    boite(7.6, 0.1, 0.24, mat(TOIT), 0, 2.45, -2.6, g, false);
    boite(0.24, 0.1, 5.2, mat(TOIT), -3.8, 2.45, 0, g, false);
    [-2.4, -0.9].forEach(function (xx) { vitre(g, 1.2, 1.0, xx, 1.4, -2.48, 'z'); });
    [-1.3, -0.1].forEach(function (zz) { vitre(g, 1.0, 1.0, -3.68, 1.4, zz, 'x'); });

    // mobilier
    var bois = mat(0xE8EDF3, { r: 0.55 }), gris = mat(0x9FB0C2, { m: 0.4, r: 0.45 }), siege = mat(0x2A528F, { r: 0.65 });
    function bureau(bx, bz) {
      boite(1.8, 0.07, 0.8, bois, bx, 0.75, bz, g, true, 0.02);
      boite(0.06, 0.72, 0.7, gris, bx - 0.8, 0.36, bz, g, true);
      boite(0.06, 0.72, 0.7, gris, bx + 0.8, 0.36, bz, g, true);
      boite(0.5, 0.32, 0.04, mat(0x1A2230, { r: 0.3 }), bx, 1.06, bz - 0.2, g, true, 0.01);
      boite(0.46, 0.27, 0.02, mat(CYAN, { emissive: CYAN, ei: 0.6, r: 0.2 }), bx, 1.06, bz - 0.18, g, false);
      boite(0.06, 0.18, 0.06, gris, bx, 0.9, bz - 0.2, g, false);
      boite(0.4, 0.015, 0.14, mat(0x2B3441), bx, 0.8, bz + 0.05, g, false);
      boite(0.5, 0.08, 0.5, siege, bx, 0.45, bz + 0.65, g, true, 0.03);
      boite(0.5, 0.5, 0.08, siege, bx, 0.75, bz + 0.9, g, true, 0.03);
      var pied = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.4, 8), gris);
      pied.position.set(bx, 0.22, bz + 0.65); g.add(pied);
    }
    bureau(0.6, -1.95); bureau(2.4, -1.95);
    boite(0.5, 1.1, 0.5, gris, -2.9, 0.55, -2.15, g, true, 0.02);      // classeur
    var pot = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.15, 0.36, 14), mat(0xE8EDF3, { r: 0.5 }));
    pot.position.set(3.3, 0.18, -2.1); pot.castShadow = true; g.add(pot);
    for (var f = 0; f < 5; f++) {
      var fe = new THREE.Mesh(new THREE.IcosahedronGeometry(0.2, 1), mat(f % 2 ? 0x4FA67E : 0x5DB48A, { r: 0.9 }));
      fe.position.set(3.3 + Math.cos(f * 1.3) * 0.15, 0.6 + (f % 3) * 0.12, -2.1 + Math.sin(f * 1.3) * 0.15); fe.castShadow = true; g.add(fe);
    }

    // tableau de contrôle qui se coche
    boite(0.08, 1.5, 1.3, mat(0xFFFFFF, { r: 0.5 }), -3.62, 1.3, 1.9, g, false, 0.02);
    boite(0.1, 0.1, 1.3, mat(0x14305A), -3.62, 2.1, 1.9, g, false);
    var coches = [];
    for (var n = 0; n < 4; n++) {
      var ml = mat(0xC9D3DE, { emissive: CYAN, ei: 0 });
      boite(0.04, 0.2, 0.2, ml, -3.56, 1.7 - n * 0.32, 1.9, g, false);
      boite(0.03, 0.04, 0.6, mat(0xB0BAC6), -3.56, 1.7 - n * 0.32, 2.25, g, false);
      coches.push(ml);
    }

    // chariot de ménage
    boite(0.7, 0.4, 0.45, mat(0x2A528F, { r: 0.5 }), 3.1, 0.25, 1.95, g, true, 0.04);
    var seau = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.12, 0.28, 16), mat(CYAN, { r: 0.4 }));
    seau.position.set(3.2, 0.62, 1.95); seau.castShadow = true; g.add(seau);
    [[2.85, 1.75], [3.35, 1.75], [2.85, 2.15], [3.35, 2.15]].forEach(function (w) {
      var rr = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.04, 10), mat(0x151B26)); rr.rotation.x = Math.PI / 2; rr.position.set(w[0], 0.06, w[1]); g.add(rr);
    });

    // l'agent : deux passages pour couvrir tout le sol
    var a = humain({ veste: 0x1F8FBF, pantalon: 0x2A3445, cravate: 0xFFFFFF, casquette: false, chaussure: 0xEEF2F6 });
    a.g.scale.setScalar(0.5);
    g.add(a.g);
    var mop = outil(a, 0.5, 0xF4F7FA);

    var L1 = 6.6, L2 = 2.3, L = L1 + L2 + L1, VIT = 1.4, RUN = L / VIT, PERIODE = RUN + 3.5;
    function pos(s) {
      if (s < L1) return { x: -3.3 + s, z: -1.15, ry: Math.PI / 2 };
      if (s < L1 + L2) return { x: 3.3, z: -1.15 + (s - L1), ry: 0 };
      return { x: 3.3 - (s - L1 - L2), z: 1.15, ry: -Math.PI / 2 };
    }
    dalles.forEach(function (d) { d.s = d.z < 0 ? Math.abs(d.x + 3.3) : L1 + L2 + Math.abs(3.3 - d.x); });
    var etoiles = [];
    [4, 9, 15, 20, 24].forEach(function (i) {
      var e = etoile(1.0);
      e.position.set(dalles[i].x, 0.5, dalles[i].z);
      e.scale.setScalar(0.0001);
      g.add(e);
      etoiles.push({ o: e, i: i, p: Math.random() * 6 });
    });

    return {
      o: o, cam: { t: new THREE.Vector3(0, 0.7, 0), d: 14.5 },
      anim: function (t) {
        var u = t % PERIODE;
        var s = u < RUN ? u * VIT : L;
        var fade = u > RUN + 2.5 ? 1 - (u - RUN - 2.5) : 1;
        var q = pos(s);
        a.g.visible = u < RUN + 2.5;
        a.g.position.x = q.x; a.g.position.z = q.z;
        if (u < 0.1) a.g.rotation.y = q.ry; else tournerVers(a.g, q.ry, 0.14);
        var marche = u < RUN ? 1 : 0;
        var pas = Math.sin(t * 6.5) * marche;
        a.jambeG.rotation.x = pas * 0.5;
        a.jambeD.rotation.x = -pas * 0.5;
        a.g.position.y = Math.abs(pas) * 0.03;
        mop.tete.position.x = 0.2 + Math.sin(t * 6.5) * 0.18 * marche;

        dalles.forEach(function (d) {
          var but = (s >= d.s - 0.2 ? 1 : 0) * fade;
          d.k += (but - d.k) * (but < d.k ? 0.3 : 0.18);
          d.m.color.copy(DULL).lerp(PROPRE, d.k);
          d.m.color.offsetHSL(0, 0, d.tint * (1 - d.k));
          d.m.emissiveIntensity = d.k * 0.12;
          d.m.roughness = 0.85 - d.k * 0.72;          // le sol propre devient brillant
          d.m.envMapIntensity = 0.3 + d.k * 1.4;      // et reflète l'environnement
        });
        coches.forEach(function (m, n) {
          var fait = s >= L * (n + 1) / 4 - 0.3 && fade > 0.5;
          m.emissiveIntensity += ((fait ? 1.2 : 0) - m.emissiveIntensity) * 0.15;
          teinte(m, fait ? 0x6FD6F7 : 0xC9D3DE);
        });
        etoiles.forEach(function (e) {
          var on = dalles[e.i].k > 0.9;
          e.o.scale.setScalar(0.0001 + (on ? Math.max(0, Math.sin(t * 2.4 + e.p)) * 0.9 : 0));
          e.o.rotation.y = t * 0.8;
        });
      }
    };
  }

  /* ═════════ 3 · FIN DE CHANTIER : remise en état complète ═════════ */
  function sceneChantier() {
    var o = creer(), g = o.g;
    plaque(g, 10, 6);
    // sol de chantier en béton
    var sol = mat(0xFFFFFF, { map: texBeton.clone(), bump: bumpBeton, bs: 0.5, r: 0.95 });
    sol.map.needsUpdate = true; sol.map.repeat.set(5, 3);
    plan(g, 9.6, 5.6, 0, 0.02, 0, sol);

    // bâtiment livré
    boite(6.4, 2.8, 2.0, mat(MUR, { r: 0.75 }), 0.3, 1.4, -1.6, g, true, 0.04);
    boite(6.65, 0.16, 2.25, mat(TOIT, { r: 0.55 }), 0.3, 2.88, -1.6, g, true, 0.04);
    boite(6.4, 0.2, 0.05, mat(0xC9D3DE), 0.3, 0.1, -0.58, g, false);
    boite(0.9, 1.1, 0.08, mat(CADRE, { r: 0.4, m: 0.3 }), 0.3, 0.55, -0.57, g, false);
    vitre(g, 0.78, 1.0, 0.3, 0.55, -0.54, 'z');
    var vitres = [];
    [-1.9, -0.6, 1.2, 2.5].forEach(function (x) {
      [0.95, 2.05].forEach(function (y) {
        var v = vitre(g, 0.9, 0.8, x, y, -0.55, 'z');
        // voile de saleté devant la vitre, qui disparaît au nettoyage
        var film = new THREE.Mesh(new THREE.PlaneGeometry(0.86, 0.76), new THREE.MeshBasicMaterial({ color: col(0x8A8F96), transparent: true, opacity: 0.62, depthWrite: false }));
        film.position.set(x, y, -0.5);
        g.add(film);
        vitres.push({ v: v, film: film, x: x });
      });
    });
    // échafaudage devant la partie gauche
    var echaf = [];
    var tube = mat(0x8394A8, { m: 0.7, r: 0.4 });
    [-2.8, -1.7, -0.6, 0.5].forEach(function (x) {
      var p = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 2.4, 8), tube);
      p.position.set(x, 1.2, -0.2); p.castShadow = true; g.add(p); echaf.push(p);
    });
    [0.6, 1.3, 2.0].forEach(function (y) {
      var p = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 3.4, 8), tube);
      p.rotation.z = Math.PI / 2; p.position.set(-1.15, y, -0.2); p.castShadow = true; g.add(p); echaf.push(p);
      var planche = boite(3.4, 0.05, 0.35, mat(0xB08D63, { r: 0.9 }), -1.15, y + 0.04, -0.05, g, true);
      echaf.push(planche);
    });
    echaf.forEach(function (e) { e.userData.x = e.position.x; });

    // poussière au sol : bandes qui disparaissent au passage
    var bandes = [];
    for (var i = 0; i < 20; i++) {
      var m = mat(0xFFFFFF, { map: texPoussiere, r: 1 });
      m.transparent = true; m.opacity = 1;
      var b = boite(0.5, 0.03, 4.4, m, -4.75 + i * 0.5, 0.045, 1.2, g, false);
      bandes.push({ m: m, x: b.position.x });
    }
    // gravats organiques, sacs, palette, cônes
    var gravats = [];
    [[-4.2, 1.0], [-3.4, 2.4], [-2.6, 0.7], [-1.8, 2.8], [-0.9, 1.4], [0.1, 2.5], [0.8, 0.9], [1.6, 2.2], [2.4, 1.1], [3.1, 2.7], [3.8, 1.6], [-0.2, 3.0], [-3.0, 1.9], [2.0, 3.0]].forEach(function (p, k) {
      var sz = 0.12 + (k % 3) * 0.06;
      var b = new THREE.Mesh(new THREE.DodecahedronGeometry(sz, 0), mat(k % 2 ? 0x858E9A : 0x9A8A76, { r: 0.95 }));
      b.position.set(p[0], sz * 0.6 + 0.05, p[1]); b.rotation.set(k, k * 0.7, k * 0.3); b.castShadow = true; b.receiveShadow = true;
      g.add(b); gravats.push({ o: b, x: p[0] });
    });
    [[-1.3, 2.0], [-1.0, 2.3], [3.4, 2.3]].forEach(function (p) {
      var sac = new THREE.Mesh(new THREE.SphereGeometry(0.28, 14, 10), mat(0xC9B79C, { r: 1 }));
      sac.scale.set(1.1, 0.6, 0.8); sac.position.set(p[0], 0.2, p[1]); sac.castShadow = true; g.add(sac);
      gravats.push({ o: sac, x: p[0] });
    });
    gravats.push({ o: boite(0.9, 0.12, 0.9, mat(0xB08D63, { r: 0.9 }), 1.1, 0.1, 1.9, g, true), x: 1.1 });
    [[-2.2, 3.0], [2.8, 0.6]].forEach(function (p) {
      var cone = new THREE.Mesh(new THREE.ConeGeometry(0.17, 0.55, 14), mat(0xF2762E, { r: 0.6 }));
      cone.position.set(p[0], 0.28, p[1]); cone.castShadow = true; g.add(cone);
      var bande = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.12, 0.08, 14), mat(0xFFFFFF, { r: 0.6 }));
      bande.position.set(p[0], 0.3, p[1]); g.add(bande);
      gravats.push({ o: cone, x: p[0] }); gravats.push({ o: bande, x: p[0] });
    });
    boite(1.3, 0.65, 0.7, mat(0x2A528F, { r: 0.5, m: 0.3 }), 4.1, 0.37, -0.1, g, true, 0.03);     // benne
    arbre(g, 4.4, -2.4, 1); arbre(g, -4.4, -2.4, 1);

    // ligne de nettoyage
    var planL = new THREE.Mesh(new THREE.PlaneGeometry(5.0, 2.8), new THREE.MeshBasicMaterial({ color: col(CYAN), transparent: true, opacity: 0.12, side: THREE.DoubleSide, depthWrite: false }));
    planL.rotation.y = Math.PI / 2; planL.position.set(0, 1.4, 0.9); g.add(planL);
    var trait = boite(0.07, 0.04, 5.0, new THREE.MeshBasicMaterial({ color: col(CYAN) }), 0, 0.08, 0.9, g, false);

    // badge « validé »
    var badge = new THREE.Group();
    var disque = lum(new THREE.CylinderGeometry(0.6, 0.6, 0.1, 32), CYAN);
    disque.rotation.x = Math.PI / 2;
    badge.add(disque);
    var c1 = lum(new THREE.BoxGeometry(0.1, 0.34, 0.06), 0xFFFFFF); c1.position.set(-0.14, -0.06, 0.07); c1.rotation.z = Math.PI / 4;
    var c2 = lum(new THREE.BoxGeometry(0.1, 0.62, 0.06), 0xFFFFFF); c2.position.set(0.1, 0.02, 0.07); c2.rotation.z = -Math.PI / 4;
    badge.add(c1, c2);
    badge.position.set(0.3, 3.8, -1.6);
    badge.rotation.y = 0.62;
    badge.scale.setScalar(0.0001);
    g.add(badge);

    var etoiles = [];
    [[-3.0, 1.0, 0.8], [-0.5, 1.2, 1.0], [2.0, 0.9, 1.4], [3.4, 1.4, 0.6], [0.3, 2.4, -0.6]].forEach(function (p) {
      var e = etoile(1.1);
      e.position.set(p[0], p[1], p[2]);
      e.scale.setScalar(0.0001);
      g.add(e);
      etoiles.push({ o: e, x: p[0], p: Math.random() * 6 });
    });

    // l'agent, balai en avant
    var a = humain({ veste: 0x1F8FBF, pantalon: 0x2A3445, cravate: 0xFFFFFF, casquette: false, chaussure: 0x1A2230 });
    a.g.scale.setScalar(0.5);
    a.g.rotation.y = Math.PI / 2;
    g.add(a.g);
    var balai = outil(a, 0.8, 0x4B5B70);

    var RUN = 9, TENUE = 3.2, PERIODE = RUN + TENUE + 1.2;
    return {
      o: o, cam: { t: new THREE.Vector3(0, 0.9, 0.3), d: 17.5 },
      anim: function (t) {
        var u = t % PERIODE;
        var p = u < RUN ? u / RUN : u < RUN + TENUE ? 1 : 1 - (u - RUN - TENUE) / 1.2;
        var sx = -5.2 + p * 10.4;
        var passe = u < RUN;
        planL.position.x = sx; trait.position.x = sx;
        planL.visible = trait.visible = u < RUN + 0.4;

        a.g.visible = u < RUN + 0.6;
        a.g.position.set(Math.max(-4.6, Math.min(4.6, sx + 0.7)), 0, 1.6);
        tournerVers(a.g, Math.PI / 2, 0.2);
        var pas = Math.sin(t * 6.5) * (passe ? 1 : 0);
        a.jambeG.rotation.x = pas * 0.5;
        a.jambeD.rotation.x = -pas * 0.5;
        a.g.position.y = Math.abs(pas) * 0.03;
        balai.tete.position.x = 0.2 + Math.sin(t * 6.5) * 0.12 * (passe ? 1 : 0);

        function propre(x) { return lisser((sx - x) / 0.8); }
        bandes.forEach(function (b) { b.m.opacity = 1 - propre(b.x); });
        gravats.forEach(function (gr) { gr.o.scale.setScalar(Math.max(0.0001, 1 - propre(gr.x))); });
        echaf.forEach(function (e) { e.visible = propre(e.userData.x) < 0.5; });
        vitres.forEach(function (v) {
          var k = propre(v.x);
          v.film.material.opacity = 0.62 * (1 - k);
          v.v.verre.emissiveIntensity = k * (0.25 + Math.sin(t * 3 + v.x) * 0.08);
          v.v.verre.opacity = 0.5 + 0.15 * k;
        });
        badge.scale.setScalar(0.0001 + (p >= 1 ? Math.min(1, (u - RUN) * 2.5) : 0));
        badge.position.y = 3.8 + Math.sin(t * 2) * 0.05;
        etoiles.forEach(function (e) {
          var on = propre(e.x) > 0.95;
          e.o.scale.setScalar(0.0001 + (on ? Math.max(0, Math.sin(t * 2.4 + e.p)) * 0.9 : 0));
          e.o.rotation.y = t * 0.8;
        });
      }
    };
  }

  /* ═════════ Pilotage : une scène à la fois, fondu entre les deux ═════════ */
  var fabriques = [sceneSurveillance, sceneGardiennage, sceneNettoyage, sceneChantier];
  var scenes = [];
  function scene(i) { return scenes[i] || (scenes[i] = fabriques[i]()); }

  var courant = window.__metier || 0;
  var souris = { x: 0, y: 0 }, cible = { x: 0, y: 0 };
  var timer = null;
  window.addEventListener('metier', function (e) {
    var i = e.detail;
    if (i === courant) return;
    canvas.classList.add('fondu');
    clearTimeout(timer);
    timer = setTimeout(function () { courant = i; canvas.classList.remove('fondu'); }, 260);
  });

  var ECHELLE = 1.28;       // la scène occupe la moitié droite de l'accueil
  function placer(cfg) {
    var etroit = vue.clientWidth < 921;
    var k = etroit
      ? Math.max(1.2, 1.95 / camera.aspect)                               // téléphone : la scène occupe toute la largeur du bloc
      : Math.max(1.1, Math.min(2.4, ECHELLE * 2 / camera.aspect));         // ordinateur : la scène reste dans la moitié droite
    var az = 0.62 + souris.x * 0.12, el = 0.55 - souris.y * 0.05, d = cfg.d * k;
    camera.position.set(
      cfg.t.x + d * Math.sin(az) * Math.cos(el),
      cfg.t.y + d * Math.sin(el),
      cfg.t.z + d * Math.cos(az) * Math.cos(el)
    );
    camera.lookAt(cfg.t);
  }
  function ajuster() {
    var w = vue.clientWidth, h = vue.clientHeight;
    if (!w || !h) return;
    rendu.setSize(w, h, false);
    camera.aspect = w / h;
    if (w < 921) camera.clearViewOffset();
    else camera.setViewOffset(w, h, -w * 0.2, h * 0.17, w, h);   // ordinateur : décalée à droite, au-dessus du panneau
    camera.updateProjectionMatrix();
  }
  ajuster();
  window.addEventListener('resize', ajuster);
  window.addEventListener('pointermove', function (e) {
    if (e.pointerType && e.pointerType !== 'mouse') return;      // pas de parallaxe au doigt
    var r = vue.getBoundingClientRect();
    if (e.clientY < r.top || e.clientY > r.bottom) { cible.x = 0; cible.y = 0; return; }
    cible.x = ((e.clientX - r.left) / r.width - 0.5) * 2;
    cible.y = ((e.clientY - r.top) / r.height - 0.5) * 2;
  }, { passive: true });

  var visible = true;
  F.visibilite(vue, function (v) { visible = v; });

  var horloge = new THREE.Clock();
  var dernier = 0;
  function boucle(now) {
    requestAnimationFrame(boucle);
    if (!visible || document.hidden) return;
    if (PETIT && now - dernier < 30) return;
    dernier = now;
    var dt = Math.min(horloge.getDelta(), 0.1);
    var t = horloge.elapsedTime;
    var sc = scene(courant);
    souris.x += (cible.x - souris.x) * 0.05;
    souris.y += (cible.y - souris.y) * 0.05;
    placer(sc.cam);
    sc.anim(t, dt);
    rendu.render(sc.o.scene, camera);
  }
  boucle();
  canvas.classList.add('pret');
  cadre.classList.add('scene-ok');
})();
