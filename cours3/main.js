import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'; // Import OrbitControls


// Scène
const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0xffffff, 0.1, 100);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Soft white light with intensity 0.5
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 7.5).normalize();
scene.add(directionalLight);

const floorGeometry = new THREE.PlaneGeometry(20, 20);
const floorMaterial = new THREE.MeshBasicMaterial({ color: 0x555555, side: THREE.DoubleSide });
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = - Math.PI / 2;
scene.add(floor);

// Code pour créer le cube
const geometry = new THREE.BoxGeometry();
const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load('public/textures/ground.png');
const material = new THREE.MeshBasicMaterial({ map: texture });
const cube = new THREE.Mesh(geometry, material);
cube.position.y = 1;
scene.add(cube);

const loader = new GLTFLoader();
let mixer;
loader.load('public/models/behemot/scene.gltf', function (gltf) {
    const model = gltf.scene;

    model.scale.set(3, 3, 3);
    model.position.y = 2;
    scene.add(model);

    mixer = new THREE.AnimationMixer(model);

    //Animations
    gltf.animations.forEach((clip) => {
        mixer.clipAction(clip).play();
    });
}, undefined, function (error) {
    console.error(error);
});

camera.position.z = 5;

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.enableZoom = true;

const rainCount = 10000;
const rainGeometry = new THREE.BufferGeometry();
const rainPositions = new Float32Array(rainCount * 3);
for (let i = 0; i < rainCount; i++) {
    rainPositions[i * 3] = Math.random() * 200 - 100;
    rainPositions[i * 3 + 1] = Math.random() * 200 - 100;
    rainPositions[i * 3 + 2] = Math.random() * 200 - 100;
}
rainGeometry.setAttribute('position', new THREE.BufferAttribute(rainPositions, 3));

const rainMaterial = new THREE.PointsMaterial({
    color: 0xAAAAFF,
    size: 0.1,
    transparent: true,
    opacity: 0.5
});
const rain = new THREE.Points(rainGeometry, rainMaterial);
scene.add(rain);


function animate() {
    requestAnimationFrame(animate);
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    const positions = rain.geometry.attributes.position.array;
    for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] -= 0.5; // Move down
        if (positions[i + 1] < -100) {
            positions[i + 1] = 100; // Reset to top
        }
    }
    rain.geometry.attributes.position.needsUpdate = true;

    if (mixer) {
        mixer.update(0.01);
    }

    renderer.render(scene, camera);
}
animate();

if (window.DeviceOrientationEvent) {
    window.addEventListener('deviceorientation', function (event) {
        cube.rotation.x = event.beta * (Math.PI / 180);
        cube.rotation.y = event.gamma * (Math.PI / 180);
    }, true);
}
