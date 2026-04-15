const nav = document.getElementById('nav');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y > 20) {
        nav.classList.add('is-scrolled');
    } else {
        nav.classList.remove('is-scrolled');
    }
    lastScroll = y;
}, { passive: true });

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
        const id = link.getAttribute('href').slice(1);
        const target = document.getElementById(id);
        if (!target) return;
        e.preventDefault();
        const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h'), 10) || 64;
        const top = target.getBoundingClientRect().top + window.scrollY - navH - 16;
        window.scrollTo({ top, behavior: 'smooth' });
    });
});

const phoneImgs = [
    '/assets/IMG_3304.PNG',
    '/assets/IMG_3306.PNG',
    '/assets/IMG_3307.PNG',
    '/assets/IMG_3308.PNG',
];
const heroImg = document.getElementById('heroPhoneImg');
if (heroImg) {
    let idx = 0;
    setInterval(() => {
        idx = (idx + 1) % phoneImgs.length;
        heroImg.style.opacity = '0';
        heroImg.style.transform = 'scale(1.04)';
        setTimeout(() => {
            heroImg.src = phoneImgs[idx];
            heroImg.style.opacity = '1';
            heroImg.style.transform = 'scale(1)';
        }, 350);
    }, 3200);
    heroImg.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
}
