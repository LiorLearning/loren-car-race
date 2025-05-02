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
    
    // Create countdown display
    const countdownDisplay = document.createElement('div');
    countdownDisplay.id = 'countdownDisplay';
    countdownDisplay.style.position = 'absolute';
    countdownDisplay.style.top = '50%';
    countdownDisplay.style.left = '50%';
    countdownDisplay.style.transform = 'translate(-50%, -50%)';
    countdownDisplay.style.fontSize = '72px';
    countdownDisplay.style.fontWeight = 'bold';
    countdownDisplay.style.color = 'white';
    countdownDisplay.style.textShadow = '0 0 10px rgba(0,0,0,0.5)';
    countdownDisplay.style.display = 'none';
    countdownDisplay.style.zIndex = '1000';
    uiContainer.appendChild(countdownDisplay);
    
    // Create 2D minimap container
    const minimapContainer = document.createElement('div');
    minimapContainer.id = 'minimap2DContainer';
    minimapContainer.style.position = 'absolute';
    minimapContainer.style.bottom = '20px';
    minimapContainer.style.right = '20px';
    minimapContainer.style.width = '200px';
    minimapContainer.style.height = '200px';
    minimapContainer.style.backgroundColor = 'rgba(0,0,0,0.7)';
    minimapContainer.style.border = '2px solid rgba(255,255,255,0.3)';
    minimapContainer.style.borderRadius = '5px';
    minimapContainer.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';
    minimapContainer.style.zIndex = '1';
    uiContainer.appendChild(minimapContainer);
    
    // Create canvas for 2D minimap
    const minimapCanvas = document.createElement('canvas');
    minimapCanvas.id = 'minimap2D';
    minimapCanvas.width = 200;
    minimapCanvas.height = 200;
    minimapCanvas.style.width = '100%';
    minimapCanvas.style.height = '100%';
    minimapContainer.appendChild(minimapCanvas);
    
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
    speedDisplay.innerHTML = `<div style="color: #ff5555">Red Car Speed: 0 km/h</div>
                            <div style="color: #5555ff">Blue Car Speed: 0 km/h</div>`;
    raceInfoPanel.appendChild(speedDisplay);
    
    // Terrain information display
    const terrainInfo = document.createElement('div');
    terrainInfo.id = 'terrainInfo';
    terrainInfo.style.fontSize = '16px';
    terrainInfo.textContent = 'Red Car: Track';
    raceInfoPanel.appendChild(terrainInfo);
    
    // Checkpoint progress
    const checkpointProgress = document.createElement('div');
    checkpointProgress.id = 'checkpointProgress';
    checkpointProgress.style.marginTop = '10px';
    checkpointProgress.style.fontSize = '16px';
    checkpointProgress.textContent = 'Checkpoints: 0/' + (gameState.checkpoints ? gameState.checkpoints.length : 0);
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
        <div style="display: grid; grid-template-columns: auto auto; gap: 5px; margin-bottom: 10px;">
            <div style="grid-column: span 2; text-align: center; color: #ff5555; font-weight: bold; margin-bottom: 5px;">Red Car (Arrow Keys)</div>
            <div>↑ Up Arrow:</div><div>Accelerate</div>
            <div>↓ Down Arrow:</div><div>Brake/Reverse</div>
            <div>← Left Arrow:</div><div>Turn Left</div>
            <div>→ Right Arrow:</div><div>Turn Right</div>
            <div>E:</div><div>Shoot</div>
        </div>
        <div style="display: grid; grid-template-columns: auto auto; gap: 5px;">
            <div style="grid-column: span 2; text-align: center; color: #5555ff; font-weight: bold; margin-bottom: 5px;">Blue Car (WASD)</div>
            <div>W:</div><div>Accelerate</div>
            <div>S:</div><div>Brake/Reverse</div>
            <div>A:</div><div>Turn Left</div>
            <div>D:</div><div>Turn Right</div>
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
    
    // Create GUI texture for ammo display
    const advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
    
    // Create ammo display
    const ammoText = new BABYLON.GUI.TextBlock();
    ammoText.text = "Red Ammo: 0";
    ammoText.color = "white";
    ammoText.fontSize = 24;
    ammoText.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    ammoText.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
    ammoText.left = 20;
    ammoText.top = 20;
    advancedTexture.addControl(ammoText);
    
    // Store UI elements in gameState
    gameState.ui = {
        container: uiContainer,
        gameHeader,
        raceInfoPanel,
        lapTimeDisplay,
        speedDisplay,
        checkpointProgress,
        victoryBanner,
        terrainInfo,
        countdownDisplay,
        ammoText: ammoText
    };
    
    return {
        container: uiContainer,
        gameHeader,
        raceInfoPanel,
        lapTimeDisplay,
        speedDisplay,
        checkpointProgress,
        victoryBanner,
        terrainInfo,
        countdownDisplay,
        ammoText
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
 * @param {number} redCarSpeed - The red car speed value
 * @param {number} blueCarSpeed - The blue car speed value
 */
export function updateSpeedDisplay(speedDisplay, redCarSpeed, blueCarSpeed) {
    const redSpeedKmh = Math.abs(Math.round(redCarSpeed * 20)); // Convert to km/h with scaling
    const blueSpeedKmh = Math.abs(Math.round(blueCarSpeed * 20)); // Convert to km/h with scaling
    speedDisplay.innerHTML = `<div style="color: #ff5555">Red Car Speed: ${redSpeedKmh} km/h</div>
                            <div style="color: #5555ff">Blue Car Speed: ${blueSpeedKmh} km/h</div>`;
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

/**
 * Shows the game mode selection modal
 * @param {Object} gameState - The global game state
 */
export function showGameModeModal(gameState) {
    // Create modal container
    const modal = document.createElement('div');
    modal.id = 'gameModeModal';
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    modal.style.display = 'flex';
    modal.style.justifyContent = 'center';
    modal.style.alignItems = 'center';
    modal.style.zIndex = '1000';

    // Create modal content
    const content = document.createElement('div');
    content.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
    content.style.padding = '40px';
    content.style.borderRadius = '20px';
    content.style.textAlign = 'center';
    content.style.boxShadow = '0 0 20px rgba(0, 0, 0, 0.5)';

    // Add title
    const title = document.createElement('h1');
    title.textContent = 'Select Game Mode';
    title.style.color = 'white';
    title.style.marginBottom = '30px';
    title.style.fontSize = '32px';
    content.appendChild(title);

    // Create buttons container
    const buttonsContainer = document.createElement('div');
    buttonsContainer.style.display = 'flex';
    buttonsContainer.style.gap = '20px';
    buttonsContainer.style.justifyContent = 'center';

    // Multiplayer button
    const multiplayerBtn = document.createElement('button');
    multiplayerBtn.textContent = 'Multiplayer';
    multiplayerBtn.style.padding = '15px 30px';
    multiplayerBtn.style.fontSize = '18px';
    multiplayerBtn.style.borderRadius = '10px';
    multiplayerBtn.style.border = 'none';
    multiplayerBtn.style.backgroundColor = '#4CAF50';
    multiplayerBtn.style.color = 'white';
    multiplayerBtn.style.cursor = 'pointer';
    multiplayerBtn.style.transition = 'background-color 0.3s';
    multiplayerBtn.onmouseover = () => multiplayerBtn.style.backgroundColor = '#45a049';
    multiplayerBtn.onmouseout = () => multiplayerBtn.style.backgroundColor = '#4CAF50';
    multiplayerBtn.onclick = () => {
        gameState.gameMode = 'multiplayer';
        hideGameModeModal(modal);
        showCountdown(gameState.ui.countdownDisplay, () => {
            gameState.raceStarted = true;
        });
    };

    // Single Player button
    const singlePlayerBtn = document.createElement('button');
    singlePlayerBtn.textContent = 'Single Player';
    singlePlayerBtn.style.padding = '15px 30px';
    singlePlayerBtn.style.fontSize = '18px';
    singlePlayerBtn.style.borderRadius = '10px';
    singlePlayerBtn.style.border = 'none';
    singlePlayerBtn.style.backgroundColor = '#2196F3';
    singlePlayerBtn.style.color = 'white';
    singlePlayerBtn.style.cursor = 'pointer';
    singlePlayerBtn.style.transition = 'background-color 0.3s';
    singlePlayerBtn.onmouseover = () => singlePlayerBtn.style.backgroundColor = '#0b7dda';
    singlePlayerBtn.onmouseout = () => singlePlayerBtn.style.backgroundColor = '#2196F3';
    singlePlayerBtn.onclick = () => {
        gameState.gameMode = 'singleplayer';
        hideGameModeModal(modal);
        showCountdown(gameState.ui.countdownDisplay, () => {
            gameState.raceStarted = true;
        });
    };

    buttonsContainer.appendChild(multiplayerBtn);
    buttonsContainer.appendChild(singlePlayerBtn);
    content.appendChild(buttonsContainer);
    modal.appendChild(content);
    document.body.appendChild(modal);
}

/**
 * Hides the game mode selection modal
 * @param {HTMLElement} modal - The modal element to hide
 */
export function hideGameModeModal(modal) {
    if (modal && modal.parentNode) {
        modal.parentNode.removeChild(modal);
    }
}

/**
 * Shows the countdown before race start
 * @param {HTMLElement} countdownDisplay - The countdown display element
 * @param {Function} onComplete - Callback when countdown completes
 */
export function showCountdown(countdownDisplay, onComplete) {
    countdownDisplay.style.display = 'block';
    let count = 3;
    
    const updateCountdown = () => {
        if (count > 0) {
            countdownDisplay.textContent = count;
            countdownDisplay.style.transform = 'translate(-50%, -50%) scale(1)';
            countdownDisplay.style.opacity = '1';
            
            // Animate the number
            countdownDisplay.animate(
                [
                    { transform: 'translate(-50%, -50%) scale(1.5)', opacity: 0 },
                    { transform: 'translate(-50%, -50%) scale(1)', opacity: 1 }
                ],
                { 
                    duration: 500,
                    easing: 'ease-out'
                }
            );
            
            count--;
            setTimeout(updateCountdown, 1000);
        } else {
            countdownDisplay.textContent = 'GO!';
            countdownDisplay.style.color = '#4CAF50';
            
            // Animate the GO! text
            countdownDisplay.animate(
                [
                    { transform: 'translate(-50%, -50%) scale(1.5)', opacity: 0 },
                    { transform: 'translate(-50%, -50%) scale(1)', opacity: 1 }
                ],
                { 
                    duration: 500,
                    easing: 'ease-out'
                }
            );
            
            // Hide after 1 second
            setTimeout(() => {
                countdownDisplay.style.display = 'none';
                onComplete();
            }, 1000);
        }
    };
    
    updateCountdown();
}

// Update UI function
export function updateUI(gameState) {
    // Update ammo display
    if (gameState.ui.ammoText) {
        gameState.ui.ammoText.text = `Red Ammo: ${gameState.redAmmo}`;
    }
}

export function showMathQuiz(color, gameState) {
    // Create quiz modal container
    const quizModal = document.createElement('div');
    quizModal.id = 'quizModal';
    quizModal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.85);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    `;

    // Generate random math question
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    const correctAnswer = num1 + num2;
    
    // Create question element
    const question = document.createElement('div');
    question.textContent = `What is ${num1} + ${num2}?`;
    question.style.cssText = `
        color: white;
        font-size: 48px;
        margin-bottom: 40px;
        font-family: Arial, sans-serif;
    `;

    // Create answer buttons container
    const buttonContainer = document.createElement('div');
    buttonContainer.style.cssText = `
        display: flex;
        gap: 20px;
    `;

    // Generate answer options
    const answers = [correctAnswer];
    while (answers.length < 3) {
        const wrongAnswer = Math.floor(Math.random() * 20) + 1;
        if (!answers.includes(wrongAnswer)) {
            answers.push(wrongAnswer);
        }
    }
    
    // Shuffle answers
    answers.sort(() => Math.random() - 0.5);

    // Create answer buttons
    answers.forEach(answer => {
        const button = document.createElement('button');
        button.textContent = answer;
        button.style.cssText = `
            padding: 20px 40px;
            font-size: 24px;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            background: #4CAF50;
            color: white;
            transition: background 0.3s;
        `;

        button.addEventListener('click', () => {
            if (answer === correctAnswer) {
                gameState.redAmmo += 1;
            }
            quizModal.remove();
            gameState.quizActive = false;
        });

        buttonContainer.appendChild(button);
    });

    // Assemble the modal
    quizModal.appendChild(question);
    quizModal.appendChild(buttonContainer);
    document.body.appendChild(quizModal);
} 