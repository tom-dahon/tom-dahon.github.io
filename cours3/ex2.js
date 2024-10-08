 const canvas = document.getElementById("renderCanvas");
    const engine = new BABYLON.Engine(canvas, true);

    const createScene = function() {
    const scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color3(0, 0, 1); // Fond bleu

    const camera = new BABYLON.ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 4, 10, BABYLON.Vector3.Zero(), scene);
    camera.attachControl(canvas, true);

    const ambientLight = new BABYLON.HemisphericLight("HemisphericLight", new BABYLON.Vector3(0, 1, 0), scene);
    ambientLight.intensity = 0.5; // Intensité douce

    const directionalLight = new BABYLON.DirectionalLight("DirectionalLight", new BABYLON.Vector3(0, -1, -1), scene);
    directionalLight.position = new BABYLON.Vector3(5, 10, 7.5);
    directionalLight.intensity = 1;

    // Créer le sol
    const ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 200, height: 200}, scene);

    // Créer un cube
    const cube = BABYLON.MeshBuilder.CreateBox("cube", {size: 1}, scene);
    const cubeMaterial = new BABYLON.StandardMaterial("cubeMaterial", scene);
    cubeMaterial.diffuseTexture = new BABYLON.Texture("public/textures/lava.jpg", scene);
    cube.material = cubeMaterial;
    cube.position.y = 0.5;
    cube.position.x = 2;


        BABYLON.SceneLoader.ImportMeshAsync("", 'public/models/behemot/', "scene.gltf", scene).then(function (result) {
            console.log(result,"result")
            result.meshes[0].position.x = -1;
        })

        BABYLON.SceneLoader.ImportMeshAsync("", 'public/models/wolf/', "scene.gltf", scene).then(function (result) {
            console.log(result,"result")
            result.meshes[0].position.x = 5;
        })

    // Créer une pluie
    const rainParticles = new BABYLON.ParticleSystem("particles", 2000, scene);
    rainParticles.particleTexture = new BABYLON.Texture("public/rain.png", scene);
    rainParticles.emitter = new BABYLON.Vector3(0, 10, 0);
    rainParticles.minEmitBox = new BABYLON.Vector3(-100, 0, -100);
    rainParticles.maxEmitBox = new BABYLON.Vector3(100, 0, 100);
    rainParticles.color1 = new BABYLON.Color4(1, 1, 1, 0.5);
    rainParticles.color2 = new BABYLON.Color4(0.5, 0.5, 0.5, 0.5);
    rainParticles.emitRate = 1000;
    rainParticles.start();

    return scene;
};

    const scene = createScene();

    engine.runRenderLoop(function() {
    scene.render();
});

    window.addEventListener("resize", function() {
    engine.resize(); // Redimensionne le moteur Babylon.js
    canvas.width = window.innerWidth; // Met à jour la largeur du canevas
    canvas.height = window.innerHeight; // Met à jour la hauteur du canevas
});