// Forty Services — objets 3D des quatre métiers (Three.js)
// 0 Surveillance : agent en ronde · 1 Gardiennage : agent au poste · 2 Nettoyage : spray · 3 Fin de chantier : casque
// Un objet dans l'accueil (piloté par le panneau des prestations) + une vignette vivante par carte service.
(function () {
  if (typeof THREE === 'undefined') return;

  var CYAN = 0x29A8DF, MARINE = 0x1B3A6B, MARINE_CLAIR = 0x2A528F, BLANC = 0xEAF3FA;

  /* ───────────── Briques ───────────── */
  function solide(geo, couleur, lisse, opaciteArete) {
    var mat = new THREE.MeshPhongMaterial({ color: couleur, emissive: 0x0A1F40, flatShading: !lisse, shininess: 70 });
    var m = new THREE.Mesh(geo, mat);
    m.add(new THREE.LineSegments(
      new THREE.EdgesGeometry(geo, 35),
      new THREE.LineBasicMaterial({ color: CYAN, transparent: true, opacity: opaciteArete == null ? 0.75 : opaciteArete })
    ));
    return m;
  }
  function lumineux(geo, couleur, opacite) {
    return new THREE.Mesh(geo, new THREE.MeshBasicMaterial({
      color: couleur, transparent: opacite != null, opacity: opacite == null ? 1 : opacite
    }));
  }
  function etoile(taille) {
    var g = new THREE.Group();
    g.add(lumineux(new THREE.OctahedronGeometry(1), 0xFFFFFF));
    g.children[0].scale.set(0.09 * taille, 0.34 * taille, 0.09 * taille);
    var b = lumineux(new THREE.OctahedronGeometry(1), CYAN);
    b.scale.set(0.34 * taille, 0.09 * taille, 0.09 * taille);
    g.add(b);
    return g;
  }

  /* ───────────── Agent (personnage stylisé) ───────────── */
  function agent(o) {
    o = o || {};
    var COSTUME = o.costume || MARINE;
    var g = new THREE.Group();
    var PEAU = 0xE2BE9B, NOIR = 0x14243D;

    var torse = solide(new THREE.BoxGeometry(0.72, 0.96, 0.42), COSTUME);
    torse.position.y = 1.35;
    g.add(torse);
    var cravate = lumineux(new THREE.BoxGeometry(0.09, 0.55, 0.02), CYAN);
    cravate.position.set(0, 1.4, 0.22);
    g.add(cravate);
    var badge = lumineux(new THREE.BoxGeometry(0.14, 0.14, 0.02), 0xFFFFFF);
    badge.position.set(0.2, 1.62, 0.22);
    g.add(badge);

    var tete = new THREE.Group();
    tete.position.y = 2.1;
    g.add(tete);
    tete.add(solide(new THREE.SphereGeometry(0.27, 20, 14), PEAU, true, 0.12));
    var calotte = solide(new THREE.CylinderGeometry(0.29, 0.3, 0.16, 20), NOIR, true, 0.5);
    calotte.position.y = 0.2;
    tete.add(calotte);
    var visiere = solide(new THREE.BoxGeometry(0.5, 0.04, 0.26), NOIR, false, 0.5);
    visiere.position.set(0, 0.14, 0.26);
    tete.add(visiere);
    var bande = lumineux(new THREE.CylinderGeometry(0.305, 0.305, 0.04, 20), CYAN);
    bande.position.y = 0.14;
    tete.add(bande);

    function membre(x, y, larg, haut, prof, couleur) {
      var pivot = new THREE.Group();
      pivot.position.set(x, y, 0);
      var m = solide(new THREE.BoxGeometry(larg, haut, prof), couleur);
      m.position.y = -haut / 2;
      pivot.add(m);
      g.add(pivot);
      return pivot;
    }
    var jambeG = membre(-0.19, 0.95, 0.3, 0.95, 0.32, NOIR);
    var jambeD = membre(0.19, 0.95, 0.3, 0.95, 0.32, NOIR);
    var brasG = membre(-0.47, 1.76, 0.2, 0.85, 0.22, COSTUME);
    var brasD = membre(0.47, 1.76, 0.2, 0.85, 0.22, COSTUME);
    [jambeG, jambeD].forEach(function (j) {
      var s = solide(new THREE.BoxGeometry(0.32, 0.12, 0.44), 0x0B1424, false, 0.4);
      s.position.set(0, -0.99, 0.06);
      j.add(s);
    });

    return { g: g, tete: tete, jambeG: jambeG, jambeD: jambeD, brasG: brasG, brasD: brasD };
  }

  /* ───────────── 0 · Surveillance : agent en ronde, contrôle d'accès ───────────── */
  function modeleSurveillance() {
    var g = new THREE.Group();
    var R = 1.35;

    // Point de contrôle au centre
    var socle = solide(new THREE.CylinderGeometry(0.4, 0.45, 0.12, 24), MARINE_CLAIR);
    g.add(socle);
    var poteau = solide(new THREE.CylinderGeometry(0.1, 0.12, 1.0, 16), MARINE_CLAIR);
    poteau.position.y = 0.55;
    g.add(poteau);
    var balise = lumineux(new THREE.SphereGeometry(0.17, 20, 14), CYAN);
    balise.position.y = 1.2;
    g.add(balise);

    // Parcours de la ronde au sol
    var parcours = lumineux(new THREE.TorusGeometry(R, 0.022, 8, 120), CYAN, 0.55);
    parcours.rotation.x = Math.PI / 2;
    parcours.position.y = 0.02;
    g.add(parcours);

    // L'agent tourne autour du point de contrôle
    var ronde = new THREE.Group();
    g.add(ronde);
    var a = agent();
    a.g.position.x = R;
    a.g.rotation.y = Math.PI;
    a.g.scale.setScalar(0.72);
    ronde.add(a.g);

    // Lampe torche
    var faisceau = new THREE.Mesh(
      new THREE.ConeGeometry(0.62, 1.9, 24, 1, true),
      new THREE.MeshBasicMaterial({
        color: CYAN, transparent: true, opacity: 0.16, side: THREE.DoubleSide,
        depthWrite: false, blending: THREE.AdditiveBlending
      })
    );
    faisceau.rotation.x = -Math.PI / 2;
    faisceau.position.set(0, 1.0, 0.45 + 0.95);
    a.g.add(faisceau);

    g.position.y = -0.95;
    g.rotation.x = 0.22;
    g.scale.setScalar(1.0);
    return {
      g: g,
      anim: function (t) {
        ronde.rotation.y = t * 0.55;
        a.jambeG.rotation.x = Math.sin(t * 4) * 0.55;
        a.jambeD.rotation.x = -Math.sin(t * 4) * 0.55;
        a.brasG.rotation.x = -Math.sin(t * 4) * 0.45;
        a.brasD.rotation.x = Math.sin(t * 4) * 0.2 - 0.9;
        a.tete.rotation.y = Math.sin(t * 1.2) * 0.35;
        a.g.position.y = Math.abs(Math.sin(t * 4)) * 0.04;
        balise.scale.setScalar(1 + Math.sin(t * 3) * 0.15);
      }
    };
  }

  /* ───────────── 1 · Gardiennage : agent au poste, jour et nuit ───────────── */
  function modeleGardiennage() {
    var g = new THREE.Group();

    // Poste de garde
    var murs = solide(new THREE.BoxGeometry(1.5, 1.5, 1.3), MARINE_CLAIR);
    murs.position.set(-0.55, 0.75, 0);
    g.add(murs);
    var toit = solide(new THREE.ConeGeometry(1.4, 0.6, 4), MARINE);
    toit.rotation.y = Math.PI / 4;
    toit.position.set(-0.55, 1.8, 0);
    g.add(toit);
    var fenetre = lumineux(new THREE.BoxGeometry(0.75, 0.5, 0.03), CYAN);
    fenetre.position.set(-0.55, 0.95, 0.66);
    g.add(fenetre);
    var sol = solide(new THREE.CylinderGeometry(2.0, 2.0, 0.08, 40), MARINE, true, 0.4);
    sol.position.set(0.1, -0.04, 0.2);
    g.add(sol);

    // Agent à côté du poste, comptes rendus en main
    var a = agent();
    a.g.position.set(0.95, 0, 0.35);
    a.g.rotation.y = -0.5;
    a.g.scale.setScalar(0.72);
    g.add(a.g);
    var carnet = new THREE.Group();
    var planche = lumineux(new THREE.BoxGeometry(0.36, 0.48, 0.04), 0xFFFFFF);
    carnet.add(planche);
    for (var i = 0; i < 3; i++) {
      var ligne = lumineux(new THREE.BoxGeometry(0.24, 0.025, 0.045), CYAN);
      ligne.position.set(0, 0.12 - i * 0.1, 0);
      carnet.add(ligne);
    }
    carnet.position.set(0, -0.85, 0.2);
    carnet.rotation.x = 1.15;
    a.brasD.add(carnet);

    // Jour et nuit : soleil et lune en orbite
    var soleil = lumineux(new THREE.SphereGeometry(0.2, 18, 14), 0xFFD36B);
    var lune = lumineux(new THREE.SphereGeometry(0.17, 18, 14), 0xDDE8F5);
    g.add(soleil, lune);

    g.position.set(0, -0.9, 0);
    g.rotation.x = 0.2;
    g.scale.setScalar(0.9);
    return {
      g: g,
      anim: function (t) {
        a.brasD.rotation.x = -1.15 + Math.sin(t * 3) * 0.04;
        a.brasG.rotation.x = Math.sin(t * 1.5) * 0.05;
        a.tete.rotation.y = Math.sin(t * 0.9) * 0.55;
        a.g.position.y = Math.sin(t * 1.6) * 0.015;
        var ang = t * 0.5;
        soleil.position.set(Math.cos(ang) * 2.3, 1.2 + Math.sin(ang) * 1.5, -0.6);
        lune.position.set(Math.cos(ang + Math.PI) * 2.3, 1.2 + Math.sin(ang + Math.PI) * 1.5, -0.6);
        fenetre.material.opacity = 1;
      }
    };
  }

  /* ───────────── 2 · Nettoyage de locaux : spray ───────────── */
  function modeleNettoyage() {
    var g = new THREE.Group();

    var verre = solide(new THREE.CylinderGeometry(0.6, 0.6, 1.7, 32), MARINE_CLAIR, true, 0.5);
    verre.material.transparent = true;
    verre.material.opacity = 0.55;
    verre.position.y = -0.5;
    g.add(verre);

    var liquide = lumineux(new THREE.CylinderGeometry(0.5, 0.5, 1.2, 28), CYAN, 0.5);
    liquide.position.y = -0.72;
    g.add(liquide);

    var epaule = solide(new THREE.CylinderGeometry(0.26, 0.6, 0.5, 32), MARINE);
    epaule.position.y = 0.6;
    g.add(epaule);
    var col = solide(new THREE.CylinderGeometry(0.26, 0.26, 0.3, 20), MARINE);
    col.position.y = 1.0;
    g.add(col);
    var tete = solide(new THREE.BoxGeometry(0.9, 0.38, 0.44), MARINE);
    tete.position.set(0.18, 1.33, 0);
    g.add(tete);
    var buse = solide(new THREE.CylinderGeometry(0.12, 0.12, 0.45, 16), CYAN);
    buse.rotation.z = Math.PI / 2;
    buse.position.set(0.85, 1.33, 0);
    g.add(buse);
    var gachette = solide(new THREE.BoxGeometry(0.14, 0.55, 0.22), MARINE_CLAIR);
    gachette.position.set(0.5, 0.92, 0);
    gachette.rotation.z = 0.3;
    g.add(gachette);

    // Jet : particules qui partent de la buse
    var NB = 70, ph = [], dy = [], dz = [];
    var pos = new Float32Array(NB * 3);
    for (var i = 0; i < NB; i++) {
      ph.push(Math.random());
      dy.push((Math.random() - 0.5) * 0.9);
      dz.push((Math.random() - 0.5) * 0.9);
    }
    var geoJet = new THREE.BufferGeometry();
    geoJet.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    g.add(new THREE.Points(geoJet, new THREE.PointsMaterial({ color: 0xBFE6F7, size: 0.07, transparent: true, opacity: 0.85 })));

    // Bulles qui montent
    var bulles = [];
    for (var b = 0; b < 7; b++) {
      var bu = new THREE.Mesh(
        new THREE.SphereGeometry(0.09 + Math.random() * 0.09, 12, 10),
        new THREE.MeshBasicMaterial({ color: 0xFFFFFF, transparent: true, opacity: 0.4 })
      );
      bu.userData = { ph: Math.random(), x: -1.5 + Math.random() * 0.9, z: (Math.random() - 0.5) * 1.2 };
      g.add(bu);
      bulles.push(bu);
    }

    // Étincelles « propre »
    var etincelles = [
      { o: etoile(1.1), x: 1.5, y: 0.35, z: 0.3, p: 0 },
      { o: etoile(0.8), x: 1.9, y: 1.1, z: -0.2, p: 1.7 },
      { o: etoile(0.9), x: -1.25, y: 1.0, z: 0.3, p: 3.1 }
    ];
    etincelles.forEach(function (e) { e.o.position.set(e.x, e.y, e.z); g.add(e.o); });

    g.position.y = -0.1;
    g.rotation.y = -0.45;
    g.scale.setScalar(0.92);
    return {
      g: g,
      anim: function (t) {
        g.rotation.y = -0.45 + Math.sin(t * 0.6) * 0.35;
        var p = geoJet.attributes.position.array;
        for (var i = 0; i < NB; i++) {
          var f = (t * 0.8 + ph[i]) % 1;
          p[i * 3] = 1.1 + f * 1.5;
          p[i * 3 + 1] = 1.33 + dy[i] * f * 0.6 - f * f * 0.5;
          p[i * 3 + 2] = dz[i] * f * 0.6;
        }
        geoJet.attributes.position.needsUpdate = true;
        bulles.forEach(function (bu) {
          var f = (t * 0.18 + bu.userData.ph) % 1;
          bu.position.set(bu.userData.x + Math.sin(t + bu.userData.ph * 6) * 0.1, -1.4 + f * 3.2, bu.userData.z);
          bu.material.opacity = 0.45 * Math.sin(f * Math.PI);
        });
        etincelles.forEach(function (e) {
          var k = Math.max(0, Math.sin(t * 2.2 + e.p));
          e.o.scale.setScalar(0.2 + k * 0.9);
          e.o.rotation.z = t * 0.6;
        });
      }
    };
  }

  /* ───────────── 3 · Fin de chantier : casque ───────────── */
  function modeleChantier() {
    var g = new THREE.Group();
    var casque = new THREE.Group();
    g.add(casque);

    var dome = solide(new THREE.SphereGeometry(1.15, 36, 18, 0, Math.PI * 2, 0, Math.PI / 2), 0x3BB6EA, true, 0.3);
    dome.material.side = THREE.DoubleSide;
    dome.scale.set(1, 0.9, 1.1);
    casque.add(dome);

    var bord = solide(new THREE.CylinderGeometry(1.42, 1.42, 0.1, 48), MARINE_CLAIR, true, 0.5);
    bord.scale.z = 1.12;
    bord.position.y = -0.03;
    casque.add(bord);

    var arete = lumineux(new THREE.TorusGeometry(1.24, 0.1, 10, 48, Math.PI), MARINE);
    arete.rotation.y = Math.PI / 2;
    arete.scale.y = 0.91;
    casque.add(arete);

    var lampe = lumineux(new THREE.BoxGeometry(0.42, 0.22, 0.12), 0xFFFFFF);
    lampe.position.set(0, 0.55, 1.1);
    lampe.rotation.x = -0.4;
    casque.add(lampe);

    // Débris qui tournent autour
    var debris = [];
    for (var i = 0; i < 8; i++) {
      var d = solide(new THREE.BoxGeometry(0.17, 0.17, 0.17), MARINE_CLAIR, false, 0.8);
      d.userData = { a: (i / 8) * Math.PI * 2, r: 1.9 + (i % 3) * 0.2, y: -0.2 + (i % 4) * 0.35 };
      g.add(d);
      debris.push(d);
    }

    g.position.y = -0.35;
    g.rotation.x = 0.28;
    g.scale.setScalar(0.92);
    return {
      g: g,
      anim: function (t) {
        casque.rotation.y = t * 0.55;
        casque.position.y = Math.sin(t * 1.1) * 0.06;
        debris.forEach(function (d) {
          var u = d.userData, a = u.a + t * 0.6;
          d.position.set(Math.cos(a) * u.r, u.y + Math.sin(t + u.a) * 0.12, Math.sin(a) * u.r);
          d.rotation.x = t * 1.2 + u.a;
          d.rotation.y = t * 0.9;
        });
      }
    };
  }

  function construire() {
    return [modeleSurveillance(), modeleGardiennage(), modeleNettoyage(), modeleChantier()];
  }
  function eclairer(scene) {
    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    var l1 = new THREE.PointLight(CYAN, 1.5, 24);
    l1.position.set(3, 3, 5);
    scene.add(l1);
    var l2 = new THREE.DirectionalLight(0xffffff, 0.55);
    l2.position.set(-3, 4, 4);
    scene.add(l2);
  }

  var visibilite = function (el, cb) {
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) { cb(es[0].isIntersecting); }).observe(el);
    }
  };

  var horloge = new THREE.Clock();

  // Briques partagées avec la scène du bâtiment (batiment3d.js)
  window.F3D = { agent: agent, solide: solide, lumineux: lumineux, etoile: etoile, CYAN: CYAN, MARINE: MARINE, MARINE_CLAIR: MARINE_CLAIR, visibilite: visibilite };

  /* ═══════════════ Vignettes des cartes ═══════════════ */
  // Elles démarrent APRÈS la scène d'accueil (au repos), ou dès que les cartes approchent de l'écran :
  // la scène d'accueil n'est ainsi plus retardée par ce travail, qui est de plus découpé en petites tâches.
  var cartes = Array.prototype.slice.call(document.querySelectorAll('.carte'));
  var PETIT = window.matchMedia('(max-width: 920px)').matches;     // téléphone / tablette : rendu allégé
  var rendu2, scene2, camera2, modeles2, vignettes = [], T = PETIT ? 224 : 200, pret2 = false, lancee = false;

  function initVignettes() {
    if (cartes.length !== 4) return;
    try {
      rendu2 = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    } catch (e) { rendu2 = null; return; }
    rendu2.setPixelRatio(1);
    rendu2.setSize(T, T, false);
    scene2 = new THREE.Scene();
    camera2 = new THREE.PerspectiveCamera(40, 1, 0.1, 50);
    camera2.position.set(0, 0.15, PETIT ? 4.9 : 5.7);
    eclairer(scene2);
    // Normalisation : chaque modèle est rendu, sa silhouette réelle est mesurée en pixels (sur plusieurs instants de l'animation),
    // puis il est mis à la même taille apparente et centré. Les quatre icônes ont ainsi le même poids visuel dans leur cadre.
    var tanMoitie = Math.tan(THREE.MathUtils.degToRad(camera2.fov / 2));
    var zProche = camera2.position.z, zLoin = zProche * 1.8;                 // mesure à distance : aucun modèle n'est rogné
    var CIBLE = 2 * zProche * tanMoitie * 0.7;                               // taille moyenne visée, en unités du monde
    var tmp = document.createElement('canvas'); tmp.width = tmp.height = T;
    var ctxTmp = tmp.getContext('2d');
    modeles2 = construire();
    modeles2.forEach(function (m) {
      m.pivot = new THREE.Group();
      m.pivot.add(m.g);
      m.pivot.visible = false;
      m.cadre = new THREE.Group();
      m.cadre.add(m.pivot);
      scene2.add(m.cadre);
    });
    camera2.position.z = zLoin;
    var unite = 2 * zLoin * tanMoitie / T;                                   // unités du monde par pixel, à distance

    function mesurer(m) {
      m.pivot.visible = true;
      var x0 = 1e9, y0 = 1e9, x1 = -1, y1 = -1, sommeMax = 0, nb = 0;
      [0, 1.5, 3, 4.5, 6, 7.5].forEach(function (t) {
        m.anim(t);
        rendu2.render(scene2, camera2);
        ctxTmp.clearRect(0, 0, T, T);
        ctxTmp.drawImage(rendu2.domElement, 0, 0, T, T);
        var px = ctxTmp.getImageData(0, 0, T, T).data;
        var a0 = 1e9, b0 = 1e9, a1 = -1, b1 = -1;
        for (var y = 0; y < T; y++) {
          for (var x = 0; x < T; x++) {
            if (px[(y * T + x) * 4 + 3] > 40) {
              if (x < a0) a0 = x; if (x > a1) a1 = x; if (y < b0) b0 = y; if (y > b1) b1 = y;
            }
          }
        }
        if (a1 < 0) return;
        sommeMax += Math.max(a1 - a0 + 1, b1 - b0 + 1); nb++;                 // taille à cet instant
        if (a0 < x0) x0 = a0; if (a1 > x1) x1 = a1; if (b0 < y0) y0 = b0; if (b1 > y1) y1 = b1;   // enveloppe de tout le mouvement
      });
      m.pivot.visible = false;
      if (x1 < 0) return;
      var maxi = (sommeMax / nb) * unite;                                      // taille moyenne (et non maximale)
      var k = CIBLE / maxi;
      var dx = ((x0 + x1) / 2 - T / 2) * unite, dy = -((y0 + y1) / 2 - T / 2) * unite;
      m.cadre.scale.setScalar(k);
      m.cadre.position.set(-dx * k, -dy * k, 0);
    }

    function terminer() {
      camera2.position.z = zProche;
      cartes.forEach(function (carte, i) {
        var tete = carte.querySelector('.carte-tete');
        if (!tete) return;
        var c = document.createElement('canvas');
        c.className = 'carte-3d';
        c.width = T; c.height = T;
        c.setAttribute('aria-hidden', 'true');
        tete.insertBefore(c, tete.firstChild);
        var v = { i: i, c: c, ctx: c.getContext('2d'), visible: false, survol: 0, cible: 0, x: 0 };
        vignettes.push(v);
        visibilite(carte, function (vis) { v.visible = vis; });
        carte.addEventListener('pointerenter', function () { v.cible = 1; });
        carte.addEventListener('pointerleave', function () { v.cible = 0; });
        carte.addEventListener('pointermove', function (e) {
          var r = carte.getBoundingClientRect();
          v.x = (e.clientX - r.left) / r.width - 0.5;
        });
      });
      var grille = document.querySelector('.grille-services');
      if (grille) grille.classList.add('avec-3d');
      pret2 = true;
    }

    // une mesure par tâche : la page reste fluide pendant ce travail
    var suite = 0;
    (function etape() {
      if (suite >= modeles2.length) { terminer(); return; }
      mesurer(modeles2[suite++]);
      setTimeout(etape, 0);
    })();
  }

  function lancer() { if (lancee) return; lancee = true; initVignettes(); }
  // 1) dès que la scène d'accueil est dessinée, au repos
  window.addEventListener('accueil3d-pret', function () {
    if (window.requestIdleCallback) window.requestIdleCallback(lancer, { timeout: 2500 });
    else setTimeout(lancer, 300);
  }, { once: true });
  // 2) ou dès que les cartes approchent de l'écran
  var grilleServices = document.querySelector('.grille-services');
  if (grilleServices && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (es) { if (es[0].isIntersecting) lancer(); }, { rootMargin: '700px' }).observe(grilleServices);
  }
  // 3) sécurité (scène d'accueil absente ou en échec)
  setTimeout(lancer, 6000);

  /* ═══════════════ Boucle unique ═══════════════ */
  var dernier = 0;
  function boucle(now) {
    requestAnimationFrame(boucle);
    if (document.hidden) return;
    if (PETIT && now - dernier < 30) return;               // ≈ 30 images/s sur téléphone
    dernier = now;
    var t = horloge.getElapsedTime();

    if (rendu2 && pret2) {
      vignettes.forEach(function (v) {
        if (!v.visible) return;
        v.survol += (v.cible - v.survol) * 0.12;
        modeles2.forEach(function (m, k) { m.pivot.visible = k === v.i; });
        var m = modeles2[v.i];
        m.anim(t * (1 + v.survol * 1.2));
        m.pivot.rotation.y = v.survol * v.x * 1.6;
        m.pivot.scale.setScalar(1 + v.survol * 0.12);
        rendu2.render(scene2, camera2);
        v.ctx.clearRect(0, 0, T, T);
        v.ctx.drawImage(rendu2.domElement, 0, 0, T, T);
      });
    }
  }
  boucle();
})();
