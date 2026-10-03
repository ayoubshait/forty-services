// Forty Services — interactions minimales

// Menu mobile
const boutonMenu = document.querySelector('.bouton-menu');
const menu = document.getElementById('menu');
if (boutonMenu && menu) {
  boutonMenu.addEventListener('click', () => {
    const ouvert = menu.classList.toggle('ouvert');
    boutonMenu.setAttribute('aria-expanded', ouvert);
    boutonMenu.setAttribute('aria-label', ouvert ? 'Fermer le menu' : 'Ouvrir le menu');
  });
  menu.querySelectorAll('a').forEach((lien) => {
    lien.addEventListener('click', () => {
      menu.classList.remove('ouvert');
      boutonMenu.setAttribute('aria-expanded', 'false');
      boutonMenu.setAttribute('aria-label', 'Ouvrir le menu');
    });
  });
}

// Sélecteur de prestations (accueil) : fiche courte + pilotage de la scène 3D
(function () {
  var cadre = document.querySelector('.scene-cadre');
  if (!cadre) return;
  var choix = Array.prototype.slice.call(cadre.querySelectorAll('.choix'));
  var fiche = cadre.querySelector('.scene-fiche');
  var titre = cadre.querySelector('.sf-titre');
  var desc = cadre.querySelector('.sf-desc');
  var cta = cadre.querySelector('.sf-cta');
  var actif = 0;
  window.__metier = 0;

  function choisir(i) {
    if (i === actif) return;
    actif = i;
    window.__metier = i;
    choix.forEach(function (b, k) {
      b.classList.toggle('actif', k === i);
      b.setAttribute('aria-pressed', k === i);
    });
    titre.textContent = choix[i].dataset.titre;
    desc.textContent = choix[i].dataset.desc;
    cta.href = choix[i].dataset.wa;
    fiche.classList.remove('maj');
    void fiche.offsetWidth;
    fiche.classList.add('maj');
    window.dispatchEvent(new CustomEvent('metier', { detail: i }));
    // sans 3D : l'image fixe de remplacement change avec le métier
    var accueil = document.getElementById('accueil');
    if (accueil.classList.contains('sans-3d')) accueil.style.setProperty('--poster', 'url(/images/scene-' + i + '.webp)');
  }
  choix.forEach(function (b, i) {
    b.addEventListener('click', function () { choisir(i); });
    b.addEventListener('mouseenter', function () { choisir(i); });
  });
  // Scène 3D : seulement si le visiteur l'accepte et que l'appareil s'y prête — sinon simple sélecteur
  var hero = document.getElementById('accueil');
  var reduit = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var test = document.createElement('canvas');
  var webgl = !!(test.getContext('webgl') || test.getContext('experimental-webgl'));
  var etroit = window.matchMedia('(max-width: 920px)').matches;
  var cnx = navigator.connection || {};
  // les protections « appareil faible » ne concernent que les téléphones : sur ordinateur, la 3D s'affiche toujours
  var faible = !!cnx.saveData
    || (etroit && navigator.deviceMemory && navigator.deviceMemory < 4)
    || (etroit && navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4)
    || (etroit && /^(slow-2g|2g|3g)$/.test(cnx.effectiveType || ''));
  if (reduit || !webgl || faible) { hero.classList.add('sans-3d'); return; }

  // Les scripts se téléchargent en parallèle et s'exécutent dans l'ordre (async = false) : bien plus rapide qu'une file d'attente
  function demarrer() {
    var scripts = ['https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js'];
    scripts.push('/js/scene3d.js');                              // icônes 3D des cartes (ordinateur et téléphone)
    scripts.push('/js/batiment3d.js');
    scripts.forEach(function (src) {
      var s = document.createElement('script');
      s.src = src;
      s.async = false;
      s.onerror = function () { hero.classList.add('sans-3d'); };
      document.body.appendChild(s);
    });
  }
  // ordinateur : on démarre tout de suite ; téléphone : après l'affichage de la page, pour ne jamais retarder le texte et les boutons
  function apres() {
    if (window.requestIdleCallback) window.requestIdleCallback(demarrer, { timeout: 2500 });
    else setTimeout(demarrer, 800);
  }
  if (!etroit) demarrer();
  else if (document.readyState === 'complete') apres();
  else window.addEventListener('load', apres);
})();

// Inclinaison 3D des cartes selon le curseur (souris uniquement)
if (window.matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)').matches) {
  document.querySelectorAll('.carte').forEach(function (carte) {
    carte.addEventListener('pointerenter', function () { carte.style.transitionDelay = '0s'; });
    carte.addEventListener('pointermove', function (e) {
      var r = carte.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width;
      var y = (e.clientY - r.top) / r.height;
      carte.style.setProperty('--rx', ((0.5 - y) * 12).toFixed(2) + 'deg');
      carte.style.setProperty('--ry', ((x - 0.5) * 12).toFixed(2) + 'deg');
      carte.style.setProperty('--gx', (x * 100).toFixed(1) + '%');
      carte.style.setProperty('--gy', (y * 100).toFixed(1) + '%');
    });
    carte.addEventListener('pointerleave', function () {
      carte.style.setProperty('--rx', '0deg');
      carte.style.setProperty('--ry', '0deg');
    });
  });
}

// Apparition douce au défilement
const revele = document.querySelectorAll('.revele');
if ('IntersectionObserver' in window) {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.15 });
  revele.forEach((el) => obs.observe(el));
} else {
  revele.forEach((el) => el.classList.add('visible'));
}

// Chiffres qui s'animent quand ils apparaissent à l'écran (année de création, années d'expérience)
(function () {
  var els = document.querySelectorAll('[data-compte]');
  if (!els.length || !('IntersectionObserver' in window)) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  function animer(el) {
    var cible = +el.dataset.compte, suffixe = el.dataset.suffixe || '';
    var depart = cible > 1000 ? cible - 40 : 0, duree = 1300, t0 = null;
    function pas(t) {
      if (t0 === null) t0 = t;
      var p = Math.min(1, (t - t0) / duree), e = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(depart + (cible - depart) * e) + suffixe;
      if (p < 1) requestAnimationFrame(pas);
    }
    requestAnimationFrame(pas);
  }
  var obs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { animer(e.target); obs.unobserve(e.target); }
    });
  }, { threshold: 0.6 });
  els.forEach(function (el) { obs.observe(el); });
})();

// Processus : la ligne de liaison se trace quand la section apparaît (le contenu reste lisible sans animation)
(function () {
  var grille = document.querySelector('.grille-etapes');
  if (!grille || !('IntersectionObserver' in window)) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  grille.classList.add('anime');
  var obs = new IntersectionObserver(function (entries) {
    if (entries[0].isIntersecting) { grille.classList.add('trace'); obs.disconnect(); }
  }, { threshold: 0.3 });
  obs.observe(grille);
})();
