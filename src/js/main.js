import '../css/main.css';
import { initBackground } from './background.js';
import { initCustomCursor } from './custom-cursor.js';
import { initDashboardSimulator } from './dashboard-mock.js';
import { initAnimations } from './animations.js';

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Custom Particle Background Canvas
  initBackground();

  // Initialize Custom Mouse Trail Cursor
  initCustomCursor();

  // Initialize Vision Pro style Interactive Dashboard Widgets
  initDashboardSimulator();

  // Initialize GSAP timelines, Lenis scroll and magnetic actions
  initAnimations();
});
