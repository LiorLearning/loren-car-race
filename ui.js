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
        <div style="display: grid; grid-template-columns: auto auto; gap: 5px; margin-bottom: 10px;">
            <div style="grid-column: span 2; text-align: center; color: #ff5555; font-weight: bold; margin-bottom: 5px;">Red Car (Arrow Keys)</div>
            <div>↑ Up Arrow:</div><div>Accelerate</div>
            <div>↓ Down Arrow:</div><div>Brake/Reverse</div>
            <div>← Left Arrow:</div><div>Turn Left</div>
            <div>→ Right Arrow:</div><div>Turn Right</div>
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
    
    // Create audio control button
    const audioControl = document.createElement('div');
    audioControl.id = 'audioControl';
    audioControl.style.position = 'absolute';
    audioControl.style.top = '20px';
    audioControl.style.right = '20px';
    audioControl.style.width = '40px';
    audioControl.style.height = '40px';
    audioControl.style.backgroundColor = 'rgba(0,0,0,0.7)';
    audioControl.style.color = 'white';
    audioControl.style.borderRadius = '50%';
    audioControl.style.display = 'flex';
    audioControl.style.justifyContent = 'center';
    audioControl.style.alignItems = 'center';
    audioControl.style.fontSize = '20px';
    audioControl.style.cursor = 'pointer';
    audioControl.style.boxShadow = '0 2px 5px rgba(0,0,0,0.3)';
    audioControl.style.zIndex = '100';
    audioControl.innerHTML = '🔊';
    audioControl.title = 'Toggle Background Music';
    uiContainer.appendChild(audioControl);
    
    // Create hidden audio element for BGM
    const bgmAudio = document.createElement('audio');
    bgmAudio.id = 'bgmAudio';
    bgmAudio.loop = true;
    bgmAudio.volume = 0.5; // Set to 50% volume by default
    
    // Use a Creative Commons racing music
    bgmAudio.src = 'https://freepd.com/music/Fast%20Ace.mp3'; // Fallback to a common racing-like track
    document.body.appendChild(bgmAudio);
    
    // Add event listener to toggle audio
    let isMuted = false;
    audioControl.addEventListener('click', () => {
        if (isMuted) {
            unmuteBGM(bgmAudio);
            audioControl.innerHTML = '🔊';
            isMuted = false;
        } else {
            muteBGM(bgmAudio);
            audioControl.innerHTML = '🔇';
            isMuted = true;
        }
    });
    
    // Start BGM
    playBGM(bgmAudio);
    
    return {
        lapTimeDisplay,
        terrainInfo,
        speedDisplay,
        checkpointProgress,
        instructions,
        victoryBanner,
        bgmAudio,
        audioControl
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
    
    // Find the bgmAudio element if not passed directly
    const bgmAudio = document.getElementById('bgmAudio');
    if (bgmAudio) {
        // Lower BGM volume
        const currentVolume = bgmAudio.volume;
        bgmAudio.volume = Math.max(0.1, currentVolume * 0.5);
        
        // Play victory sound effect
        const victorySound = document.createElement('audio');
        victorySound.src = 'https://freesound.org/data/previews/258/258142_4486188-lq.mp3'; // Victory fanfare sound
        victorySound.volume = 0.7;
        victorySound.play();
        
        // Return BGM volume to normal after victory sound
        victorySound.onended = () => {
            bgmAudio.volume = currentVolume;
        };
    }
}

/**
 * Hides the victory banner
 * @param {HTMLElement} victoryBanner - The victory banner element
 */
export function hideVictoryBanner(victoryBanner) {
    victoryBanner.style.display = 'none';
}

/**
 * Plays the background music
 * @param {HTMLAudioElement} bgmAudio - The audio element for background music
 */
export function playBGM(bgmAudio) {
    // Use a promise to handle autoplay policy
    const playPromise = bgmAudio.play();
    
    if (playPromise !== undefined) {
        playPromise.catch(error => {
            console.log("Autoplay prevented. User interaction needed to start audio.");
            // We'll show a "click to play" message if needed
            const audioMessage = document.createElement('div');
            audioMessage.id = 'audioMessage';
            audioMessage.style.position = 'absolute';
            audioMessage.style.top = '70px';
            audioMessage.style.right = '20px';
            audioMessage.style.padding = '5px 10px';
            audioMessage.style.backgroundColor = 'rgba(0,0,0,0.7)';
            audioMessage.style.color = 'white';
            audioMessage.style.borderRadius = '5px';
            audioMessage.style.fontSize = '12px';
            audioMessage.textContent = 'Click anywhere to enable music';
            audioMessage.style.zIndex = '100';
            document.body.appendChild(audioMessage);
            
            // Add event listener to the body to play audio on user interaction
            const playAudioOnInteraction = () => {
                bgmAudio.play().then(() => {
                    if (audioMessage.parentNode) {
                        audioMessage.parentNode.removeChild(audioMessage);
                    }
                }).catch(error => {
                    console.log("Still can't play audio:", error);
                });
                document.body.removeEventListener('click', playAudioOnInteraction);
            };
            document.body.addEventListener('click', playAudioOnInteraction);
        });
    }
}

/**
 * Pauses the background music
 * @param {HTMLAudioElement} bgmAudio - The audio element for background music
 */
export function pauseBGM(bgmAudio) {
    bgmAudio.pause();
}

/**
 * Mutes the background music
 * @param {HTMLAudioElement} bgmAudio - The audio element for background music
 */
export function muteBGM(bgmAudio) {
    bgmAudio.volume = 0;
}

/**
 * Unmutes the background music
 * @param {HTMLAudioElement} bgmAudio - The audio element for background music
 */
export function unmuteBGM(bgmAudio) {
    bgmAudio.volume = 0.5;
}

/**
 * Sets the volume of the background music
 * @param {HTMLAudioElement} bgmAudio - The audio element for background music
 * @param {number} volume - Volume level (0 to 1)
 */
export function setBGMVolume(bgmAudio, volume) {
    bgmAudio.volume = Math.max(0, Math.min(1, volume));
}

/**
 * Plays a sound effect for race start
 */
export function playRaceStartSound() {
    const startSound = document.createElement('audio');
    startSound.src = 'https://freesound.org/data/previews/362/362645_6646536-lq.mp3'; // Race start beep
    startSound.volume = 0.7;
    startSound.play();
}

/**
 * Plays a sound effect for checkpoint crossing
 */
export function playCheckpointSound() {
    const checkpointSound = document.createElement('audio');
    checkpointSound.src = 'https://freesound.org/data/previews/264/264828_5003039-lq.mp3'; // Checkpoint ping sound
    checkpointSound.volume = 0.4;
    checkpointSound.play();
} 