const body = document.body;
const page = body.dataset.page;

const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('[data-nav]');

if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    navMenu.classList.toggle('open');
  });

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      navToggle.setAttribute('aria-expanded', 'false');
      navMenu.classList.remove('open');
    });
  });
}

navLinks.forEach((link) => {
  if (link.dataset.nav === page) link.classList.add('active');
});

const revealItems = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.18 }
);

revealItems.forEach((item) => observer.observe(item));

const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

const canvas = document.getElementById('particle-field');
if (canvas) {
  const ctx = canvas.getContext('2d');
  const particles = [];
  const count = window.innerWidth < 768 ? 34 : 70;

  const setCanvas = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };

  const createParticle = () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    radius: Math.random() * 1.7 + 0.4,
    speedX: (Math.random() - 0.5) * 0.24,
    speedY: (Math.random() - 0.5) * 0.24,
  });

  const init = () => {
    particles.length = 0;
    for (let i = 0; i < count; i += 1) {
      particles.push(createParticle());
    }
  };

  const draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((p, i) => {
      p.x += p.speedX;
      p.y += p.speedY;

      if (p.x < 0 || p.x > canvas.width) p.speedX *= -1;
      if (p.y < 0 || p.y > canvas.height) p.speedY *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(214, 224, 240, 0.58)';
      ctx.fill();

      for (let j = i + 1; j < particles.length; j += 1) {
        const q = particles[j];
        const dx = p.x - q.x;
        const dy = p.y - q.y;
        const distance = Math.hypot(dx, dy);
        if (distance < 115) {
          const alpha = 1 - distance / 115;
          ctx.strokeStyle = `rgba(176, 26, 46, ${alpha * 0.2})`;
          ctx.shadowBlur = 12;
          ctx.shadowColor = 'rgba(176, 26, 46, 0.45)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.stroke();
        }
      }
    });

    requestAnimationFrame(draw);
  };

  setCanvas();
  init();
  draw();

  window.addEventListener('resize', () => {
    setCanvas();
    init();
  });
}
