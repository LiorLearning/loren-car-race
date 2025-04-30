// UI module for the racing game

/**
 * Sets up the UI elements for the game
 * @param {Object} gameState - The global game state
 * @returns {Object} Object containing UI elements
 */
export function setupUI(gameState) {
    // Create main UI container
    const uiContainer = document.createElement('div');
    uiContainer.id = 'uiContainer';
    uiContainer.style.fontFamily = 'Arial, sans-serif';
    document.body.appendChild(uiContainer);
    
    // Game header with title
    const gameHeader = document.createElement('div');
    gameHeader.id = 'gameHeader';
    gameHeader.style.position = 'absolute';
    gameHeader.style.top = '10px';
    gameHeader.style.left = '50%';
    gameHeader.style.transform = 'translateX(-50%)';
    gameHeader.style.color = 'white';
    gameHeader.style.backgroundColor = 'rgba(0,0,0,0.7)';
    gameHeader.style.padding = '10px 30px';
    gameHeader.style.borderRadius = '20px';
    gameHeader.style.fontWeight = 'bold';
    gameHeader.style.fontSize = '24px';
    gameHeader.style.textAlign = 'center';
    gameHeader.style.boxShadow = '0 4px 8px rgba(0,0,0,0.3)';
    gameHeader.textContent = 'RACING CHALLENGE';
    uiContainer.appendChild(gameHeader);

    // Create race info panel
    const raceInfoPanel = document.createElement('div');
    raceInfoPanel.id = 'raceInfoPanel';
    raceInfoPanel.style.position = 'absolute';
    raceInfoPanel.style.top = '20px';
    raceInfoPanel.style.left = '20px';
    raceInfoPanel.style.color = 'white';
    raceInfoPanel.style.backgroundColor = 'rgba(0,0,0,0.7)';
    raceInfoPanel.style.padding = '15px';
    raceInfoPanel.style.borderRadius = '10px';
    raceInfoPanel.style.boxShadow = '0 4px 8px rgba(0,0,0,0.3)';
    raceInfoPanel.style.minWidth = '250px';
    uiContainer.appendChild(raceInfoPanel);
    
    // Lap time display
    const lapTimeDisplay = document.createElement('div');
    lapTimeDisplay.id = 'lapTimeDisplay';
    lapTimeDisplay.style.marginBottom = '10px';
    lapTimeDisplay.style.fontSize = '18px';
    lapTimeDisplay.style.fontWeight = 'bold';
    lapTimeDisplay.style.color = '#ffcc00';
    lapTimeDisplay.style.textShadow = '1px 1px 2px black';
    lapTimeDisplay.textContent = 'Cross the start line to begin!';
    raceInfoPanel.appendChild(lapTimeDisplay);
    
    // Speed display
    const speedDisplay = document.createElement('div');
    speedDisplay.id = 'speedDisplay';
    speedDisplay.style.marginBottom = '10px';
    speedDisplay.style.fontSize = '16px';
    speedDisplay.textContent = 'Speed: 0 km/h';
    raceInfoPanel.appendChild(speedDisplay);
    
    // Terrain information display
    const terrainInfo = document.createElement('div');
    terrainInfo.id = 'terrainInfo';
    terrainInfo.style.fontSize = '16px';
    terrainInfo.textContent = 'Terrain: Track';
    raceInfoPanel.appendChild(terrainInfo);
    
    // Checkpoint progress
    const checkpointProgress = document.createElement('div');
    checkpointProgress.id = 'checkpointProgress';
    checkpointProgress.style.marginTop = '10px';
    checkpointProgress.style.fontSize = '16px';
    checkpointProgress.textContent = 'Checkpoints: 0/' + gameState.checkpoints.length;
    raceInfoPanel.appendChild(checkpointProgress);
    
    // Add instructions
    const instructions = document.createElement('div');
    instructions.id = 'instructions';
    instructions.style.position = 'absolute';
    instructions.style.bottom = '20px';
    instructions.style.right = '20px';
    instructions.style.color = 'white';
    instructions.style.backgroundColor = 'rgba(0,0,0,0.7)';
    instructions.style.padding = '15px';
    instructions.style.borderRadius = '10px';
    instructions.style.fontSize = '14px';
    instructions.style.boxShadow = '0 4px 8px rgba(0,0,0,0.3)';
    instructions.innerHTML = `
        <h3 style="margin-top: 0; text-align: center; color: #ffcc00;">CONTROLS</h3>
        <div style="display: grid; grid-template-columns: auto auto; gap: 5px;">
            <div>W/Up Arrow:</div><div>Accelerate</div>
            <div>S/Down Arrow:</div><div>Brake/Reverse</div>
            <div>A/Left Arrow:</div><div>Turn Left</div>
            <div>D/Right Arrow:</div><div>Turn Right</div>
        </div>
        <div style="margin-top: 10px; font-style: italic;">Stay on the track for full speed!</div>
    `;
    uiContainer.appendChild(instructions);
    
    // Create a hidden victory banner (will be shown on race completion)
    const victoryBanner = document.createElement('div');
    victoryBanner.id = 'victoryBanner';
    victoryBanner.style.position = 'absolute';
    victoryBanner.style.top = '50%';
    victoryBanner.style.left = '50%';
    victoryBanner.style.transform = 'translate(-50%, -50%)';
    victoryBanner.style.color = 'white';
    victoryBanner.style.backgroundColor = 'rgba(15, 70, 15, 0.9)';
    victoryBanner.style.padding = '30px 60px';
    victoryBanner.style.borderRadius = '15px';
    victoryBanner.style.boxShadow = '0 8px 16px rgba(0,0,0,0.5)';
    victoryBanner.style.textAlign = 'center';
    victoryBanner.style.zIndex = '1000';
    victoryBanner.style.display = 'none'; // Initially hidden
    victoryBanner.style.border = '3px solid gold';
    uiContainer.appendChild(victoryBanner);
    
    return {
        lapTimeDisplay,
        terrainInfo,
        speedDisplay,
        checkpointProgress,
        instructions,
        victoryBanner
    };
}

/**
 * Updates the lap timer display
 * @param {HTMLElement} lapTimeDisplay - The lap time display element
 * @param {string} message - The message to display
 */
export function updateLapTimer(lapTimeDisplay, message) {
    lapTimeDisplay.textContent = message;
}

/**
 * Updates the speed display
 * @param {HTMLElement} speedDisplay - The speed display element
 * @param {number} speed - The current speed value
 */
export function updateSpeedDisplay(speedDisplay, speed) {
    const speedKmh = Math.abs(Math.round(speed * 20)); // Convert to km/h with scaling
    speedDisplay.textContent = `Speed: ${speedKmh} km/h`;
}

/**
 * Updates checkpoint progress display
 * @param {HTMLElement} checkpointProgress - The checkpoint progress element
 * @param {Array} passedCheckpoints - Array of boolean values for passed checkpoints
 */
export function updateCheckpointProgress(checkpointProgress, passedCheckpoints) {
    const passed = passedCheckpoints.filter(cp => cp).length;
    const total = passedCheckpoints.length;
    checkpointProgress.textContent = `Checkpoints: ${passed}/${total}`;
}

/**
 * Formats a time in seconds to a readable string
 * @param {number} timeInSeconds - The time in seconds
 * @returns {string} Formatted time string
 */
export function formatTime(timeInSeconds) {
    if (timeInSeconds < 60) {
        return `${timeInSeconds.toFixed(2)} seconds`;
    } else {
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = (timeInSeconds % 60).toFixed(2);
        return `${minutes}:${seconds.padStart(5, '0')}`;
    }
}

/**
 * Shows a victory banner when the player completes the race
 * @param {HTMLElement} victoryBanner - The victory banner element
 * @param {number} lapTime - The lap time in seconds
 */
export function showVictoryBanner(victoryBanner, lapTime) {
    const formattedTime = formatTime(lapTime);
    
    // Set the victory message with the lap time
    victoryBanner.innerHTML = `
        <h1 style="color: gold; margin-top: 0; font-size: 36px; text-shadow: 2px 2px 4px #000;">VICTORY!</h1>
        <p style="font-size: 24px; margin: 15px 0;">Race completed in:</p>
        <p style="font-size: 32px; font-weight: bold; color: #ffcc00; margin: 20px 0; text-shadow: 1px 1px 2px #000;">${formattedTime}</p>
        <p style="font-size: 18px; margin-top: 30px;">Press SPACE to restart</p>
    `;
    
    // Show the banner
    victoryBanner.style.display = 'block';
    
    // Add a subtle animation effect
    victoryBanner.animate(
        [
            { transform: 'translate(-50%, -60%) scale(0.9)', opacity: 0 },
            { transform: 'translate(-50%, -50%) scale(1)', opacity: 1 }
        ],
        { 
            duration: 600,
            easing: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)'
        }
    );
}

/**
 * Hides the victory banner
 * @param {HTMLElement} victoryBanner - The victory banner element
 */
export function hideVictoryBanner(victoryBanner) {
    victoryBanner.style.display = 'none';
} 