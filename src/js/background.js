export function initBackground() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  const particles = [];
  const particleCount = 60;
  const connectionDistance = 140;
  const mouse = { x: null, y: null, radius: 180 };

  // Listeners
  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.radius = Math.random() * 2 + 1;
      // Some particles are represented as code characters
      this.isCodeChar = Math.random() > 0.85;
      this.char = ['{', '}', '[', ']', '<', '>', '/', ';', '+', '-'][Math.floor(Math.random() * 10)];
      this.color = Math.random() > 0.5 ? 'rgba(79, 125, 255, 0.4)' : 'rgba(123, 97, 255, 0.4)';
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      // Bounce/Wrap boundaries
      if (this.x < 0 || this.x > width) this.vx = -this.vx;
      if (this.y < 0 || this.y > height) this.vy = -this.vy;

      // Mouse interactive push
      if (mouse.x !== null && mouse.y !== null) {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const dist = Math.hypot(dx, dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          const angle = Math.atan2(dy, dx);
          this.x += Math.cos(angle) * force * 1.5;
          this.y += Math.sin(angle) * force * 1.5;
        }
      }
    }

    draw() {
      ctx.fillStyle = this.color;
      if (this.isCodeChar) {
        ctx.font = '8px monospace';
        ctx.fillText(this.char, this.x, this.y);
      } else {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  // Populate particles
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  // Draw grid background (Linear.app style)
  function drawGrid() {
    const gridSize = 80;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.015)';
    ctx.lineWidth = 1;

    for (let x = 0; x < width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    for (let y = 0; y < height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  }

  function animate() {
    // 1. Clear background with slight alpha overlay to leave trails (creates soft glowing shadows)
    ctx.fillStyle = '#050505';
    ctx.fillRect(0, 0, width, height);

    // 2. Draw static subtle tech elements (Aurora mesh gradient)
    const gradient = ctx.createRadialGradient(
      width * 0.5, height * 0.5, 10,
      width * 0.5, height * 0.5, Math.max(width, height) * 0.8
    );
    gradient.addColorStop(0, 'rgba(79, 125, 255, 0.025)');
    gradient.addColorStop(0.5, 'rgba(123, 97, 255, 0.015)');
    gradient.addColorStop(1, 'rgba(5, 5, 5, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Dynamic mouse glow
    if (mouse.x !== null && mouse.y !== null) {
      const mouseGlow = ctx.createRadialGradient(
        mouse.x, mouse.y, 0,
        mouse.x, mouse.y, mouse.radius * 1.5
      );
      mouseGlow.addColorStop(0, 'rgba(79, 125, 255, 0.04)');
      mouseGlow.addColorStop(0.5, 'rgba(123, 97, 255, 0.01)');
      mouseGlow.addColorStop(1, 'transparent');
      ctx.fillStyle = mouseGlow;
      ctx.fillRect(0, 0, width, height);
    }

    drawGrid();

    // 3. Update & draw particles
    particles.forEach((p) => {
      p.update();
      p.draw();
    });

    // 4. Draw network lines
    ctx.lineWidth = 0.5;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.hypot(dx, dy);

        if (dist < connectionDistance) {
          const alpha = (1 - dist / connectionDistance) * 0.12;
          ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(animate);
  }

  animate();
}
