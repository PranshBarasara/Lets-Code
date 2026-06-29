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

    // Random fluctuation to feel alive
    setInterval(() => {
      const fluctuation = 85 + Math.floor(Math.random() * 8);
      setProgress(fluctuation);
    }, 5000);
  }

  // 2. Animated GitHub commit line charts (SVG path shifting)
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

    // Animate points periodically
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

      // Animation lifecycle
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

    // Trigger toast alerts periodically
    setInterval(createLiveToast, 6000);
  }
}
