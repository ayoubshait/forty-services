// Forty Services — interactions minimales

// Menu mobile
const boutonMenu = document.querySelector('.bouton-menu');
const menu = document.getElementById('menu');
if (boutonMenu && menu) {
  boutonMenu.addEventListener('click', () => {
    const ouvert = menu.classList.toggle('ouvert');
    boutonMenu.setAttribute('aria-expanded', ouvert);
  });
  menu.querySelectorAll('a').forEach((lien) => {
    lien.addEventListener('click', () => {
      menu.classList.remove('ouvert');
      boutonMenu.setAttribute('aria-expanded', 'false');
    });
  });
}

// Apparition douce au défilement — seule animation du site
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
