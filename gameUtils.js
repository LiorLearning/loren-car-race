// Game utility functions
import { showMathQuiz } from './ui.js';

/**
 * Creates a projectile in the scene
 * @param {BABYLON.Scene} scene - The Babylon.js scene
 * @param {BABYLON.Vector3} position - Starting position of the projectile
 * @param {BABYLON.Vector3} direction - Direction vector for the projectile
 * @returns {Object} Projectile object with mesh and properties
 */
export function createProjectile(scene, position, direction) {
    const projectile = BABYLON.MeshBuilder.CreateSphere("projectile", { diameter: 0.5 }, scene);
    projectile.position = position;
    
    const material = new BABYLON.StandardMaterial("projectileMaterial", scene);
    material.emissiveColor = new BABYLON.Color3(1, 0, 0);
    material.diffuseColor = new BABYLON.Color3(1, 0, 0);
    projectile.material = material;
    
    return {
        mesh: projectile,
        direction: direction,
        startTime: Date.now(),
        startPosition: position.clone()
    };
}

/**
 * Creates ammo pickups along the track
 * @param {BABYLON.Scene} scene - The Babylon.js scene
 * @param {Array} trackPath - Array of points defining the track path
 * @param {string} color - 'red' or 'blue' to determine pickup color
 * @returns {Array} Array of pickup objects
 */
export function createAmmoPickups(scene, trackPath, color) {
    const pickups = [];
    const pickupCount = 8; // Reduced count but spread out more
    const trackLength = trackPath.length;
    
    // Calculate spacing based on color to distribute pickups differently
    const spacing = Math.floor(trackLength / pickupCount);
    const offset = color === 'red' ? 0 : Math.floor(spacing / 2); // Offset blue pickups by half spacing
    
    for (let i = 0; i < pickupCount; i++) {
        // Calculate position with offset for blue pickups
        const index = (i * spacing + offset) % trackLength;
        const position = trackPath[index];
        
        // Create glowing sphere
        const pickup = BABYLON.MeshBuilder.CreateSphere(`ammoPickup${color}${i}`, { diameter: 1 }, scene);
        pickup.position = new BABYLON.Vector3(position.x, 1, position.z);
        
        // Create material with glow effect
        const material = new BABYLON.StandardMaterial(`ammoMaterial${color}${i}`, scene);
        material.emissiveColor = color === 'red' ? new BABYLON.Color3(1, 0.2, 0.2) : new BABYLON.Color3(0.2, 0.2, 1);
        material.diffuseColor = color === 'red' ? new BABYLON.Color3(1, 0.2, 0.2) : new BABYLON.Color3(0.2, 0.2, 1);
        material.specularColor = new BABYLON.Color3(1, 1, 1);
        pickup.material = material;
        
        // Add animation
        const animation = new BABYLON.Animation(
            "ammoFloat",
            "position.y",
            30,
            BABYLON.Animation.ANIMATIONTYPE_FLOAT,
            BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE
        );
        
        const keys = [
            { frame: 0, value: 1 },
            { frame: 30, value: 1.5 },
            { frame: 60, value: 1 }
        ];
        
        animation.setKeys(keys);
        pickup.animations.push(animation);
        scene.beginAnimation(pickup, 0, 60, true);
        
        pickups.push({
            mesh: pickup,
            index: i,
            isActive: true,
            respawnTime: 0,
            color: color
        });
    }
    
    return pickups;
}

/**
 * Updates the ammo system (pickups and projectiles)
 * @param {Object} gameState - The global game state
 */
export function updateAmmoSystem(gameState) {
    // Update ammo pickups
    gameState.ammoPickups.forEach(pickup => {
        // Check for collision with red car
        if (pickup.isActive && pickup.mesh.intersectsMesh(gameState.car, false)) {
            pickup.mesh.isVisible = false;
            pickup.isActive = false;
            pickup.respawnTime = Date.now() + 10000;
            
            if (gameState.gameMode === 'singleplayer') {
                gameState.quizActive = true;
                showMathQuiz('red', gameState);
            } else {
                gameState.redAmmo += 1;
            }
        }
        
        // Check for collision with blue car (only in multiplayer)
        if (gameState.gameMode === 'multiplayer' && pickup.isActive && pickup.mesh.intersectsMesh(gameState.blueCar, false)) {
            pickup.mesh.isVisible = false;
            pickup.isActive = false;
            pickup.respawnTime = Date.now() + 10000;
            gameState.blueAmmo += 1;
        }
        
        // Respawn pickup if time has elapsed
        if (!pickup.isActive && Date.now() > pickup.respawnTime) {
            pickup.mesh.isVisible = true;
            pickup.isActive = true;
        }
    });
    
    // Update red projectiles
    for (let i = gameState.projectiles.length - 1; i >= 0; i--) {
        const projectile = gameState.projectiles[i];
        const distance = BABYLON.Vector3.Distance(projectile.mesh.position, projectile.startPosition);
        
        // Move projectile
        projectile.mesh.position.addInPlace(projectile.direction.scale(0.5));
        
        // Check for collision with blue car
        if (projectile.mesh.intersectsMesh(gameState.blueCar, false)) {
            // Apply stronger speed debuff
            gameState.blueCarSpeedDebuff = 0.5; // Increased from 0.25 to 0.5 (50% speed reduction)
            gameState.blueCarSpeedDebuffEndTime = Date.now() + 5000; // 5 seconds
            projectile.mesh.dispose();
            gameState.projectiles.splice(i, 1);
            continue;
        }
        
        // Remove if too far
        if (distance > 100) {
            projectile.mesh.dispose();
            gameState.projectiles.splice(i, 1);
        }
    }
    
    // Update blue projectiles
    for (let i = gameState.blueProjectiles.length - 1; i >= 0; i--) {
        const projectile = gameState.blueProjectiles[i];
        const distance = BABYLON.Vector3.Distance(projectile.mesh.position, projectile.startPosition);
        
        // Move projectile
        projectile.mesh.position.addInPlace(projectile.direction.scale(0.5));
        
        // Check for collision with red car
        if (projectile.mesh.intersectsMesh(gameState.car, false)) {
            // Apply stronger speed debuff
            gameState.redCarSpeedDebuff = 0.5; // Increased from 0.25 to 0.5 (50% speed reduction)
            gameState.redCarSpeedDebuffEndTime = Date.now() + 5000; // 5 seconds
            projectile.mesh.dispose();
            gameState.blueProjectiles.splice(i, 1);
            continue;
        }
        
        // Remove if too far
        if (distance > 100) {
            projectile.mesh.dispose();
            gameState.blueProjectiles.splice(i, 1);
        }
    }
    
    // Update speed debuffs
    if (gameState.blueCarSpeedDebuff > 0 && Date.now() >= gameState.blueCarSpeedDebuffEndTime) {
        gameState.blueCarSpeedDebuff = 0;
    }
    if (gameState.redCarSpeedDebuff > 0 && Date.now() >= gameState.redCarSpeedDebuffEndTime) {
        gameState.redCarSpeedDebuff = 0;
    }
} 