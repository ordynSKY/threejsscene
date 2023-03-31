const geometrySelect = document.getElementById("geometry");
const sizeInput = document.getElementById("size");
const createButton = document.getElementById("create");
const shapesDiv = document.getElementById("shapes");

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x747880);
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.z = 5;
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const light = new THREE.PointLight(0xffffff, 1, 100);
light.position.set(0, 0, 5);
scene.add(light);

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.screenSpacePanning = false;
controls.minDistance = 1;
controls.maxDistance = 100;
controls.maxPolarAngle = Math.PI / 2;

const shapes = [];

function createShape() {
    const geometryType = geometrySelect.value;
    const size = parseFloat(sizeInput.value / 1.5);
    console.log(size);

    let geometry;
    switch (geometryType) {
        case "Cube":
            geometry = new THREE.BoxGeometry(size, size, size);
            break;
        case "Sphere":
            geometry = new THREE.SphereGeometry(size, 32, 32);
            break;
        case "Pyramid":
            geometry = new THREE.ConeGeometry(size, size, 4);
            break;
        default:
            console.error("Unknown geometry type:", geometryType);
            return;
    }
    const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const mesh = new THREE.Mesh(geometry, material);

    mesh.scale.set(size, size, size);
    mesh.position.set(
        Math.random() * 10 - 5,
        Math.random() * 10 - 5,
        Math.random() * 10 - 5
    );
    scene.add(mesh);
    shapes.push(mesh);

    const shapeDiv = document.createElement("div");
    shapeDiv.classList.add("shape");
    const uuidSpan = document.createElement("span");
    uuidSpan.classList.add("shape-uuid");
    uuidSpan.textContent = mesh.uuid;
    shapeDiv.appendChild(uuidSpan);
    const removeButton = document.createElement("button");
    removeButton.classList.add("remove-shape");
    removeButton.textContent = "X";
    removeButton.addEventListener("click", () => {
        removeShape(mesh.uuid);
    });
    shapeDiv.appendChild(removeButton);
    shapesDiv.appendChild(shapeDiv);
}

function limitInput() {
    if (sizeInput.value > 5) {
        sizeInput.value = 5;
    }
}

function removeShape(uuid) {
    const index = shapes.findIndex((mesh) => mesh.uuid === uuid);
    if (index === -1) {
        console.error("Shape not found:", uuid);
        return;
    }
    const mesh = shapes[index];

    scene.remove(mesh);
    shapes.splice(index, 1);

    const shapeDiv = shapesDiv.querySelector(`.shape-uuid`).parentElement;
    shapesDiv.removeChild(shapeDiv);
}

createButton.addEventListener("click", createShape);

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}
animate();
