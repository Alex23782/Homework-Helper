let scene, camera, renderer, car, clock, velocity, keys;
let lapTime = 0;

document.addEventListener('keydown', e => keys[e.key.toLowerCase()] = true);
document.addEventListener('keyup', e => keys[e.key.toLowerCase()] = false);

function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xaadfff); // Sky color

  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 10, -20);

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(10, 20, 10);
  scene.add(light);

  // Simple ground for now (could improve this)
  const groundTex = new THREE.TextureLoader().load('https://threejs.org/examples/textures/terrain/grasslight-big.jpg');
  groundTex.wrapS = groundTex.wrapT = THREE.RepeatWrapping;
  groundTex.repeat.set(50, 50);
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(1000, 1000),
    new THREE.MeshStandardMaterial({ map: groundTex })
  );
  ground.rotation.x = -Math.PI / 2;
  scene.add(ground);

  // Track Layout (curvy Formula 1 style)
  const trackCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(20, 0, 20),
    new THREE.Vector3(40, 0, 15),
    new THREE.Vector3(60, 0, 10),
    new THREE.Vector3(80, 0, 25),
    new THREE.Vector3(100, 0, 0),
    new THREE.Vector3(80, 0, -30),
    new THREE.Vector3(60, 0, -20),
    new THREE.Vector3(40, 0, -10),
    new THREE.Vector3(20, 0, -20),
    new THREE.Vector3(0, 0, 0),
  ], true);
  
  const trackGeometry = new THREE.TubeGeometry(trackCurve, 100, 2, 8, true);
  const trackMaterial = new THREE.MeshStandardMaterial({ color: 0x444444 });
  const track = new THREE.Mesh(trackGeometry, trackMaterial);
  track.rotation.x = Math.PI / 2;
  scene.add(track);

  // Car (black color)
  const carBody = new THREE.Mesh(
    new THREE.BoxGeometry(2, 0.5, 4),
    new THREE.MeshStandardMaterial({ color: 0x000000 })
  );
  carBody.position.set(-5, 0.25, 0);
  car = carBody;
  scene.add(car);

  // Start the clock for the lap timer
  clock = new THREE.Clock();
  keys = {};
  animate();
}

function animate() {
  requestAnimationFrame(animate);

  // Car movement controls (acceleration and steering)
  const accel = keys['w'] ? 0.02 : keys['s'] ? -0.02 : 0;
  const steer = keys['a'] ? 0.05 : keys['d'] ? -0.05 : 0;

  const forward = new THREE.Vector3(Math.sin(car.rotation.y), 0, Math.cos(car.rotation.y));
  velocity = velocity || new THREE.Vector3();
  velocity.addScaledVector(forward, accel);
  velocity.multiplyScalar(0.98);

  if (velocity.length() > 0.01) {
    car.rotation.y += steer;
  }

  car.position.add(velocity);

  // Follow camera behind the car
  const camOffset = new THREE.Vector3(0, 5, -15).applyAxisAngle(new THREE.Vector3(0, 1, 0), car.rotation.y);
  camera.position.copy(car.position).add(camOffset);
  camera.lookAt(car.position);

  // Lap timer (showing the time passed)
  lapTime += clock.getDelta();
  document.getElementById("timer").textContent = lapTime.toFixed(2) + ' s';

  renderer.render(scene, camera);
}

init();
