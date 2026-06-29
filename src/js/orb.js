import * as THREE from 'three';

export function initHeroOrb() {
  const canvas = document.getElementById('orb-canvas');
  if (!canvas) return;
  const renderer = new THREE.WebGLRenderer({canvas, alpha:true, antialias:true});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.set(0,0,6.0);

  function resize(){
    const parent = canvas.parentElement;
    if (!parent) return;
    const w = parent.clientWidth, h = parent.clientHeight;
    renderer.setSize(w,h,false);
    camera.aspect = w/h; camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', resize); resize();

  const noiseGLSL = `
  vec3 mod289(vec3 x){return x - floor(x*(1.0/289.0))*289.0;}
  vec4 mod289(vec4 x){return x - floor(x*(1.0/289.0))*289.0;}
  vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
  vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314*r;}
  float snoise(vec3 v){
    const vec2 C = vec2(1.0/6.0,1.0/3.0); const vec4 D = vec4(0.0,0.5,1.0,2.0);
    vec3 i = floor(v + dot(v,C.yyy)); vec3 x0 = v - i + dot(i,C.xxx);
    vec3 g = step(x0.yzx, x0.xyz); vec3 l = 1.0 - g; vec3 i1 = min(g.xyz,l.zxy); vec3 i2 = max(g.xyz,l.zxy);
    vec3 x1 = x0 - i1 + C.xxx; vec3 x2 = x0 - i2 + C.yyy; vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
    float n_ = 0.142857142857; vec3 ns = n_*D.wyz - D.xzx;
    vec4 j = p - 49.0*floor(p*ns.z*ns.z);
    vec4 x_ = floor(j*ns.z); vec4 y_ = floor(j - 7.0*x_);
    vec4 x = x_*ns.x + ns.yyyy; vec4 y = y_*ns.x + ns.yyyy; vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy,y.xy); vec4 b1 = vec4(x.zw,y.zw);
    vec4 s0 = floor(b0)*2.0+1.0; vec4 s1 = floor(b1)*2.0+1.0; vec4 sh = -step(h,vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy; vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
    vec3 p0 = vec3(a0.xy,h.x); vec3 p1 = vec3(a0.zw,h.y); vec3 p2 = vec3(a1.xy,h.z); vec3 p3 = vec3(a1.zw,h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0); m = m*m;
    return 42.0*dot(m*m, vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
  }`;

  const uniforms = {
    uTime:{value:0},
    uMouse:{value:new THREE.Vector2(0,0)},
    uPulse:{value:new THREE.Color(0x00D9FF)},
    uDrift:{value:new THREE.Color(0x7B61FF)},
    uSignal:{value:new THREE.Color(0xF59E0B)},
  };

  const geo = new THREE.IcosahedronGeometry(1.6, 54);
  const mat = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: noiseGLSL + `
      uniform float uTime; uniform vec2 uMouse;
      varying vec3 vNormal; varying vec3 vPos; varying float vNoise;
      void main(){
        float n = snoise(normal*1.6 + uTime*0.22) * 0.24;
        float touch = snoise(normal*2.5 + vec3(uMouse*2.0, uTime*0.4)) * 0.20 * (1.0 - distance(normal.xy, uMouse));
        vec3 displaced = position + normal * (n + touch);
        vNormal = normalize(normalMatrix * normal);
        vPos = (modelViewMatrix * vec4(displaced,1.0)).xyz;
        vNoise = n;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced,1.0);
      }`,
    fragmentShader: `
      uniform vec3 uPulse; uniform vec3 uDrift; uniform vec3 uSignal;
      varying vec3 vNormal; varying vec3 vPos; varying float vNoise;
      void main(){
        vec3 viewDir = normalize(-vPos);
        float fresnel = pow(1.0 - max(dot(viewDir, vNormal),0.0), 2.2);
        vec3 base = mix(uPulse, uDrift, smoothstep(-0.2,0.2, vNoise*3.0));
        base = mix(base, uSignal, fresnel*0.35);
        float rim = pow(fresnel, 1.5);
        vec3 col = base * 0.55 + rim * 1.1;
        gl_FragColor = vec4(col, 0.85);
      }`,
    transparent:true,
  });
  const orb = new THREE.Mesh(geo, mat);
  scene.add(orb);

  const wire = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.72, 1),
    new THREE.MeshBasicMaterial({color:0x9fb3c8, wireframe:true, transparent:true, opacity:0.06})
  );
  scene.add(wire);

  const satellitesGroup = new THREE.Group();
  scene.add(satellitesGroup);

  const ringGeo1 = new THREE.TorusGeometry(2.4, 0.015, 8, 64);
  const ringMat1 = new THREE.MeshBasicMaterial({color: 0x00D9FF, transparent: true, opacity: 0.2});
  const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
  ring1.rotation.x = Math.PI / 2.2;
  satellitesGroup.add(ring1);

  const ringGeo2 = new THREE.TorusGeometry(2.8, 0.01, 8, 64);
  const ringMat2 = new THREE.MeshBasicMaterial({color: 0x7B61FF, transparent: true, opacity: 0.15});
  const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
  ring2.rotation.x = Math.PI / -2.4;
  ring2.rotation.y = Math.PI / 6;
  satellitesGroup.add(ring2);

  const nodeGeo = new THREE.OctahedronGeometry(0.12, 0);
  const node1 = new THREE.Mesh(nodeGeo, new THREE.MeshBasicMaterial({color: 0xF59E0B, wireframe: true}));
  satellitesGroup.add(node1);

  const node2 = new THREE.Mesh(nodeGeo, new THREE.MeshBasicMaterial({color: 0x00D9FF, wireframe: true}));
  satellitesGroup.add(node2);

  let mouseX=0, mouseY=0, targetX=0, targetY=0;
  window.addEventListener('mousemove', e=>{
    mouseX = (e.clientX/window.innerWidth)*2 - 1;
    mouseY = (e.clientY/window.innerHeight)*2 - 1;
  });

  const clock = new THREE.Clock();
  function animate(){
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();
    targetX += (mouseX - targetX)*0.04;
    targetY += (mouseY - targetY)*0.04;
    
    uniforms.uTime.value = t;
    uniforms.uMouse.value.set(targetX*0.5+0.5, targetY*0.5+0.5);
    
    orb.rotation.y = t*0.14 + targetX*0.25;
    orb.rotation.x = t*0.08 + targetY*0.15;
    wire.rotation.copy(orb.rotation);
    
    satellitesGroup.rotation.y = t * 0.2;
    satellitesGroup.rotation.z = Math.sin(t * 0.1) * 0.2;
    
    node1.position.set(Math.cos(t * 1.5) * 2.4, Math.sin(t * 1.5) * 0.4, Math.sin(t * 1.5) * 2.4);
    node2.position.set(Math.sin(t * 1.2) * -2.8, Math.cos(t * 1.2) * 0.3, Math.cos(t * 1.2) * 2.8);
    node1.rotation.y = t * 2;
    node2.rotation.x = t * 2;

    orb.position.x = targetX*0.25; orb.position.y = -targetY*0.18;
    wire.position.copy(orb.position);
    satellitesGroup.position.copy(orb.position);
    
    renderer.render(scene, camera);
  }
  animate();
}
