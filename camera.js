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
    
    // Set active cameras
    scene.activeCameras = [redCamera, blueCamera];
    
    return {
        redCamera,
        blueCamera
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
    
    return camera;
} 