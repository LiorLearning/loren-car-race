// Physics module for the racing game
import { isCarOnGrass } from './track.js';

// Physics constants
const MAX_SPEED = 1.4; // Maximum car speed
const ACCELERATION = 0.01; // Rate of acceleration
const DECELERATION = 0.005; // Rate of deceleration
const TURN_SPEED = 0.05; // Rate of turning
const GRASS_SPEED_MULTIPLIER = 0.5; // 50% slower on grass
const COLLISION_BOUNCE = 0.5; // Bounce factor when hitting walls
const STEERING_RESPONSIVE_FACTOR = 1.5; // Makes steering more responsive at lower speeds

/**
 * Initializes physics properties for both cars
 * @param {Object} gameState - The global game state
 */
export function initializePhysics(gameState) {
    // Red car physics
    gameState.carSpeed = 0;
    gameState.maxSpeed = MAX_SPEED;
    gameState.acceleration = ACCELERATION;
    gameState.deceleration = DECELERATION;
    gameState.turnSpeed = TURN_SPEED;
    gameState.isOnGrass = false;
    gameState.lastPosition = null; // Store last valid position
    
    // Blue car physics
    gameState.blueCarSpeed = 0;
    gameState.blueMaxSpeed = MAX_SPEED;
    gameState.blueAcceleration = ACCELERATION;
    gameState.blueDeceleration = DECELERATION;
    gameState.blueTurnSpeed = TURN_SPEED;
    gameState.blueIsOnGrass = false;
    gameState.blueLastPosition = null; // Store last valid position
}

/**
 * Updates physics calculations each frame for both cars
 * @param {Object} gameState - The global game state
 */
export function updatePhysics(gameState) {
    // Update red car physics
    updateRedCarPhysics(gameState);
    
    // Update blue car physics if it exists
    if (gameState.blueCar) {
        updateBlueCarPhysics(gameState);
    }
}

/**
 * Updates physics calculations for the red car
 * @param {Object} gameState - The global game state
 */
function updateRedCarPhysics(gameState) {
    // Get references to game objects
    const car = gameState.car;
    
    // Store current position before movement
    if (!gameState.lastPosition) {
        gameState.lastPosition = car.position.clone();
    } else {
        gameState.lastPosition.copyFrom(car.position);
    }
    
    // Check if car is on grass
    if (gameState.trackMesh && gameState.leftGrassMesh && gameState.rightGrassMesh) {
        gameState.isOnGrass = isCarOnGrass(car, gameState.trackMesh, gameState.leftGrassMesh, gameState.rightGrassMesh);
    }
    
    // Adjust max speed based on terrain
    const effectiveMaxSpeed = gameState.isOnGrass ? 
                             gameState.maxSpeed * GRASS_SPEED_MULTIPLIER : 
                             gameState.maxSpeed;
    
    // Apply acceleration/deceleration
    if (gameState.moveForward) {
        gameState.carSpeed += gameState.acceleration;
        if (gameState.carSpeed > effectiveMaxSpeed) gameState.carSpeed = effectiveMaxSpeed;
    } 
    else if (gameState.moveBackward) {
        gameState.carSpeed -= gameState.acceleration;
        if (gameState.carSpeed < -effectiveMaxSpeed / 1.5) gameState.carSpeed = -effectiveMaxSpeed / 1.5; // Backward is slower
    } 
    else {
        // Decelerate when no keys are pressed
        if (gameState.carSpeed > 0) {
            gameState.carSpeed -= gameState.deceleration;
            if (gameState.carSpeed < 0) gameState.carSpeed = 0;
        } else if (gameState.carSpeed < 0) {
            gameState.carSpeed += gameState.deceleration;
            if (gameState.carSpeed > 0) gameState.carSpeed = 0;
        }
    }
    
    // Apply turning with improved responsive steering at low speeds
    // This allows better car control at lower speeds
    let turnFactor = Math.max(0.4, Math.abs(gameState.carSpeed) / gameState.maxSpeed) * STEERING_RESPONSIVE_FACTOR;
    
    if (gameState.turnLeft) {
        car.rotation.y -= gameState.turnSpeed * turnFactor;
    }
    if (gameState.turnRight) {
        car.rotation.y += gameState.turnSpeed * turnFactor;
    }
    
    // Move car forward in the direction it's facing
    // Using the car's frontVector (Z-axis) for forward movement
    const forwardVector = new BABYLON.Vector3(0, 0, 1);
    const rotationMatrix = BABYLON.Matrix.RotationY(car.rotation.y);
    const direction = BABYLON.Vector3.TransformNormal(forwardVector, rotationMatrix).scale(gameState.carSpeed);
    
    car.position.addInPlace(direction);
    
    // Check for wall collisions
    checkWallCollisions(gameState, car, 'lastPosition');
}

/**
 * Updates physics calculations for the blue car
 * @param {Object} gameState - The global game state
 */
function updateBlueCarPhysics(gameState) {
    // Get references to game objects
    const car = gameState.blueCar;
    
    // Store current position before movement
    if (!gameState.blueLastPosition) {
        gameState.blueLastPosition = car.position.clone();
    } else {
        gameState.blueLastPosition.copyFrom(car.position);
    }
    
    // Check if car is on grass
    if (gameState.trackMesh && gameState.leftGrassMesh && gameState.rightGrassMesh) {
        gameState.blueIsOnGrass = isCarOnGrass(car, gameState.trackMesh, gameState.leftGrassMesh, gameState.rightGrassMesh);
    }
    
    // Adjust max speed based on terrain
    const effectiveMaxSpeed = gameState.blueIsOnGrass ? 
                             gameState.blueMaxSpeed * GRASS_SPEED_MULTIPLIER : 
                             gameState.blueMaxSpeed;
    
    // Apply acceleration/deceleration
    if (gameState.blueMoveForward) {
        gameState.blueCarSpeed += gameState.blueAcceleration;
        if (gameState.blueCarSpeed > effectiveMaxSpeed) gameState.blueCarSpeed = effectiveMaxSpeed;
    } 
    else if (gameState.blueMoveBackward) {
        gameState.blueCarSpeed -= gameState.blueAcceleration;
        if (gameState.blueCarSpeed < -effectiveMaxSpeed / 1.5) gameState.blueCarSpeed = -effectiveMaxSpeed / 1.5; // Backward is slower
    } 
    else {
        // Decelerate when no keys are pressed
        if (gameState.blueCarSpeed > 0) {
            gameState.blueCarSpeed -= gameState.blueDeceleration;
            if (gameState.blueCarSpeed < 0) gameState.blueCarSpeed = 0;
        } else if (gameState.blueCarSpeed < 0) {
            gameState.blueCarSpeed += gameState.blueDeceleration;
            if (gameState.blueCarSpeed > 0) gameState.blueCarSpeed = 0;
        }
    }
    
    // Apply turning with improved responsive steering at low speeds
    // This allows better car control at lower speeds
    let turnFactor = Math.max(0.4, Math.abs(gameState.blueCarSpeed) / gameState.blueMaxSpeed) * STEERING_RESPONSIVE_FACTOR;
    
    if (gameState.blueTurnLeft) {
        car.rotation.y -= gameState.blueTurnSpeed * turnFactor;
    }
    if (gameState.blueTurnRight) {
        car.rotation.y += gameState.blueTurnSpeed * turnFactor;
    }
    
    // Move car forward in the direction it's facing
    // Using the car's frontVector (Z-axis) for forward movement
    const forwardVector = new BABYLON.Vector3(0, 0, 1);
    const rotationMatrix = BABYLON.Matrix.RotationY(car.rotation.y);
    const direction = BABYLON.Vector3.TransformNormal(forwardVector, rotationMatrix).scale(gameState.blueCarSpeed);
    
    car.position.addInPlace(direction);
    
    // Check for wall collisions
    checkWallCollisions(gameState, car, 'blueLastPosition');
}

/**
 * Check for collisions with wall barriers
 * @param {Object} gameState - The global game state
 * @param {BABYLON.Mesh} car - The car mesh to check
 * @param {string} lastPositionKey - The key in gameState for the last position ('lastPosition' or 'blueLastPosition')
 */
function checkWallCollisions(gameState, car, lastPositionKey) {
    // Get all barrier meshes in the scene
    const barriers = gameState.scene.meshes.filter(mesh => 
        mesh.name.startsWith('leftBarrier') || mesh.name.startsWith('rightBarrier')
    );
    
    // Check for collision with any barrier
    let collision = false;
    let collidingBarrier = null;
    for (const barrier of barriers) {
        if (car.intersectsMesh(barrier, false)) {
            collision = true;
            collidingBarrier = barrier;
            break;
        }
    }
    
    // If collision detected, revert to last position and bounce
    if (collision) {
        // Revert to previous position
        car.position.copyFrom(gameState[lastPositionKey]);
        
        // Calculate push direction to move away from the wall
        // If we have a colliding barrier, create a push vector away from it
        if (collidingBarrier) {
            const pushDirection = car.position.subtract(collidingBarrier.position);
            pushDirection.y = 0; // Keep on the same vertical plane
            
            // Normalize and apply a push force
            if (pushDirection.length() > 0) {
                pushDirection.normalize();
                pushDirection.scaleInPlace(0.1); // Push distance
                car.position.addInPlace(pushDirection);
            }
        }
        
        // Apply stronger bounce for low speeds to prevent getting stuck
        const minBounceSpeed = 0.1;
        if (lastPositionKey === 'lastPosition') {
            if (Math.abs(gameState.carSpeed) < minBounceSpeed) {
                // If speed is very low, give it a minimum bounce to escape the wall
                gameState.carSpeed = -Math.sign(gameState.carSpeed || 1) * minBounceSpeed;
            } else {
                // Normal bounce with a minimum magnitude
                gameState.carSpeed = -gameState.carSpeed * COLLISION_BOUNCE;
            }
        } else {
            if (Math.abs(gameState.blueCarSpeed) < minBounceSpeed) {
                // If speed is very low, give it a minimum bounce to escape the wall
                gameState.blueCarSpeed = -Math.sign(gameState.blueCarSpeed || 1) * minBounceSpeed;
            } else {
                // Normal bounce with a minimum magnitude
                gameState.blueCarSpeed = -gameState.blueCarSpeed * COLLISION_BOUNCE;
            }
        }
        
        // Add stronger rotation to help the car change direction when stuck
        car.rotation.y += (Math.random() - 0.5) * 0.3;
    }
}

/**
 * Resets the physics state for both cars
 * @param {Object} gameState - The global game state
 */
export function resetPhysics(gameState) {
    // Reset red car physics
    gameState.carSpeed = 0;
    gameState.isOnGrass = false;
    gameState.lastPosition = null;
    
    // Reset blue car physics
    gameState.blueCarSpeed = 0;
    gameState.blueIsOnGrass = false;
    gameState.blueLastPosition = null;
} 