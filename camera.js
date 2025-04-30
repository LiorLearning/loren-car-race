// Camera module for the racing game

/**
 * Sets up the follow camera that tracks the car
 * @param {BABYLON.Scene} scene - The Babylon.js scene
 * @param {BABYLON.Mesh} targetMesh - The mesh to follow (car)
 * @returns {BABYLON.FollowCamera} The created camera
 */
export function setupCamera(scene, targetMesh) {
    // Create a camera that follows the car
    const camera = new BABYLON.FollowCamera('followCam', new BABYLON.Vector3(0, 8, 15), scene);
    
    // Configure camera for better game experience
    camera.heightOffset = 5;      // Higher position for better track overview
    camera.radius = 15;           // Distance from target
    camera.rotationOffset = 180;  // Camera facing the opposite direction (looking at the back of the car)
    camera.cameraAcceleration = 0.1; // Smoother camera movement
    camera.maxCameraSpeed = 20;    // Faster camera for high-speed sections
    
    // Attach camera to car
    camera.lockedTarget = targetMesh;
    
    // Set as active camera
    scene.activeCamera = camera;
    
    // Add mini-map camera for overhead view
    const miniMapCamera = new BABYLON.ArcRotateCamera("miniMapCam", 0, 0, 300, targetMesh.position, scene);
    miniMapCamera.setPosition(new BABYLON.Vector3(0, 300, 0)); // High above
    miniMapCamera.alpha = 0; // Looking straight down
    miniMapCamera.beta = 0;
    
    // Configure minimap to follow the car dynamically
    scene.registerBeforeRender(() => {
        // Update minimap camera to follow car
        miniMapCamera.target = targetMesh.position.clone();
    });
    
    // Create minimap picture-in-picture
    scene.activeCameras = [camera, miniMapCamera];
    miniMapCamera.viewport = new BABYLON.Viewport(0.75, 0.75, 0.2, 0.2); // Small viewport in the corner
    camera.viewport = new BABYLON.Viewport(0, 0, 1, 1);
    
    // Create car indicator for minimap
    const mapIndicator = BABYLON.MeshBuilder.CreateCylinder("mapIndicator", {
        height: 10, 
        diameter: 5
    }, scene);
    mapIndicator.material = new BABYLON.StandardMaterial("indicatorMat", scene);
    mapIndicator.material.diffuseColor = new BABYLON.Color3(1, 0, 0); // Bright red
    mapIndicator.material.emissiveColor = new BABYLON.Color3(1, 0, 0); // Make it glow
    
    // Make the indicator follow the car's position but stay high up for the minimap
    scene.registerBeforeRender(() => {
        mapIndicator.position.x = targetMesh.position.x;
        mapIndicator.position.z = targetMesh.position.z;
        mapIndicator.position.y = 150; // Keep it high up to be visible in minimap
        
        // Rotate the indicator to match the car's rotation
        mapIndicator.rotation.y = targetMesh.rotation.y;
    });
    
    return camera;
} 