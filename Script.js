// Initialize scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('gameContainer').appendChild(renderer.domElement);

// Create a simple ground (plane)
const groundGeo = new THREE.PlaneGeometry(100, 100);
const groundMat = new THREE.MeshBasicMaterial({ color: 0x555555 });
const ground = new THREE.Mesh(groundGeo, groundMat);
ground.rotation.x = -Math.PI / 2;
ground.position.y = -0.5;
scene.add(ground);

// Create a simple red car (box geometry)
const carGeo = new THREE.BoxGeometry(1, 0.5, 2);
const carMat = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const car = new THREE.Mesh(carGeo, carMat);
car.position.y = 0.25;
scene.add(car);

// Camera positioned behind the car
camera.position.set(0, 2, -5);
camera.lookAt(car.position);

// Input handling for car movement
const keys = {};
window.addEventListener('keydown', e => keys[e.key.toLowerCase()] = true);
window.addEventListener('keyup', e => keys[e.key.toLowerCase()] = false);

// Variables for car's speed and rotation
let speed = 0;
let turn = 0;

// Game loop
function animate() {
  requestAnimationFrame(animate);

  // Car movement controls
  if (keys['w']) speed += 0.02;
  if (keys['s']) speed -= 0.02;
  if (keys['a']) turn += 0.03;
  if (keys['d']) turn -= 0.03;

  // Apply rotation and move the car
  car.rotation.y += turn * speed;
  const dx = Math.sin(car.rotation.y) * speed;
  const dz = Math.cos(car.rotation.y) * speed;
  car.position.x += dx;
  car.position.z += dz;

  // Apply friction
  speed *= 0.98;
  turn *= 0.9;

  // Camera follows the car from behind
  const followDistance = 5;
  const heightOffset = 2;
  const forward = new THREE.Vector3(0, 0, 1);
  forward.applyQuaternion(car.rotation);
  camera.position.copy(car.position).sub(forward.multiplyScalar(followDistance));
  camera.position.y += heightOffset;
  camera.lookAt(car.position);

  // Render the scene
  renderer.render(scene, camera);
}

// Start the animation loop
animate();
