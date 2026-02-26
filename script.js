/* ============================================
   CINEMATIC INTRO SEQUENCE (NS SIGNAL)
============================================ */
(function () {
  const introScreen = document.getElementById('introScreen');
  const introStatic = document.getElementById('introStatic');
  const introNameTyped = document.getElementById('introNameTyped');
  const introSub = document.getElementById('introSub');
  const nsPath = document.querySelector('.ns-path');

  if (!introScreen) return;

  // ── Skip intro after first visit (never replay on refresh or new tab) ──
  if (localStorage.getItem('introSeen')) {
    introScreen.classList.add('hidden');
    document.body.classList.remove('intro-active');
    document.body.style.overflow = '';
    return;
  }

  // Pre-load whoosh sound
  const whooshSound = new Audio('dragon-studio-whoosh-cinematic-sound-effect-376889.mp3');
  whooshSound.load();

  // Lock page scroll
  document.body.classList.add('intro-active');
  document.body.style.overflow = 'hidden';

  let introStep = 0;
  let skipped = false;

  // 1. Static Burst Canvas
  function runStatic() {
    if (skipped) return;
    const ctx = introStatic.getContext('2d');
    introStatic.width = window.innerWidth;
    introStatic.height = window.innerHeight;
    introStatic.classList.add('active');

    const duration = 400;
    const start = performance.now();

    function draw(now) {
      if (skipped) return;
      const elapsed = now - start;
      ctx.clearRect(0, 0, introStatic.width, introStatic.height);

      // Draw random noise
      for (let i = 0; i < 50; i++) {
        ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.15})`;
        ctx.fillRect(Math.random() * introStatic.width, Math.random() * introStatic.height, Math.random() * 100, 1);
      }

      if (elapsed < duration) {
        requestAnimationFrame(draw);
      } else {
        introStatic.classList.remove('active');
        startLogoDraw();
      }
    }
    requestAnimationFrame(draw);
  }

  // 2. Logo Draw
  function startLogoDraw() {
    if (skipped) return;
    nsPath.classList.add('animate');
    setTimeout(typeName, 800);
  }

  // 3. Typewriter Name
  function typeName() {
    if (skipped) return;
    const name = "NEMISH SAPARA";
    let i = 0;
    function type() {
      if (skipped) return;
      if (i < name.length) {
        introNameTyped.textContent += name.charAt(i);
        i++;
        setTimeout(type, 70);
      } else {
        showSub();
      }
    }
    type();
  }

  // 4. Subtitle Flicker
  function showSub() {
    if (skipped) return;
    introSub.classList.add('show');
    // Auto trigger exit
    setTimeout(exitIntro, 1500);
  }

  // 5. Exit Script
  function exitIntro() {
    if (skipped && introStep > 0) return;
    introStep = 1;

    // Mark intro as seen permanently so it never replays
    localStorage.setItem('introSeen', '1');

    // Trigger sound
    whooshSound.currentTime = 0;
    whooshSound.play().catch(() => { });

    // Animation classes
    introScreen.classList.add('compress');

    setTimeout(() => {
      introScreen.style.opacity = '0';
      setTimeout(() => {
        introScreen.classList.add('hidden');
        document.body.classList.remove('intro-active');
        document.body.style.overflow = '';
      }, 400);
    }, 500);
  }

  // Start sequence
  runStatic();

  // Click to skip
  introScreen.addEventListener('click', () => {
    if (introStep === 0) {
      skipped = true;
      exitIntro();
    }
  });

})();

/* ============================================
   PORTFOLIO SCRIPT â€” Interactive Features
============================================ */

// â”€â”€â”€ Custom Cursor â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursorFollower');
let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top = mouseY + 'px';
});

function animateFollower() {
  followerX += (mouseX - followerX) * 0.12;
  followerY += (mouseY - followerY) * 0.12;
  follower.style.left = followerX + 'px';
  follower.style.top = followerY + 'px';
  requestAnimationFrame(animateFollower);
}
animateFollower();

// Scale cursor on hover
document.querySelectorAll('a, button, .project-card, .skill-category').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.transform = 'translate(-50%, -50%) scale(2.5)';
    cursor.style.background = 'rgba(255,255,255,0.4)';
    follower.style.transform = 'translate(-50%, -50%) scale(1.5)';
    follower.style.borderColor = 'rgba(255,255,255,0.6)';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.transform = 'translate(-50%, -50%) scale(1)';
    cursor.style.background = '#fff';
    follower.style.transform = 'translate(-50%, -50%) scale(1)';
    follower.style.borderColor = 'rgba(255,255,255,0.2)';
  });
});

// â”€â”€â”€ Global Background Canvas (Particle Network) â”€â”€â”€
const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');
let particles = [];
let animFrame;
let mouse = { x: -100, y: -100 };

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

class Particle {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.vx = (Math.random() - 0.5) * 0.2; // Slower movement
    this.vy = (Math.random() - 0.5) * 0.2;
    this.radius = Math.random() * 1.2 + 0.3; // Smaller, sharper particles
    this.alpha = Math.random() * 0.4 + 0.1;
    this.color = '255, 255, 255';
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;

    // Subtle mouse parallax
    const dx = mouse.x - this.x;
    const dy = mouse.y - this.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 200) {
      this.x -= dx * 0.01;
      this.y -= dy * 0.01;
    }

    if (this.x < 0) this.x = canvas.width;
    if (this.x > canvas.width) this.x = 0;
    if (this.y < 0) this.y = canvas.height;
    if (this.y > canvas.height) this.y = 0;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${this.color},${this.alpha})`;
    ctx.fill();
  }
}

function initParticles() {
  particles = [];
  const count = Math.min(120, Math.floor((canvas.width * canvas.height) / 15000));
  for (let i = 0; i < count; i++) {
    particles.push(new Particle());
  }
}

function drawConnections() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 150) {
        const alpha = (1 - dist / 150) * 0.12; // Thinner connections
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
        ctx.lineWidth = 0.4;
        ctx.stroke();
      }
    }
  }
}

function animateCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  drawConnections();
  animFrame = requestAnimationFrame(animateCanvas);
}

window.addEventListener('mousemove', (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

window.addEventListener('resize', () => {
  resizeCanvas();
  initParticles();
});

resizeCanvas();
initParticles();
animateCanvas();

// â”€â”€â”€ Role Text Rotator â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const roleItems = document.querySelectorAll('.role-item');
let currentRole = 0;

function rotateRole() {
  roleItems[currentRole].classList.remove('active');
  roleItems[currentRole].classList.add('exit');

  setTimeout(() => {
    roleItems[currentRole].classList.remove('exit');
    currentRole = (currentRole + 1) % roleItems.length;
    roleItems[currentRole].classList.add('active');
  }, 500);
}

setInterval(rotateRole, 2500);

// â”€â”€â”€ Navbar element reference â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const nav = document.getElementById('nav');

// â”€â”€â”€ Mobile Menu â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
let menuOpen = false;

hamburger.addEventListener('click', () => {
  menuOpen = !menuOpen;
  mobileMenu.classList.toggle('open', menuOpen);
  // Animate hamburger
  const spans = hamburger.querySelectorAll('span');
  if (menuOpen) {
    spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
  } else {
    spans[0].style.transform = '';
    spans[1].style.opacity = '';
    spans[2].style.transform = '';
  }
});

document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => {
    menuOpen = false;
    mobileMenu.classList.remove('open');
    const spans = hamburger.querySelectorAll('span');
    spans[0].style.transform = '';
    spans[1].style.opacity = '';
    spans[2].style.transform = '';
  });
});

// â”€â”€â”€ Scroll Reveal â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const revealEls = document.querySelectorAll(
  '.about-grid, .skill-category, .project-card, .contact-card, .contact-form, .section-title, .section-subtitle, .section-label, .highlight-item'
);

revealEls.forEach(el => el.classList.add('reveal'));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, 80);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

revealEls.forEach(el => revealObserver.observe(el));

// â”€â”€â”€ Skill Bar Animation â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const skillFills = document.querySelectorAll('.skill-fill');

const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const fill = entry.target;
      const width = fill.getAttribute('data-width');
      setTimeout(() => {
        fill.style.width = width + '%';
      }, 200);
      skillObserver.unobserve(fill);
    }
  });
}, { threshold: 0.3 });

skillFills.forEach(fill => skillObserver.observe(fill));

// â”€â”€â”€ Staggered Card Reveals â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function staggerReveal(selector, delay = 100) {
  const cards = document.querySelectorAll(selector);
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        const idx = Array.from(cards).indexOf(entry.target);
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, idx * delay);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  cards.forEach(card => obs.observe(card));
}

staggerReveal('.skill-category', 120);
staggerReveal('.project-card', 100);
staggerReveal('.contact-card', 80);

// â”€â”€â”€ Neural Network Animation â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
(function () {
  const nc = document.getElementById('neuralCanvas');
  if (!nc) return;
  const nctx = nc.getContext('2d');

  let W, H, nodes = [], pulses = [], frame = 0;
  let mouseX = -999, mouseY = -999, prevMouseX = -999, prevMouseY = -999;
  let mouseVX = 0, mouseVY = 0;

  const COUNT = 38;
  const COLORS = ['#a78bfa', '#818cf8', '#c4b5fd', '#7dd3fc', '#f0abfc', '#ffffff'];
  const CONNECT_DIST = 130;

  function resize() {
    const r = nc.parentElement.getBoundingClientRect();
    W = nc.width = r.width || 500;
    H = nc.height = r.height || 500;
    init();
  }

  function init() {
    nodes = [];
    pulses = [];
    for (let i = 0; i < COUNT; i++) {
      nodes.push({
        x: W * 0.1 + Math.random() * W * 0.8,
        y: H * 0.1 + Math.random() * H * 0.8,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        ax: 0, ay: 0,          // acceleration
        r: Math.random() * 2.5 + 2,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        glow: Math.random(),
        glowDir: Math.random() > 0.5 ? 1 : -1,
        pulseAlpha: 0,
        mass: Math.random() * 0.6 + 0.7   // heavier = less reactive
      });
    }
  }

  function spawnPulse(a, b) {
    pulses.push({
      fromX: a.x, fromY: a.y,
      toX: b.x, toY: b.y,
      t: 0,
      speed: 0.014 + Math.random() * 0.016,
      color: Math.random() > 0.5 ? a.color : b.color,
      target: b
    });
  }

  function draw() {
    nctx.clearRect(0, 0, W, H);
    frame++;

    // Mouse velocity
    if (prevMouseX !== -999) {
      mouseVX = mouseVX * 0.6 + (mouseX - prevMouseX) * 0.4;
      mouseVY = mouseVY * 0.6 + (mouseY - prevMouseY) * 0.4;
    }
    prevMouseX = mouseX; prevMouseY = mouseY;

    // Cursor aura glow
    if (mouseX > 0) {
      const aura = nctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, 90);
      aura.addColorStop(0, 'rgba(167,139,250,0.12)');
      aura.addColorStop(1, 'rgba(0,0,0,0)');
      nctx.beginPath();
      nctx.arc(mouseX, mouseY, 90, 0, Math.PI * 2);
      nctx.fillStyle = aura;
      nctx.fill();
    }

    // Update node physics
    nodes.forEach(n => {
      n.ax = 0; n.ay = 0;

      if (mouseX > 0) {
        const dx = mouseX - n.x;
        const dy = mouseY - n.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 160 && dist > 1) {
          // Attract toward cursor with mouse velocity boost
          const force = (160 - dist) / 160;
          const boost = 1 + Math.sqrt(mouseVX * mouseVX + mouseVY * mouseVY) * 0.04;
          n.ax += (dx / dist) * force * 0.18 * boost / n.mass;
          n.ay += (dy / dist) * force * 0.18 * boost / n.mass;
          // Add some of the mouse's own velocity as a "flick"
          n.ax += mouseVX * 0.012 * force / n.mass;
          n.ay += mouseVY * 0.012 * force / n.mass;
          n.pulseAlpha = Math.min(1, n.pulseAlpha + force * 0.08);
        }

        // Hard repel at very close range
        if (dist < 40 && dist > 1) {
          n.ax -= (dx / dist) * 1.2 / n.mass;
          n.ay -= (dy / dist) * 1.2 / n.mass;
        }
      }

      // Inter-node weak repulsion (avoid clumping)
      nodes.forEach(other => {
        if (other === n) return;
        const dx = n.x - other.x, dy = n.y - other.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 45 && d > 0.5) {
          n.ax += (dx / d) * 0.06;
          n.ay += (dy / d) * 0.06;
        }
      });

      n.vx = (n.vx + n.ax) * 0.94;
      n.vy = (n.vy + n.ay) * 0.94;

      // Speed cap based on mass
      const spd = Math.sqrt(n.vx * n.vx + n.vy * n.vy);
      const maxSpd = 3.5 / n.mass;
      if (spd > maxSpd) { n.vx *= maxSpd / spd; n.vy *= maxSpd / spd; }

      n.x += n.vx; n.y += n.vy;

      // Soft wall bounce
      if (n.x < 20) { n.x = 20; n.vx = Math.abs(n.vx) * 0.5; }
      if (n.x > W - 20) { n.x = W - 20; n.vx = -Math.abs(n.vx) * 0.5; }
      if (n.y < 20) { n.y = 20; n.vy = Math.abs(n.vy) * 0.5; }
      if (n.y > H - 20) { n.y = H - 20; n.vy = -Math.abs(n.vy) * 0.5; }

      // Glow pulsing
      n.glow += n.glowDir * 0.018;
      if (n.glow > 1) { n.glow = 1; n.glowDir = -1; }
      if (n.glow < 0.25) { n.glow = 0.25; n.glowDir = 1; }
      if (n.pulseAlpha > 0) n.pulseAlpha -= 0.025;
    });

    // Draw connections
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i], b = nodes[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < CONNECT_DIST) {
          const alpha = (1 - d / CONNECT_DIST) * 0.22;
          nctx.beginPath();
          nctx.moveTo(a.x, a.y);
          nctx.lineTo(b.x, b.y);
          nctx.strokeStyle = `rgba(167,139,250,${alpha})`;
          nctx.lineWidth = 0.7;
          nctx.stroke();

          // Spawn pulse occasionally along active edges
          if (frame % 40 === 0 && Math.random() < 0.15 && pulses.length < 18) {
            spawnPulse(a, b);
          }
        }
      }
    }

    // Draw pulses
    pulses = pulses.filter(p => p.t <= 1);
    pulses.forEach(p => {
      p.t += p.speed;
      const px = p.fromX + (p.toX - p.fromX) * p.t;
      const py = p.fromY + (p.toY - p.fromY) * p.t;
      const alpha = Math.sin(p.t * Math.PI);
      nctx.beginPath();
      nctx.arc(px, py, 3.5, 0, Math.PI * 2);
      nctx.shadowColor = p.color;
      nctx.shadowBlur = 14;
      nctx.fillStyle = p.color;
      nctx.globalAlpha = alpha * 0.85;
      nctx.fill();
      nctx.beginPath();
      nctx.arc(px, py, 1.5, 0, Math.PI * 2);
      nctx.fillStyle = '#fff';
      nctx.globalAlpha = alpha;
      nctx.fill();
      nctx.globalAlpha = 1;
      nctx.shadowBlur = 0;
      if (p.t > 0.88) p.target.pulseAlpha = Math.min(1, p.target.pulseAlpha + 0.6);
    });

    // Draw nodes
    nodes.forEach(n => {
      const g = n.glow + n.pulseAlpha * 0.5;
      const spd = Math.sqrt(n.vx * n.vx + n.vy * n.vy);
      const speedGlow = Math.min(spd / 3, 1);

      // Speed trail when moving fast
      if (spd > 0.8) {
        nctx.beginPath();
        nctx.arc(n.x - n.vx * 3, n.y - n.vy * 3, n.r * 0.6, 0, Math.PI * 2);
        nctx.fillStyle = n.color;
        nctx.globalAlpha = speedGlow * 0.2;
        nctx.fill();
        nctx.globalAlpha = 1;
      }

      // Outer glow halo
      const halo = nctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r * 5);
      halo.addColorStop(0, n.color + '44');
      halo.addColorStop(1, 'transparent');
      nctx.beginPath();
      nctx.arc(n.x, n.y, n.r * 5, 0, Math.PI * 2);
      nctx.fillStyle = halo;
      nctx.globalAlpha = g * 0.5 + speedGlow * 0.3;
      nctx.fill();
      nctx.globalAlpha = 1;

      // Node body
      nctx.beginPath();
      nctx.arc(n.x, n.y, n.r + speedGlow, 0, Math.PI * 2);
      nctx.shadowColor = n.color;
      nctx.shadowBlur = 12 * g + speedGlow * 10;
      nctx.fillStyle = n.color;
      nctx.globalAlpha = 0.55 + g * 0.45;
      nctx.fill();

      // Bright white core
      nctx.beginPath();
      nctx.arc(n.x, n.y, n.r * 0.4, 0, Math.PI * 2);
      nctx.fillStyle = '#fff';
      nctx.globalAlpha = 0.6 + n.pulseAlpha * 0.4;
      nctx.fill();

      nctx.globalAlpha = 1;
      nctx.shadowBlur = 0;
    });

    requestAnimationFrame(draw);
  }

  nc.parentElement.addEventListener('mousemove', e => {
    const r = nc.getBoundingClientRect();
    mouseX = e.clientX - r.left;
    mouseY = e.clientY - r.top;
  });
  nc.parentElement.addEventListener('mouseleave', () => {
    mouseX = -999; mouseY = -999;
    mouseVX = 0; mouseVY = 0;
    prevMouseX = -999;
  });
  // Touch support for neural canvas
  nc.parentElement.addEventListener('touchmove', e => {
    e.preventDefault();
    const r = nc.getBoundingClientRect();
    const t = e.touches[0];
    mouseX = t.clientX - r.left;
    mouseY = t.clientY - r.top;
  }, { passive: false });
  nc.parentElement.addEventListener('touchend', () => {
    mouseX = -999; mouseY = -999;
    mouseVX = 0; mouseVY = 0;
    prevMouseX = -999;
  });

  window.addEventListener('resize', resize);
  resize();
  draw();
})();
// â”€â”€â”€ Contact Form â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const btn = contactForm.querySelector('button[type="submit"]');
  const btnText = btn.querySelector('span');
  const formData = new FormData(contactForm);

  btn.disabled = true;
  btnText.textContent = 'Sending...';

  try {
    const response = await fetch(contactForm.action, {
      method: contactForm.method,
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    });

    if (response.ok) {
      formSuccess.textContent = "âœ“ Message sent successfully! I'll get back to you soon.";
      formSuccess.style.color = "#22c55e";
      formSuccess.style.background = "rgba(34, 197, 94, 0.1)";
      formSuccess.style.borderColor = "rgba(34, 197, 94, 0.3)";
      formSuccess.classList.add('show');
      contactForm.reset();
    } else {
      const data = await response.json();
      formSuccess.textContent = data.errors
        ? data.errors.map(err => err.message).join(", ")
        : "Something went wrong. Please try again.";
      formSuccess.style.color = "#ef4444";
      formSuccess.style.background = "rgba(239, 68, 68, 0.1)";
      formSuccess.style.borderColor = "rgba(239, 68, 68, 0.3)";
      formSuccess.classList.add('show');
    }
  } catch (error) {
    formSuccess.textContent = "Network error. Please check your connection and try again.";
    formSuccess.style.color = "#ef4444";
    formSuccess.style.background = "rgba(239, 68, 68, 0.1)";
    formSuccess.style.borderColor = "rgba(239, 68, 68, 0.3)";
    formSuccess.classList.add('show');
  } finally {
    btn.disabled = false;
    btnText.textContent = 'Send Message';
    setTimeout(() => {
      formSuccess.classList.remove('show');
    }, 6000);
  }
});

// â”€â”€â”€ Smooth Anchor Scroll â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const href = anchor.getAttribute('href');
    if (href === '#') return;
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// â”€â”€â”€ Unified Scroll Handler (RAF-throttled) â”€â”€â”€
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');
const heroContent = document.querySelector('.hero-content');
const heroVisual = document.querySelector('.hero-visual');
let scrollRAF = false;

function onScrollFrame() {
  const scrollY = window.scrollY;

  // 1. Navbar scrolled class
  nav.classList.toggle('scrolled', scrollY > 50);

  // 2. Active nav link
  const threshold = scrollY + 120;
  let currentId = '';
  sections.forEach(s => { if (s.offsetTop <= threshold) currentId = s.id; });
  navLinks.forEach(link => {
    const isActive = link.getAttribute('href') === '#' + currentId;
    if (isActive) link.classList.add('active');
    else link.classList.remove('active');
  });

  // 3. Parallax (hero only, below fold disabled)
  if (heroContent && scrollY < window.innerHeight) {
    heroContent.style.transform = `translateY(${scrollY * 0.15}px)`;
    if (heroVisual) heroVisual.style.transform = `translateY(${scrollY * 0.1}px)`;
  }

  scrollRAF = false;
}

window.addEventListener('scroll', () => {
  if (!scrollRAF) {
    scrollRAF = true;
    requestAnimationFrame(onScrollFrame);
  }
}, { passive: true });

onScrollFrame(); // run once on load

// â”€â”€â”€ Tilt Effect on Hero Card â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const heroCard = document.querySelector('.hero-card');
if (heroCard) {
  heroCard.addEventListener('mousemove', (e) => {
    const rect = heroCard.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rotX = ((y - cy) / cy) * -8;
    const rotY = ((x - cx) / cx) * 8;
    heroCard.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.02)`;
  });

  heroCard.addEventListener('mouseleave', () => {
    heroCard.style.transform = 'perspective(800px) rotateX(0) rotateY(0) scale(1)';
    heroCard.style.transition = 'transform 0.5s ease';
  });

  heroCard.addEventListener('mouseenter', () => {
    heroCard.style.transition = 'transform 0.1s ease';
  });
}

// â”€â”€â”€ Typing Effect for Hero Name â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function typeWriter(element, text, speed = 80) {
  element.textContent = '';
  let i = 0;
  function type() {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  }
  setTimeout(type, 600);
}

const heroName = document.getElementById('heroName');
if (heroName) {
  const name = heroName.textContent;
  typeWriter(heroName, name, 70);
}

// Parallax is now handled in the unified scroll handler above

// â”€â”€â”€ Project Card Shimmer â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    card.style.setProperty('--mouse-x', x + '%');
    card.style.setProperty('--mouse-y', y + '%');
  });
});

// â”€â”€â”€ Console Easter Egg â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
console.log('%cðŸ‘‹ Hey there, fellow developer!', 'font-size: 20px; font-weight: bold; color: #ffffff;');
console.log('%cLike what you see? Let\'s connect!', 'font-size: 14px; color: #cbd5e1;');
console.log('%cðŸ“§ nemishsapara69@gmail.com', 'font-size: 14px; color: #ffffff;');




// --- Lightning Storm ----------------------------------------------------
(function () {
  var canvas = document.getElementById('lightningCanvas');
  var btn    = document.getElementById('lightningBtn');
  if (!canvas) return;

  var ctx = canvas.getContext('2d');
  var W, H;
  var bolts      = [];
  var animId     = null;
  var spawnTimer = null;
  var running    = false;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  // Recursive midpoint displacement to build a jagged bolt path
  function buildBolt(x1, y1, x2, y2, depth) {
    var segs = [];
    if (depth <= 0) {
      segs.push({ x1: x1, y1: y1, x2: x2, y2: y2 });
      return segs;
    }
    var spread = (Math.abs(x2 - x1) + Math.abs(y2 - y1)) * 0.38;
    var mx = (x1 + x2) / 2 + (Math.random() - 0.5) * spread;
    var my = (y1 + y2) / 2 + (Math.random() - 0.5) * spread;

    segs = segs.concat(buildBolt(x1, y1, mx, my, depth - 1));
    segs = segs.concat(buildBolt(mx, my, x2, y2, depth - 1));

    // Random fork
    if (depth > 3 && Math.random() < 0.45) {
      var fxAngle = Math.atan2(y2 - y1, x2 - x1) + (Math.random() - 0.5) * 1.2;
      var fxLen   = Math.sqrt(spread * spread) * (0.5 + Math.random() * 0.8);
      var fx = mx + Math.cos(fxAngle) * fxLen;
      var fy = my + Math.sin(fxAngle) * fxLen;
      segs = segs.concat(buildBolt(mx, my, fx, fy, depth - 3));
    }
    return segs;
  }

  function spawnBolt() {
    var x1, y1, x2, y2;
    var r = Math.random();
    if (r < 0.55) {
      // Top edge down
      x1 = W * (0.1 + Math.random() * 0.8);
      y1 = 0;
      x2 = x1 + (Math.random() - 0.5) * W * 0.55;
      y2 = H * (0.35 + Math.random() * 0.65);
    } else if (r < 0.77) {
      // Left edge across
      x1 = 0; y1 = H * Math.random();
      x2 = W * (0.4 + Math.random() * 0.55);
      y2 = y1 + (Math.random() - 0.5) * H * 0.45;
    } else {
      // Right edge across
      x1 = W; y1 = H * Math.random();
      x2 = W * (Math.random() * 0.55);
      y2 = y1 + (Math.random() - 0.5) * H * 0.45;
    }

    bolts.push({
      segs:  buildBolt(x1, y1, x2, y2, 7),
      alpha: 1.0,
      decay: 0.02 + Math.random() * 0.022,
      w:     1.0 + Math.random() * 1.4
    });
  }

  function frame() {
    ctx.clearRect(0, 0, W, H);
    bolts = bolts.filter(function (b) { return b.alpha > 0.015; });

    for (var bi = 0; bi < bolts.length; bi++) {
      var b = bolts[bi];
      b.alpha -= b.decay;
      var a = Math.max(0, b.alpha);

      // Layer 1 — fat outer glow (violet)
      ctx.save();
      ctx.strokeStyle = 'rgba(109, 40, 217, ' + (a * 0.3) + ')';
      ctx.lineWidth   = b.w * 8;
      ctx.shadowColor = '#6d28d9';
      ctx.shadowBlur  = 40;
      ctx.beginPath();
      for (var si = 0; si < b.segs.length; si++) {
        ctx.moveTo(b.segs[si].x1, b.segs[si].y1);
        ctx.lineTo(b.segs[si].x2, b.segs[si].y2);
      }
      ctx.stroke();
      ctx.restore();

      // Layer 2 — mid glow (purple)
      ctx.save();
      ctx.strokeStyle = 'rgba(192, 132, 252, ' + (a * 0.65) + ')';
      ctx.lineWidth   = b.w * 3;
      ctx.shadowColor = '#c084fc';
      ctx.shadowBlur  = 18;
      ctx.beginPath();
      for (var si2 = 0; si2 < b.segs.length; si2++) {
        ctx.moveTo(b.segs[si2].x1, b.segs[si2].y1);
        ctx.lineTo(b.segs[si2].x2, b.segs[si2].y2);
      }
      ctx.stroke();
      ctx.restore();

      // Layer 3 — bright white-pink core
      ctx.save();
      ctx.strokeStyle = 'rgba(255, 240, 255, ' + (a * 0.92) + ')';
      ctx.lineWidth   = b.w;
      ctx.shadowColor = '#f0abfc';
      ctx.shadowBlur  = 10;
      ctx.beginPath();
      for (var si3 = 0; si3 < b.segs.length; si3++) {
        ctx.moveTo(b.segs[si3].x1, b.segs[si3].y1);
        ctx.lineTo(b.segs[si3].x2, b.segs[si3].y2);
      }
      ctx.stroke();
      ctx.restore();
    }

    animId = requestAnimationFrame(frame);
  }

  function scheduleNext() {
    if (!running) return;
    spawnTimer = setTimeout(function () {
      spawnBolt();
      if (Math.random() < 0.35) {
        setTimeout(spawnBolt, 60 + Math.random() * 100);
      }
      scheduleNext();
    }, 350 + Math.random() * 750);
  }

  function start() {
    resize();
    canvas.classList.remove('fading');
    canvas.classList.add('visible');
    running = true;
    spawnBolt();
    scheduleNext();
    frame();
    if (btn) btn.classList.add('active');
  }

  function stop() {
    running = false;
    clearTimeout(spawnTimer);
    if (btn) btn.classList.remove('active');
    // Let bolts finish fading, then hide canvas
    setTimeout(function () {
      cancelAnimationFrame(animId);
      animId = null;
      bolts  = [];
      canvas.classList.add('fading');
      setTimeout(function () {
        canvas.classList.remove('visible', 'fading');
        ctx.clearRect(0, 0, W, H);
      }, 520);
    }, 1200);
  }

  function toggle() {
    if (running) { stop(); } else { start(); }
  }

  if (btn) btn.addEventListener('click', toggle);
  window.addEventListener('resize', resize);
})();
