const canvas = document.getElementById('renderCanvas');
const engine = new BABYLON.Engine(canvas, true);

const createScene = function () {
    const scene = new BABYLON.Scene(engine);

    const camera = new BABYLON.ArcRotateCamera("camera", Math.PI / 2, Math.PI / 2, 10, BABYLON.Vector3.Zero(), scene);
    camera.attachControl(canvas, true);

    const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1, 1, 0), scene);

    const sphere = BABYLON.MeshBuilder.CreateSphere("sphere", { diameter: 10 }, scene);
    sphere.position.y = 0;

    const materialSphere = new BABYLON.StandardMaterial("earthMaterial", scene);
    materialSphere.diffuseTexture = new BABYLON.Texture("textures/earth.jpg", scene);
    materialSphere.diffuseTexture.vScale = -1;
    materialSphere.diffuseTexture.uScale = -1;
    sphere.material = materialSphere;

    return { scene, camera };
};

const { scene, camera } = createScene();

function update3DView(latitude, longitude) {
    const latRad = BABYLON.Tools.ToRadians(latitude);
    const lonRad = -BABYLON.Tools.ToRadians(longitude) + Math.PI;

    const earthRadius = 5;
    const cameraDistance = 10;

    const x = cameraDistance * Math.cos(latRad) * Math.sin(lonRad);
    const y = cameraDistance * Math.sin(latRad);
    const z = cameraDistance * Math.cos(latRad) * Math.cos(lonRad);

    const targetPosition = new BABYLON.Vector3(z, y, -x);

    if (camera.animations.length > 0) {
        scene.stopAnimation(camera);
        camera.animations = [];
    }

    const cameraAnimation = new BABYLON.Animation('cameraAnimation', 'position', 15, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
    const keys = [];
    keys.push({ frame: 0, value: camera.position });
    keys.push({ frame: 100, value: targetPosition });

    cameraAnimation.setKeys(keys);
    camera.animations.push(cameraAnimation);

    scene.beginAnimation(camera, 0, 100, false, 1, () => {
        camera.setTarget(BABYLON.Vector3.Zero());
    });
}

function addTriangleAtPosition(latitude, longitude, flag) {
    const latRad = BABYLON.Tools.ToRadians(latitude);
    const lonRad = -BABYLON.Tools.ToRadians(longitude) + Math.PI;

    const earthRadius = 5;
    const x = earthRadius * Math.cos(latRad) * Math.sin(lonRad);
    const y = earthRadius * Math.sin(latRad);
    const z = earthRadius * Math.cos(latRad) * Math.cos(lonRad);

    const triangleSize = 0.2;
    const triangle = BABYLON.MeshBuilder.CreateDisc("triangle", { radius: triangleSize, tessellation: 3 }, scene);
    triangle.position = new BABYLON.Vector3(z, y, -x);

    const materialPoint = new BABYLON.StandardMaterial("pointMaterial", scene);
    materialPoint.diffuseTexture = new BABYLON.Texture(flag, scene);
    triangle.material = materialPoint;

    triangle.lookAt(BABYLON.Vector3.Zero());

    triangle.actionManager = new BABYLON.ActionManager(scene);
    triangle.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, function() {
        update3DView(latitude, longitude);
    }));
}

// Récupération des données des pays
fetch('https://restcountries.com/v3.1/all')
    .then(response => response.json())
    .then(data => {
        data.forEach(country => {
            if (country.latlng) {
                const flag = country.flags.png;
                const latitude = country.latlng[0];
                const longitude = country.latlng[1];
                addTriangleAtPosition(latitude, longitude, flag);
            }
        });
    })
    .catch(error => {
        console.error("Erreur lors de la récupération des données des pays: ", error);
    });

if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
        const userLatitude = position.coords.latitude;
        const userLongitude = position.coords.longitude;
        addTriangleAtPosition(userLatitude, userLongitude, "models/user.png");
    }, function(error) {
        console.error("Erreur de géolocalisation: ", error);
    });
} else {
    console.error("La géolocalisation n'est pas supportée par ce navigateur.");
}

engine.runRenderLoop(function () {
    scene.render();
});
window.addEventListener('resize', function () {
    engine.resize();
});