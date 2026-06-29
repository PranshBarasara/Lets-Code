import { gsap } from 'gsap';

export function initDashboardSimulator() {
  // 1. Resume Score Progress Ring
  const circle = document.querySelector('.resume-score-ring svg circle.progress-ring-circle');
  const scoreText = document.querySelector('.resume-score-text');
  
  if (circle && scoreText) {
    const radius = circle.r.baseVal.value;
    const circumference = radius * 2 * Math.PI;

    circle.style.strokeDasharray = `${circumference} ${circumference}`;
    circle.style.strokeDashoffset = circumference;

    function setProgress(percent) {
      const offset = circumference - (percent / 100) * circumference;
      circle.style.strokeDashoffset = offset;
      scoreText.textContent = `${percent}%`;
    }

    // Set initial progress after brief delay
    setTimeout(() => {
      setProgress(88);
    }, 1200);
  }

  // 2. Animated GitHub commit line charts (SVG path shifting) - if path exists
  const chartPath = document.getElementById('chart-line');
  if (chartPath) {
    let points = [30, 70, 45, 95, 60, 110, 80, 130];
    
    function generatePath(data) {
      const widthStep = 400 / (data.length - 1);
      return data.reduce((path, val, idx) => {
        const x = idx * widthStep;
        const y = 140 - val; // Invert for canvas top-left coordinate system
        return path + `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
      }, '');
    }

    setInterval(() => {
      points = points.map(p => {
        const diff = (Math.random() - 0.5) * 20;
        return Math.max(20, Math.min(130, p + diff));
      });
      chartPath.setAttribute('d', generatePath(points));
    }, 3000);
  }

  // 3. Floating Notifications inside Showcase & Hero Sections
  const notifications = [
    { title: 'AI Job Finder', msg: 'Software Engineer match at Razorpay: 96%', icon: '💼', color: '#00FFC6' },
    { title: 'TCS Prep Guide', msg: 'Crack TCS coding round: 120+ PYQs unlocked', icon: '🎯', color: '#4F7DFF' },
    { title: 'AI Resume Studio', msg: 'ATS score optimized to 94 using Sigma template', icon: '✨', color: '#7B61FF' },
    { title: 'DSA Masters Group', msg: 'New daily challenge posted in Discord', icon: '💻', color: '#F59E0B' },
    { title: 'Mock Interview', msg: 'CS Fundamentals round completed: Grade A+', icon: '🚀', color: '#00D9FF' },
  ];

  const showcaseContent = document.querySelector('.showcase-content');
  if (showcaseContent) {
    function createLiveToast() {
      const item = notifications[Math.floor(Math.random() * notifications.length)];
      
      const toast = document.createElement('div');
      toast.className = 'glass-panel floating-alert';
      toast.style.position = 'absolute';
      toast.style.bottom = '30px';
      toast.style.right = '30px';
      toast.style.zIndex = '99';
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(20px) scale(0.95)';
      toast.style.transition = 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
      toast.style.display = 'flex';
      toast.style.alignItems = 'center';
      toast.style.gap = '12px';
      toast.style.padding = '14px 20px';

      toast.innerHTML = `
        <div class="alert-icon" style="background: rgba(255,255,255,0.05); color: ${item.color}">${item.icon}</div>
        <div>
          <div style="font-weight: 700; font-size: 0.85rem; color: #fff;">${item.title}</div>
          <div style="font-size: 0.75rem; color: #8A8A8A;">${item.msg}</div>
        </div>
      `;

      showcaseContent.appendChild(toast);

      setTimeout(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateY(0) scale(1)';
      }, 100);

      setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(-20px) scale(0.95)';
        setTimeout(() => toast.remove(), 500);
      }, 4000);
    }

    setInterval(createLiveToast, 6000);
  }

  // 4. Copilot Terminal Typing Simulation
  initTerminalTyping();

  // 5. Hero Activity Ticker Rotation
  initHeroTicker();

  // 6. Title Word Glitch Scramble
  initGlitchHover();

  // 7. Confetti Burst Triggers
  initConfettiBurst();

  // 8. 3D Tilt for Terminal and Showcase Card
  init3DTilt();
}

function initTerminalTyping() {
  const terminalLines = [
    '<span class="t-comment">// Initialize Let\'s Code AI placement agent...</span>',
    '<span class="t-keyword">const</span> <span class="t-var">agent</span> = <span class="t-keyword">new</span> <span class="t-func">PlacementAssistant</span>({ user: <span class="t-str">"candidate"</span> });',
    '<span class="t-keyword">await</span> <span class="t-var">agent</span>.<span class="t-func">analyzeProfile</span>({ resume: <span class="t-str">"ATS_Optimized.pdf"</span> });',
    '<span class="t-output">&gt;&gt; Resume Match: 98% (Excellent Fit)</span>',
    '<span class="t-output">&gt;&gt; Recommended Roles: SDE, Frontend, AI Engineer</span>',
    '<span class="t-comment">// Fetching latest Google, Amazon & TCS coding rounds...</span>',
    '<span class="t-keyword">const</span> <span class="t-var">pyqs</span> = <span class="t-keyword">await</span> <span class="t-var">agent</span>.<span class="t-func">loadPYQs</span>([<span class="t-str">"Amazon"</span>, <span class="t-str">"Google"</span>, <span class="t-str">"TCS"</span>]);',
    '<span class="t-keyword">const</span> <span class="t-var">roadmap</span> = <span class="t-var">agent</span>.<span class="t-func">generate90DayRoadmap</span>(<span class="t-var">pyqs</span>);',
    '<span class="t-output">&gt;&gt; Generation complete. Opening dashboard...</span>',
    '<span class="t-var">agent</span>.<span class="t-func">startMockInterview</span>({ topic: <span class="t-str">"Data Structures"</span> });',
    '<span class="t-output">&gt;&gt; AI Evaluator: "Explain Dijkstra\'s complexity..."</span>'
  ];

  let lineIndex = 0;
  const terminalBody = document.getElementById('terminal-body');

  function typeTerminal() {
    if (!terminalBody) return;
    if (lineIndex < terminalLines.length) {
      const line = document.createElement('div');
      line.innerHTML = terminalLines[lineIndex];
      terminalBody.appendChild(line);
      terminalBody.scrollTop = terminalBody.scrollHeight;
      lineIndex++;
      setTimeout(typeTerminal, 1800);
    } else {
      setTimeout(() => {
        terminalBody.innerHTML = '';
        lineIndex = 0;
        typeTerminal();
      }, 4000);
    }
  }
  typeTerminal();
}

function initHeroTicker() {
  const el = document.getElementById('heroTicker');
  if (!el) return;
  const items = [
    'Aman just checked his Job Ready Score — 94/100',
    'Riya started a Mock Interview on System Design',
    'Karthik joined the AI/ML Engineers community',
    'Sneha generated an ATS resume in 40 seconds',
    'Vivek tracked a new application — Goldman Sachs',
    'Pooja unlocked her GitHub Optimizer report'
  ];
  let i = 0;
  setInterval(()=>{
    el.style.opacity = '0';
    el.style.transform = 'translateY(8px)';
    el.style.filter = 'blur(3px)';
    setTimeout(()=>{
      i = (i+1) % items.length;
      el.textContent = items[i];
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
      el.style.filter = 'blur(0)';
    }, 550);
  }, 3800);
}

function initGlitchHover() {
  const el = document.getElementById('glitchWord');
  if (!el) return;
  const original = el.textContent;
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ#$%&*';
  let animating = false;
  el.addEventListener('mouseenter', ()=>{
    if (animating) return;
    animating = true;
    let iterations = 0;
    const interval = setInterval(()=>{
      el.textContent = original.split('').map((ch,idx)=>{
        if (ch === ' ') return ' ';
        if (idx < iterations) return original[idx];
        return chars[Math.floor(Math.random()*chars.length)];
      }).join('');
      iterations += 1;
      if (iterations > original.length){
        clearInterval(interval);
        el.textContent = original;
        animating = false;
      }
    }, 35);
  });
}

function initConfettiBurst() {
  function burst(x, y) {
    const colors = ['#00D9FF', '#7B61FF', '#F59E0B', '#DADADA'];
    for (let i = 0; i < 24; i++) {
      const p = document.createElement('div');
      const size = 5 + Math.random() * 5;
      p.style.cssText = `position:fixed;left:${x}px;top:${y}px;width:${size}px;height:${size}px;background:${colors[i%colors.length]};border-radius:${Math.random()>0.5?'50%':'2px'};pointer-events:none;z-index:9999;`;
      document.body.appendChild(p);
      const angle = Math.random() * Math.PI * 2;
      const dist = 60 + Math.random() * 90;
      const dx = Math.cos(angle) * dist;
      const dy = Math.sin(angle) * dist - 40;
      gsap.to(p, {
        x: dx,
        y: dy,
        opacity: 0,
        rotation: Math.random() * 360,
        duration: 0.9 + Math.random() * 0.4,
        ease: 'power2.out',
        onComplete: () => p.remove()
      });
    }
  }
  document.querySelectorAll('.btn-primary-glow, .btn-glass').forEach(btn => {
    btn.addEventListener('click', (e) => {
      burst(e.clientX, e.clientY);
    });
  });
}

function init3DTilt() {
  const terminal = document.querySelector('.hero-terminal');
  const showcase = document.querySelector('.hero-right');
  if (showcase && terminal) {
    showcase.addEventListener('mousemove', e => {
      const r = showcase.getBoundingClientRect();
      const px = (e.clientX - r.left)/r.width;
      const py = (e.clientY - r.top)/r.height;
      const rx = (py - 0.5) * -16;
      const ry = (px - 0.5) * 16;
      terminal.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(20px)`;
    });
    showcase.addEventListener('mouseleave', () => {
      terminal.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
    });
  }
}

// Global 3D Resume Stack Cycling Trigger
window.switchResume = function(clickedCard) {
  const container = document.querySelector('.resume-stack-container');
  if (!container || clickedCard.classList.contains('sigma')) return;

  const harvard = container.querySelector('.harvard');
  const sigma = container.querySelector('.sigma');
  const classic = container.querySelector('.classic');

  if (clickedCard === harvard) {
    harvard.className = 'resume-card sigma';
    sigma.className = 'resume-card classic';
    classic.className = 'resume-card harvard';
  } else if (clickedCard === classic) {
    classic.className = 'resume-card sigma';
    sigma.className = 'resume-card harvard';
    harvard.className = 'resume-card classic';
  }
};
