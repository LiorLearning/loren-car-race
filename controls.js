// Controls module for the racing game

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
            
            // WASD for blue car
            case 'w':
                gameState.blueMoveForward = true;
                break;
            case 's':
                gameState.blueMoveBackward = true;
                break;
            case 'a':
                gameState.blueTurnLeft = true;
                break;
            case 'd':
                gameState.blueTurnRight = true;
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
            
            // WASD for blue car
            case 'w':
                gameState.blueMoveForward = false;
                break;
            case 's':
                gameState.blueMoveBackward = false;
                break;
            case 'a':
                gameState.blueTurnLeft = false;
                break;
            case 'd':
                gameState.blueTurnRight = false;
                break;
        }
    });
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
        
        // Blue car controls
        blueMoveForward: gameState.blueMoveForward,
        blueMoveBackward: gameState.blueMoveBackward,
        blueTurnLeft: gameState.blueTurnLeft,
        blueTurnRight: gameState.blueTurnRight
    };
} 