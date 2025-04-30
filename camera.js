// Camera module for the racing game

/**
 * Sets up a split-screen view with cameras following both cars
 * @param {BABYLON.Scene} scene - The Babylon.js scene
 * @param {BABYLON.Mesh} redCar - The red car mesh
 * @param {BABYLON.Mesh} blueCar - The blue car mesh
 * @returns {Object} Object containing both cameras
 */
export function setupSplitScreenCameras(scene, redCar, blueCar) {
    // Create a camera that follows the red car
    const redCamera = new BABYLON.FollowCamera('redFollowCam', new BABYLON.Vector3(0, 8, 15), scene);
    
    // Configure camera for better game experience
    redCamera.heightOffset = 5;      // Higher position for better track overview
    redCamera.radius = 15;           // Distance from target
    redCamera.rotationOffset = 180;  // Camera facing the opposite direction (looking at the back of the car)
    redCamera.cameraAcceleration = 0.1; // Smoother camera movement
    redCamera.maxCameraSpeed = 20;    // Faster camera for high-speed sections
    
    // Attach camera to red car
    redCamera.lockedTarget = redCar;
    
    // Create viewport for red car (left half of the screen)
    redCamera.viewport = new BABYLON.Viewport(0, 0, 0.5, 1);
    
    // Create a camera that follows the blue car
    const blueCamera = new BABYLON.FollowCamera('blueFollowCam', new BABYLON.Vector3(0, 8, 15), scene);
    
    // Configure camera for better game experience (same settings as red camera)
    blueCamera.heightOffset = 5;
    blueCamera.radius = 15;
    blueCamera.rotationOffset = 180;
    blueCamera.cameraAcceleration = 0.1;
    blueCamera.maxCameraSpeed = 20;
    
    // Attach camera to blue car
    blueCamera.lockedTarget = blueCar;
    
    // Create viewport for blue car (right half of the screen)
    blueCamera.viewport = new BABYLON.Viewport(0.5, 0, 0.5, 1);
    
    // Add mini-map camera for overhead view
    const miniMapCamera = new BABYLON.ArcRotateCamera("miniMapCam", 0, 0, 300, new BABYLON.Vector3(0, 0, 0), scene);
    miniMapCamera.setPosition(new BABYLON.Vector3(0, 300, 0)); // High above
    miniMapCamera.alpha = 0; // Looking straight down
    miniMapCamera.beta = 0;
    
    // Configure minimap to show both cars
    scene.registerBeforeRender(() => {
        // Find center point between both cars for minimap
        const centerX = (redCar.position.x + blueCar.position.x) / 2;
        const centerZ = (redCar.position.z + blueCar.position.z) / 2;
        miniMapCamera.target = new BABYLON.Vector3(centerX, 0, centerZ);
    });
    
    // Create minimap picture-in-picture
    miniMapCamera.viewport = new BABYLON.Viewport(0.75, 0.75, 0.2, 0.2); // Small viewport in the corner
    
    // Set active cameras
    scene.activeCameras = [redCamera, blueCamera, miniMapCamera];
    
    // Create car indicators for minimap
    const redMapIndicator = BABYLON.MeshBuilder.CreateCylinder("redMapIndicator", {
        height: 10, 
        diameter: 5
    }, scene);
    redMapIndicator.material = new BABYLON.StandardMaterial("redIndicatorMat", scene);
    redMapIndicator.material.diffuseColor = new BABYLON.Color3(1, 0, 0); // Bright red
    redMapIndicator.material.emissiveColor = new BABYLON.Color3(1, 0, 0); // Make it glow
    
    const blueMapIndicator = BABYLON.MeshBuilder.CreateCylinder("blueMapIndicator", {
        height: 10, 
        diameter: 5
    }, scene);
    blueMapIndicator.material = new BABYLON.StandardMaterial("blueIndicatorMat", scene);
    blueMapIndicator.material.diffuseColor = new BABYLON.Color3(0, 0.5, 1); // Blue
    blueMapIndicator.material.emissiveColor = new BABYLON.Color3(0, 0.5, 1); // Make it glow
    
    // Make the indicators follow the cars' positions
    scene.registerBeforeRender(() => {
        // Red car indicator
        redMapIndicator.position.x = redCar.position.x;
        redMapIndicator.position.z = redCar.position.z;
        redMapIndicator.position.y = 150; // Keep it high up to be visible in minimap
        redMapIndicator.rotation.y = redCar.rotation.y;
        
        // Blue car indicator
        blueMapIndicator.position.x = blueCar.position.x;
        blueMapIndicator.position.z = blueCar.position.z;
        blueMapIndicator.position.y = 150; // Keep it high up to be visible in minimap
        blueMapIndicator.rotation.y = blueCar.rotation.y;
    });
    
    return {
        redCamera,
        blueCamera,
        miniMapCamera
    };
}

/**
 * Sets up the follow camera that tracks the car (single car mode)
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