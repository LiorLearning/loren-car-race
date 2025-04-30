// Controls module for the racing game

/**
 * Sets up keyboard controls for the game
 * @param {Object} gameState - The global game state
 */
export function setupControls(gameState) {
    // Keyboard controls - keydown
    window.addEventListener('keydown', (e) => {
        switch(e.key) {
            case 'w':
            case 'ArrowUp':
                gameState.moveForward = true;
                break;
            case 's':
            case 'ArrowDown':
                gameState.moveBackward = true;
                break;
            case 'a':
            case 'ArrowLeft':
                gameState.turnLeft = true;
                break;
            case 'd':
            case 'ArrowRight':
                gameState.turnRight = true;
                break;
        }
    });

    // Keyboard controls - keyup
    window.addEventListener('keyup', (e) => {
        switch(e.key) {
            case 'w':
            case 'ArrowUp':
                gameState.moveForward = false;
                break;
            case 's':
            case 'ArrowDown':
                gameState.moveBackward = false;
                break;
            case 'a':
            case 'ArrowLeft':
                gameState.turnLeft = false;
                break;
            case 'd':
            case 'ArrowRight':
                gameState.turnRight = false;
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
        moveForward: gameState.moveForward,
        moveBackward: gameState.moveBackward,
        turnLeft: gameState.turnLeft,
        turnRight: gameState.turnRight
    };
} 