// Car module for the racing game

/**
 * Creates and configures the car with all its parts
 * @param {BABYLON.Scene} scene - The Babylon.js scene
 * @returns {BABYLON.Mesh} The created car mesh
 */
export function createCar(scene) {
    // Create main car body
    const car = BABYLON.MeshBuilder.CreateBox('car', {width: 2, height: 1, depth: 4}, scene);
    car.position.y = 0.5;
    car.position.x = 0;
    car.position.z = -20;
    
    // Create car material
    const carMaterial = new BABYLON.StandardMaterial('carMat', scene);
    carMaterial.diffuseColor = new BABYLON.Color3(1, 0, 0); // Red
    car.material = carMaterial;

    // Add car front indicator
    addCarFront(car, scene);
    
    // Add wheels to the car
    addWheels(car, scene);
    
    // Set forward direction properly (Z-axis is forward in our case)
    car.frontVector = new BABYLON.Vector3(0, 0, 1);
    
    return car;
}

/**
 * Creates and configures a blue car with all its parts
 * @param {BABYLON.Scene} scene - The Babylon.js scene
 * @returns {BABYLON.Mesh} The created car mesh
 */
export function createBlueCar(scene) {
    // Create main car body
    const car = BABYLON.MeshBuilder.CreateBox('blueCar', {width: 2, height: 1, depth: 4}, scene);
    car.position.y = 0.5;
    car.position.x = 2; // Position slightly to the right of the first car
    car.position.z = -20;
    
    // Create car material
    const carMaterial = new BABYLON.StandardMaterial('blueCarMat', scene);
    carMaterial.diffuseColor = new BABYLON.Color3(0, 0.5, 1); // Blue
    car.material = carMaterial;

    // Add car front indicator
    addBlueCarFront(car, scene);
    
    // Add wheels to the car
    addWheels(car, scene);
    
    // Set forward direction properly (Z-axis is forward in our case)
    car.frontVector = new BABYLON.Vector3(0, 0, 1);
    
    return car;
}

/**
 * Adds the front part of the car
 * @param {BABYLON.Mesh} carMesh - The parent car mesh
 * @param {BABYLON.Scene} scene - The Babylon.js scene
 */
function addCarFront(carMesh, scene) {
    // Create a more prominent front to help player orientation
    const carFront = BABYLON.MeshBuilder.CreateBox('carFront', {width: 1.8, height: 0.5, depth: 0.7}, scene);
    carFront.position.z = 2; // Position further forward to be more visible
    carFront.position.y = 0.5; // Align with car body height
    
    const carFrontMaterial = new BABYLON.StandardMaterial('carFrontMat', scene);
    carFrontMaterial.diffuseColor = new BABYLON.Color3(0.1, 0.1, 0.1); // Dark front
    carFront.material = carFrontMaterial;
    
    // Add a distinctive nose/pointer to clearly indicate forward direction
    const carNose = BABYLON.MeshBuilder.CreateCylinder('carNose', {
        height: 0.6,
        diameter: 0.4,
        diameterTop: 0.1
    }, scene);
    carNose.position.z = 2.5; // Position at the very front
    carNose.position.y = 0.5;
    carNose.rotation.x = Math.PI/2; // Rotate to point forward
    
    const carNoseMaterial = new BABYLON.StandardMaterial('carNoseMat', scene);
    carNoseMaterial.diffuseColor = new BABYLON.Color3(1, 1, 0); // Yellow nose for visibility
    carNose.material = carNoseMaterial;
    
    // Parent to car
    carFront.parent = carMesh;
    carNose.parent = carMesh;
}

/**
 * Adds the front part of the blue car
 * @param {BABYLON.Mesh} carMesh - The parent car mesh
 * @param {BABYLON.Scene} scene - The Babylon.js scene
 */
function addBlueCarFront(carMesh, scene) {
    // Create a more prominent front to help player orientation
    const carFront = BABYLON.MeshBuilder.CreateBox('blueCarFront', {width: 1.8, height: 0.5, depth: 0.7}, scene);
    carFront.position.z = 2; // Position further forward to be more visible
    carFront.position.y = 0.5; // Align with car body height
    
    const carFrontMaterial = new BABYLON.StandardMaterial('blueCarFrontMat', scene);
    carFrontMaterial.diffuseColor = new BABYLON.Color3(0.1, 0.1, 0.1); // Dark front
    carFront.material = carFrontMaterial;
    
    // Add a distinctive nose/pointer to clearly indicate forward direction
    const carNose = BABYLON.MeshBuilder.CreateCylinder('blueCarNose', {
        height: 0.6,
        diameter: 0.4,
        diameterTop: 0.1
    }, scene);
    carNose.position.z = 2.5; // Position at the very front
    carNose.position.y = 0.5;
    carNose.rotation.x = Math.PI/2; // Rotate to point forward
    
    const carNoseMaterial = new BABYLON.StandardMaterial('blueCarNoseMat', scene);
    carNoseMaterial.diffuseColor = new BABYLON.Color3(1, 1, 0); // Yellow nose for visibility
    carNose.material = carNoseMaterial;
    
    // Parent to car
    carFront.parent = carMesh;
    carNose.parent = carMesh;
}

/**
 * Adds wheels to the car
 * @param {BABYLON.Mesh} carMesh - The parent car mesh
 * @param {BABYLON.Scene} scene - The Babylon.js scene
 */
function addWheels(carMesh, scene) {
    // Create wheel material
    const wheelMaterial = new BABYLON.StandardMaterial('wheelMat', scene);
    wheelMaterial.diffuseColor = new BABYLON.Color3(0.1, 0.1, 0.1); // Dark wheels
    
    // Wheel settings
    const wheelOptions = {diameter: 1, thickness: 0.3, tessellation: 16};
    
    // Front left wheel
    const wheel1 = BABYLON.MeshBuilder.CreateCylinder('wheel1', wheelOptions, scene);
    wheel1.position = new BABYLON.Vector3(-1.2, 0, 1.5);
    wheel1.rotation.z = Math.PI/2;
    wheel1.material = wheelMaterial;
    wheel1.parent = carMesh;
    
    // Front right wheel
    const wheel2 = BABYLON.MeshBuilder.CreateCylinder('wheel2', wheelOptions, scene);
    wheel2.position = new BABYLON.Vector3(1.2, 0, 1.5);
    wheel2.rotation.z = Math.PI/2;
    wheel2.material = wheelMaterial;
    wheel2.parent = carMesh;
    
    // Rear left wheel
    const wheel3 = BABYLON.MeshBuilder.CreateCylinder('wheel3', wheelOptions, scene);
    wheel3.position = new BABYLON.Vector3(-1.2, 0, -1.5);
    wheel3.rotation.z = Math.PI/2;
    wheel3.material = wheelMaterial;
    wheel3.parent = carMesh;
    
    // Rear right wheel
    const wheel4 = BABYLON.MeshBuilder.CreateCylinder('wheel4', wheelOptions, scene);
    wheel4.position = new BABYLON.Vector3(1.2, 0, -1.5);
    wheel4.rotation.z = Math.PI/2;
    wheel4.material = wheelMaterial;
    wheel4.parent = carMesh;
} 