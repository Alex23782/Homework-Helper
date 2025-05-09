let scene, camera, renderer, car, clock;
let velocity = new THREE.Vector3();
const keys = {};
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

  // Grass ground (simple for now)
  const groundTex = new THREE.TextureLoader().load('https://threejs.org/examples/textures/terrain/grasslight-big.jpg');
  groundTex.wrapS = groundTex.wrapT = THREE.RepeatWrapping;
  groundTex.repeat.set(50, 50);
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(1000, 1000),
    new THREE.MeshStandardMaterial({ map: groundTex })
  );
  ground.rotation.x = -Math.PI / 2;
  scene.add(ground);

  // Formula 1 Track Layout (simplified)
  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(30, 0, 10),
    new THREE.Vector3(60, 0, 0),
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
  pitStop.position.set(50, 0.11, 0);
  scene.add(pitStop);

  // Finish Line
  const finishLine = new THREE.Mesh(
    new THREE.PlaneGeometry(4, 10),
    new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide })
  );
  finishLine.rotation.x = -Math.PI / 2;
  finishLine.position.set(55, 0.12, 0);
  scene.add(finishLine);

  // Car (black color)
  const carBody = new THREE.Mesh(
    new THREE.BoxGeometry(2, 0.5, 4),
    new THREE.MeshStandardMaterial({ color: 0x000
