// 1. Setup the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 2. Create the car (simple box shape for now)
const carGeometry = new THREE.BoxGeometry(1, 0.5, 2);
const carMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const car = new THREE.Mesh(carGeometry, carMaterial);
scene.add(car);

// 3. Create the ground (a simple plane)
const groundGeometry = new THREE.PlaneGeometry(100, 100);
const groundMaterial = new THREE.MeshBasicMaterial({ color: 0x808080, side: THREE.DoubleSide });
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = Math.PI / -2; // Rotate the ground to be flat
scene.add(ground);

// 4. Set up camera position
camera.position.z = 5;
camera.position.y = 2;

// 5. Handle basic controls
let carSpeed = 0;
let carRotation = 0;

function handleInput() {
    // Simple WASD controls for moving the car
    if (keyState['w']) carSpeed += 0.05; // Accelerate
    if (keyState['s']) carSpeed -= 0.05; // Reverse
    if (keyState['a']) carRotation += 0.05; // Turn left
    if (keyState['d']) carRotation -= 0.05; // Turn right

    // Apply basic physics (sliding effect for drift)
    car.rotation.y += carRotation;
    car.position.x += Math.sin(car.rotation.y) * carSpeed;
    car.position.z += Math.cos(car.rotation.y) * carSpeed;

    // Simple friction to slow down car
    carSpeed *= 0.99; // Friction effect
}

// 6. Handle keyboard input state
let keyState = {};
window.addEventListener('keydown', (event) => { keyState[event.key] = true; });
window.addEventListener('keyup', (event) => { keyState[event.key] = false; });

// 7. Animate the scene
function animate() {
    requestAnimationFrame(animate);
    handleInput(); // Update car position based on input
    renderer.render(scene, camera);
}

animate();

// 8. Resize handling
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
