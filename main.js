let scene, camera, renderer, car, clock;
let velocity = new THREE.Vector3();
const keys = {};
let skidMarks = [], smokeParticles = [];
let startTime = null;
let lapTime = 0;

document.addEventListener('keydown', e => keys[e.key.toLowerCase()] = true);
document.addEventListener('keyup', e => keys[e.key.toLowerCase()] = false);

function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xaadfff); // Sky color

  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(10, 20, 10);
  scene.add(light);

  // Ground (grass)
  const groundTex = new THREE.TextureLoader().load('https://threejs.org/examples/textures/terrain/grasslight-big.jpg');
  groundTex.wrapS = groundTex.wrapT = THREE.RepeatWrapping;
  groundTex.repeat.set(50, 50);
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(1000, 1000),
    new THREE.MeshStandardMaterial({ map: groundTex })
  );
  ground.rotation.x = -Math.PI / 2;
  scene.add(ground);

  // Formula 1 Track Layout (custom path)
  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(10, 0, 20),
    new THREE.Vector3(20, 0, 15),
    new THREE.Vector3(40, 0, 10),
    new THREE.Vector3(60, 0, 25),
    new THREE.Vector3(80, 0, 0),
    new THREE.Vector3(70, 0, -20),
    new THREE.Vector3(50, 0, -25),
    new THREE.Vector3(30, 0, -10),
    new THREE.Vector3(0, 0, 0),
  ], true);

  const geometry = new THREE.TubeGeometry(curve, 100, 2, 8, true);
  const trackMaterial = new THREE.MeshStandardMaterial({ color: 0x444444 });
  const track = new THREE.Mesh(geometry, trackMaterial);
  track.rotation.x = Math.PI / 2;
  scene.add(track);

  // Pit Stop (non-functional, just for appearance)
  const pitStop = new THREE.Mesh(
    new THREE.BoxGeometry(10, 0.2, 5),
    new THREE.MeshStandardMaterial({ color: 0x333333 })
  );
  pitStop.position.set(75, 0.11, 0);
  scene.add(pitStop);

  // Finish Line
  const finishLine = new THREE.Mesh(
    new THREE.PlaneGeometry(4, 10),
    new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide })
  );
  finishLine.rotation.x = -Math.PI / 2;
  finishLine.position.set(65, 0.12, 0);
  scene.add(finishLine);

  // Curbs (to make the track look like an F1 race)
  const curbMaterial = new THREE.MeshBasicMaterial({ color: 0xFF0000 });
  const curb = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 8),
    curbMaterial
  );
  curb.rotation.x = -Math.PI / 2;
  curb.position.set(20, 0.12, 0);
  scene.add(curb);

  // Car (black color)
  const carBody = new THREE.Mesh(
    new THREE.BoxGeometry(2, 0.5, 4),
    new THREE.MeshStandardMaterial({ color: 0x000000 })
  );
  carBody.position.set(-5, 0.25, 0);
  car = carBody;
  scene.add(car);

  // Camera Position
  camera.position.set(0, 5, -10);

  clock = new THREE.Clock();
  startTime = performance.now();

  animate();
}

function animate() {
  requestAnimationFrame(animate);

  // Car movement controls (acceleration and steering)
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

  // Lap timer (showing the time passed)
  lapTime = (performance.now() - startTime) / 1000;
  document.getElementById("timer").textContent = lapTime.toFixed(2) + ' s';

  // Finish Line Check
  if (car.position.z > 60 && car.position.z < 65) {
    console.log("You crossed the finish line!");
  }

  renderer.render(scene, camera);
}

init();
