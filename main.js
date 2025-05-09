let scene, camera, renderer, car, clock;
let velocity = new THREE.Vector3();
const keys = {};
let skidMarks = [], smokeParticles = [];
let startTime = null;

document.addEventListener('keydown', e => keys[e.key.toLowerCase()] = true);
document.addEventListener('keyup', e => keys[e.key.toLowerCase()] = false);

function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xaadfff);

  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(10, 20, 10);
  scene.add(light);

  // Grass ground
  const groundTex = new THREE.TextureLoader().load('https://threejs.org/examples/textures/terrain/grasslight-big.jpg');
  groundTex.wrapS = groundTex.wrapT = THREE.RepeatWrapping;
  groundTex.repeat.set(50, 50);
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(1000, 1000),
    new THREE.MeshStandardMaterial({ map: groundTex })
  );
  ground.rotation.x = -Math.PI / 2;
  scene.add(ground);

  // Drift track (oval loop)
  const trackShape = new THREE.CurvePath();
  const radius = 60;
  trackShape.add(new THREE.CatmullRomCurve3([
    new THREE.Vector3(-radius, 0, -radius),
    new THREE.Vector3( radius, 0, -radius),
    new THREE.Vector3( radius, 0,  radius),
    new THREE.Vector3(-radius, 0,  radius),
    new THREE.Vector3(-radius, 0, -radius)
  ], true));
  const tube = new THREE.TubeGeometry(trackShape, 100, 4, 8, true);
  const track = new THREE.Mesh(tube, new THREE.MeshStandardMaterial({ color: 0x444444 }));
  track.rotation.x = Math.PI / 2;
  scene.add(track);

  // Pit Stop
  const pit = new THREE.Mesh(
    new THREE.BoxGeometry(10, 0.2, 5),
    new THREE.MeshStandardMaterial({ color: 0x333333 })
  );
  pit.position.set(-65, 0.11, 0);
  scene.add(pit);

  // Finish line
  const finish = new THREE.Mesh(
    new THREE.PlaneGeometry(4, 10),
    new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide })
  );
  finish.rotation.x = -Math.PI / 2;
  finish.position.set(-60, 0.12, 0);
  scene.add(finish);

  // Car
  const carBody = new THREE.Mesh(
    new THREE.BoxGeometry(1, 0.5, 2),
    new THREE.MeshStandardMaterial({ color: 0x000000 })
  );
  carBody.position.set(-60, 0.25, 0);
  car = carBody;
  scene.add(car);

  camera.position.set(0, 5, -10);
  clock = new THREE.Clock();
  startTime = performance.now();

  animate();
}

function animate() {
  requestAnimationFrame(animate);

  const accel = keys['w'] ? 0.02 : keys['s'] ? -0.02 : 0;
  const steer = keys['a'] ? 0.05 : keys['d'] ? -0.05 : 0;

  const forward = new THREE.Vector3(Math.sin(car.rotation.y), 0, Math.cos(car.rotation.y));
  velocity.addScaledVector(forward, accel);
  velocity.multiplyScalar(0.96);

  if (velocity.length() > 0.01) {
    car.rotation.y += steer;
  }

  car.position.add(velocity);

  // Follow camera
  const camOffset = new THREE.Vector3(0, 5, -10).applyAxisAngle(new THREE.Vector3(0, 1, 0), car.rotation.y);
  camera.position.copy(car.position).add(camOffset);
  camera.lookAt(car.position);

  // Lap timer
  const timer = ((performance.now() - startTime) / 1000).toFixed(2);
  document.getElementById("timer").textContent = timer;

  renderer.render(scene, camera);
}

init();
