// Create Babylon.js engine
const canvas = document.getElementById("canvas-container");
const engine = new BABYLON.Engine(canvas, true);

// Create scene
const scene = new BABYLON.Scene(engine);

// Create camera
const camera = new BABYLON.ArcRotateCamera("camera", 0, 0, 0, new BABYLON.Vector3(0, 0, 0), scene);
camera.setPosition(new BABYLON.Vector3(0, 0, -5));
camera.attachControl(canvas, true);

// Load model with MTL file
BABYLON.SceneLoader.ImportMesh("", "./model/", "1.obj", scene, function (meshes) {
    // Set materials
    const materialPath = "./model/";
    const materialFileName = "1.mtl";

    BABYLON.SceneLoader.ImportMesh("", materialPath, materialFileName, scene, function (materialMeshes) {
        // Apply materials to meshes
        for (let i = 0; i < meshes.length; i++) {
            const mesh = meshes[i];
            const materialMesh = materialMeshes[i];

            mesh.material = materialMesh.material;
        }
    });

    // Scale and position model
    const model = meshes[0];
    model.scaling = new BABYLON.Vector3(0.1, 0.1, 0.1);
    model.position = new BABYLON.Vector3(0, 0, 0);
});

// Render loop
engine.runRenderLoop(function () {
    scene.render();
});

// Resize event
window.addEventListener("resize", function () {
    engine.resize();
});
