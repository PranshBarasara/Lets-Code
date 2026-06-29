export function initCustomCursor() {
  const cursor = document.getElementById('custom-cursor');
  const glow = document.getElementById('custom-cursor-glow');

  if (!cursor || !glow) return;

  let mouseX = 0, mouseY = 0; // Target coordinates
  let cursorX = 0, cursorY = 0; // Current smooth coordinates
  let glowX = 0, glowY = 0; // Glow smooth coordinates

  // Smooth lerp values
  const cursorLerp = 0.2;
  const glowLerp = 0.08;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function updatePosition() {
    // Lerping calculations
    cursorX += (mouseX - cursorX) * cursorLerp;
    cursorY += (mouseY - cursorY) * cursorLerp;

    glowX += (mouseX - glowX) * glowLerp;
    glowY += (mouseY - glowY) * glowLerp;

    cursor.style.left = `${cursorX}px`;
    cursor.style.top = `${cursorY}px`;

    glow.style.left = `${glowX}px`;
    glow.style.top = `${glowY}px`;

    requestAnimationFrame(updatePosition);
  }

  updatePosition();

  // Hover states
  const interactives = document.querySelectorAll('a, button, .glass-panel, .community-card, .btn-glass, .btn-primary-glow, .tool-card, .bento-card');
  
  interactives.forEach((el) => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('hovered');
    });

    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('hovered');
    });
  });
}
