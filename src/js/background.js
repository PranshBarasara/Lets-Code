import * as THREE from 'three';

export function initBackground() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const renderer = new THREE.WebGLRenderer({canvas, alpha:true, antialias:true});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, window.innerWidth/window.innerHeight, 0.1, 100);
  camera.position.z = 10;

  function resize(){
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', resize); resize();

  const group = new THREE.Group();
  scene.add(group);

  const geos = [
    new THREE.IcosahedronGeometry(0.42,0),
    new THREE.OctahedronGeometry(0.38,0),
    new THREE.TorusGeometry(0.3,0.09,8,16),
    new THREE.TetrahedronGeometry(0.4,0)
  ];
  const colors = [0x00D9FF, 0x7B61FF, 0xF59E0B, 0xDADADA];
  const docHeight = Math.max(document.body.scrollHeight, 3000);
  const shapes = [];

  for(let i=0;i<26;i++){
    const geo = geos[i % geos.length];
    const mat = new THREE.MeshBasicMaterial({
      color: colors[i % colors.length],
      wireframe: Math.random() > 0.35,
      transparent:true,
      opacity: 0.08 + Math.random()*0.14
    });
    const mesh = new THREE.Mesh(geo, mat);
    const depthSpan = (docHeight/window.innerHeight) * 9;
    mesh.position.set(
      (Math.random()-0.5)*15,
      -Math.random()*depthSpan,
      (Math.random()-0.5)*7 - 3
    );
    mesh.rotation.set(Math.random()*Math.PI, Math.random()*Math.PI, 0);
    mesh.userData = {
      speed: 0.15 + Math.random()*0.25,
      floatAmp: 0.25 + Math.random()*0.35,
      floatOffset: Math.random()*Math.PI*2,
      baseY: mesh.position.y
    };
    group.add(mesh);
    shapes.push(mesh);
  }

  let scrollT = window.scrollY;
  let targetScrollT = window.scrollY;
  window.addEventListener('scroll', ()=>{ targetScrollT = window.scrollY; }, {passive:true});

  const clock = new THREE.Clock();
  function animateField(){
    requestAnimationFrame(animateField);
    const t = clock.getElapsedTime();
    
    scrollT += (targetScrollT - scrollT) * 0.1;
    shapes.forEach(m=>{
      m.rotation.x += 0.0022 * m.userData.speed;
      m.rotation.y += 0.0032 * m.userData.speed;
      
      m.position.y = m.userData.baseY + scrollT*0.0042 + Math.sin(t*m.userData.speed + m.userData.floatOffset)*m.userData.floatAmp;
    });
    renderer.render(scene, camera);
  }
  animateField();
}
