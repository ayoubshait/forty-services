// Carte interactive : se retourne au clic, au toucher ou avec le bouton ; légère inclinaison au survol (souris uniquement).
(function () {
  var carte = document.querySelector('[data-carte3d]');
  if (!carte) return;
  var corps = carte.querySelector('.carte3d-corps');
  var bouton = carte.querySelector('.carte3d-bouton');
  var reduit = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var souris = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  carte.classList.add('carte3d-actif');
  bouton.hidden = false;

  function retourner(forcer) {
    var etat = typeof forcer === 'boolean' ? forcer : !carte.classList.contains('est-retournee');
    carte.classList.toggle('est-retournee', etat);
    bouton.setAttribute('aria-pressed', String(etat));
    bouton.textContent = etat ? 'Revenir au recto' : 'Retourner la carte';
  }

  // Lien direct vers le verso : /carte#verso
  if (location.hash === '#verso') retourner(true);

  bouton.addEventListener('click', function () { retourner(); });
  // Clic ou toucher sur la carte (sauf sur un lien du verso)
  corps.addEventListener('click', function (e) {
    if (e.target.closest('a')) return;
    retourner();
  });

  // Inclinaison au survol : ordinateur seulement, et pas si l'utilisateur réduit les animations
  if (souris && !reduit) {
    carte.addEventListener('pointermove', function (e) {
      var r = corps.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width - 0.5;
      var y = (e.clientY - r.top) / r.height - 0.5;
      carte.style.setProperty('--ry', (x * 12).toFixed(2) + 'deg');
      carte.style.setProperty('--rx', (-y * 9).toFixed(2) + 'deg');
      carte.classList.add('survol');
    });
    carte.addEventListener('pointerleave', function () {
      carte.style.setProperty('--ry', '0deg');
      carte.style.setProperty('--rx', '0deg');
      carte.classList.remove('survol');
    });
  }
})();
