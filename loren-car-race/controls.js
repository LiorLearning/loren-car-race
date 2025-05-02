// Controls module for the racing game
import { createProjectile } from './gameUtils.js';

/**
 * Sets up keyboard controls for the game
 * @param {Object} gameState - The global game state
 */
export function setupControls(gameState) {
    // Keyboard controls - keydown
    window.addEventListener('keydown', (e) => {
        switch(e.key) {
            // Arrow keys for red car
            case 'ArrowUp':
                gameState.moveForward = true;
                break;
            case 'ArrowDown':
                gameState.moveBackward = true;
                break;
            case 'ArrowLeft':
                gameState.turnLeft = true;
                break;
            case 'ArrowRight':
                gameState.turnRight = true;
                break;
            
            // WASD for blue car (only in multiplayer mode)
            case 'w':
                if (gameState.gameMode === 'multiplayer') {
                    gameState.blueMoveForward = true;
                }
                break;
            case 's':
                if (gameState.gameMode === 'multiplayer') {
                    gameState.blueMoveBackward = true;
                }
                break;
            case 'a':
                if (gameState.gameMode === 'multiplayer') {
                    gameState.blueTurnLeft = true;
                }
                break;
            case 'd':
                if (gameState.gameMode === 'multiplayer') {
                    gameState.blueTurnRight = true;
                }
                break;
        }
    });

    // Keyboard controls - keyup
    window.addEventListener('keyup', (e) => {
        switch(e.key) {
            // Arrow keys for red car
            case 'ArrowUp':
                gameState.moveForward = false;
                break;
            case 'ArrowDown':
                gameState.moveBackward = false;
                break;
            case 'ArrowLeft':
                gameState.turnLeft = false;
                break;
            case 'ArrowRight':
                gameState.turnRight = false;
                break;
            
            // WASD for blue car (only in multiplayer mode)
            case 'w':
                if (gameState.gameMode === 'multiplayer') {
                    gameState.blueMoveForward = false;
                }
                break;
            case 's':
                if (gameState.gameMode === 'multiplayer') {
                    gameState.blueMoveBackward = false;
                }
                break;
            case 'a':
                if (gameState.gameMode === 'multiplayer') {
                    gameState.blueTurnLeft = false;
                }
                break;
            case 'd':
                if (gameState.gameMode === 'multiplayer') {
                    gameState.blueTurnRight = false;
                }
                break;
        }
    });

    // Create action manager if it doesn't exist
    if (!gameState.scene.actionManager) {
        gameState.scene.actionManager = new BABYLON.ActionManager(gameState.scene);
    }

    // Add E key for red car shooting
    gameState.scene.actionManager.registerAction(
        new BABYLON.ExecuteCodeAction(
            BABYLON.ActionManager.OnKeyDownTrigger,
            (evt) => {
                if (evt.sourceEvent.key === 'e' && gameState.redAmmo > 0) {
                    // Get car's forward direction
                    const forward = new BABYLON.Vector3(
                        Math.sin(gameState.car.rotation.y),
                        0,
                        Math.cos(gameState.car.rotation.y)
                    );
                    
                    // Position projectile slightly in front of car
                    const startPos = gameState.car.position.add(forward.scale(2));
                    startPos.y = 1; // Slightly above ground
                    
                    // Create and add projectile
                    const projectile = createProjectile(gameState.scene, startPos, forward, 'red');
                    gameState.projectiles.push(projectile);
                    
                    // Deduct ammo
                    gameState.redAmmo -= 1;
                }
            }
        )
    );

    // Add L key for blue car shooting
    gameState.scene.actionManager.registerAction(
        new BABYLON.ExecuteCodeAction(
            BABYLON.ActionManager.OnKeyDownTrigger,
            (evt) => {
                if (evt.sourceEvent.key === 'l' && gameState.blueAmmo > 0 && gameState.gameMode === 'multiplayer') {
                    // Get car's forward direction
                    const forward = new BABYLON.Vector3(
                        Math.sin(gameState.blueCar.rotation.y),
                        0,
                        Math.cos(gameState.blueCar.rotation.y)
                    );
                    
                    // Position projectile slightly in front of car
                    const startPos = gameState.blueCar.position.add(forward.scale(2));
                    startPos.y = 1; // Slightly above ground
                    
                    // Create and add projectile
                    const projectile = createProjectile(gameState.scene, startPos, forward, 'blue');
                    gameState.blueProjectiles.push(projectile);
                    
                    // Deduct ammo
                    gameState.blueAmmo -= 1;
                }
            }
        )
    );
}

/**
 * Gets the current control state
 * @param {Object} gameState - The global game state
 * @returns {Object} Object containing control states
 */
export function getControlState(gameState) {
    return {
        // Red car controls
        moveForward: gameState.moveForward,
        moveBackward: gameState.moveBackward,
        turnLeft: gameState.turnLeft,
        turnRight: gameState.turnRight,
        
        // Blue car controls (only active in multiplayer mode)
        blueMoveForward: gameState.gameMode === 'multiplayer' ? gameState.blueMoveForward : false,
        blueMoveBackward: gameState.gameMode === 'multiplayer' ? gameState.blueMoveBackward : false,
        blueTurnLeft: gameState.gameMode === 'multiplayer' ? gameState.blueTurnLeft : false,
        blueTurnRight: gameState.gameMode === 'multiplayer' ? gameState.blueTurnRight : false
    };
} 