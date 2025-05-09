
let engineSound, skidSound, soundsReady = false;

document.getElementById('startBtn').addEventListener('click', () => {
  engineSound = new Audio('engine.mp3');
  skidSound = new Audio('skid.mp3');
  engineSound.loop = true;
  engineSound.volume = 0.5;
  skidSound.volume = 0.6;
  engineSound.load();
  skidSound.load();
  engineSound.oncanplaythrough = () => {
    soundsReady = true;
    engineSound.play();
  };
  document.getElementById('startBtn').style.display = 'none';
  init();
});

let scene, camera, renderer, car, velocity;
const keys = {}, skidMarks = [];

function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xaadfff);
  camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
  renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('gameCanvas') });
  renderer.setSize(window.innerWidth, window.innerHeight);

  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(10, 20, 10);
  scene.add(light);

  const grassTexture = new THREE.TextureLoader().load('https://threejs.org/examples/textures/terrain/grasslight-big.jpg');
  grassTexture.wrapS = grassTexture.wrapT = THREE.RepeatWrapping;
  grassTexture.repeat.set(50, 50);
  const grass = new THREE.Mesh(
    new THREE.PlaneGeometry(1000, 1000),
    new THREE.MeshStandardMaterial({ map: grassTexture })
  );
  grass.rotation.x = -Math.PI / 2;
  scene.add(grass);

  const roadTexture = new THREE.TextureLoader().load('https://threejs.org/examples/textures/brick_bump.jpg');
  roadTexture.wrapS = roadTexture.wrapT = THREE.RepeatWrapping;
  roadTexture.repeat.set(5, 1);
  const trackShape = new THREE.Shape();
  trackShape.absarc(0, 0, 100, 0, Math.PI * 2, false);
  const trackGeometry = new THREE.ExtrudeGeometry(trackShape, { depth: 10, bevelEnabled: false });
  const track = new THREE.Mesh(trackGeometry, new THREE.MeshStandardMaterial({ map: roadTexture, color: 0x333333 }));
  track.rotation.x = -Math.PI / 2;
  track.position.y = 0.05;
  scene.add(track);

  car = new THREE.Mesh(
    new THREE.BoxGeometry(1, 0.5, 2),
    new THREE.MeshStandardMaterial({ color: 0xff0000 })
  );
  car.position.set(0, 0.25, 0);
  scene.add(car);

  velocity = new THREE.Vector3();
  document.addEventListener('keydown', e => keys[e.key.toLowerCase()] = true);
  document.addEventListener('keyup', e => keys[e.key.toLowerCase()] = false);

  animate();
}

function addSkidMark(position) {
  const geometry = new THREE.PlaneGeometry(0.2, 0.5);
  const material = new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.DoubleSide, transparent: true, opacity: 0.5 });
  const mark = new THREE.Mesh(geometry, material);
  mark.rotation.x = -Math.PI / 2;
  mark.position.copy(position);
  scene.add(mark);
  skidMarks.push({ mesh: mark, life: 100 });
}

function animate() {
  requestAnimationFrame(animate);
  let accel = 0, steer = 0;
  if (keys['w']) accel = 0.02;
  if (keys['s']) accel = -0.02;
  if (keys['a']) steer = 0.08;
  if (keys['d']) steer = -0.08;

  const forward = new THREE.Vector3(Math.sin(car.rotation.y), 0, Math.cos(car.rotation.y));
  velocity.addScaledVector(forward, accel);
  velocity.multiplyScalar(0.96);

  if (velocity.length() > 0.01) {
    car.rotation.y += steer;
  }

  car.position.add(velocity);

  const camOffset = new THREE.Vector3(0, 5, -10).applyAxisAngle(new THREE.Vector3(0, 1, 0), car.rotation.y);
  camera.position.copy(car.position).add(camOffset);
  camera.lookAt(car.position);

  const drifting = Math.abs(steer) > 0.02 && velocity.length() > 0.05;
  if (drifting && soundsReady && skidSound.paused) {
    skidSound.currentTime = 0;
    skidSound.play();
  } else if (!drifting && soundsReady && !skidSound.paused) {
    skidSound.pause();
  }

  if (drifting) {
    addSkidMark(car.position.clone());
  }

  skidMarks.forEach((mark, index) => {
    mark.life -= 1;
    mark.mesh.material.opacity = mark.life / 100;
    if (mark.life <= 0) {
      scene.remove(mark.mesh);
      skidMarks.splice(index, 1);
    }
  });

  if (soundsReady) engineSound.playbackRate = 0.5 + velocity.length() * 3;
  renderer.render(scene, camera);
}
