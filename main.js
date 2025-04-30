// Main entry point for the racing game

// Import modules
import { setupCamera, setupSplitScreenCameras } from './camera.js';
import { createCar, createBlueCar } from './car.js';
import { createTrack, createEnvironment, isCarOnGrass } from './track.js';
import { setupUI, updateSpeedDisplay, updateCheckpointProgress, showVictoryBanner, hideVictoryBanner, playBGM, pauseBGM, playRaceStartSound, playCheckpointSound } from './ui.js';
import { setupControls } from './controls.js';
import { initializePhysics, updatePhysics } from './physics.js';

// Global game state
const gameState = {
    car: null,
    blueCar: null,
    scene: null,
    finished: false,
    startTime: null,
    passedCheckpoints: [],
    checkpoints: [],
    startLineCollision: null,
    trackMesh: null,
    leftGrassMesh: null,
    rightGrassMesh: null,
    isOnGrass: false,
    blueIsOnGrass: false,
    carSpeed: 0,
    blueCarSpeed: 0,
    moveForward: false,
    moveBackward: false,
    turnLeft: false,
    turnRight: false,
    blueMoveForward: false,
    blueMoveBackward: false,
    blueTurnLeft: false,
    blueTurnRight: false,
    trackPath: null,
    lastCheckpointTime: null,
    ui: null,
    cameras: null
};

// Initialize Babylon.js engine
const canvas = document.getElementById('renderCanvas');
const engine = new BABYLON.Engine(canvas, true);

// Create scene
const createScene = function() {
    // Create the scene
    const scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color3(0.5, 0.8, 0.9); // Sky blue
    
    // Store scene in game state
    gameState.scene = scene;
    
    // Create environment (lights, ground)
    createEnvironment(scene);
    
    // Create cars
    gameState.car = createCar(scene);
    gameState.blueCar = createBlueCar(scene);
    
    // Setup split-screen cameras
    gameState.cameras = setupSplitScreenCameras(scene, gameState.car, gameState.blueCar);
    
    // Create track with checkpoints and finish line
    const { trackPath, trackMesh, leftGrassMesh, rightGrassMesh, checkpoints, startLineCollision } = createTrack(scene, gameState.car);
    gameState.trackPath = trackPath;
    gameState.trackMesh = trackMesh;
    gameState.leftGrassMesh = leftGrassMesh;
    gameState.rightGrassMesh = rightGrassMesh;
    gameState.checkpoints = checkpoints;
    gameState.startLineCollision = startLineCollision;
    
    // Initialize the passedCheckpoints array based on the number of checkpoints
    gameState.passedCheckpoints = Array(checkpoints.length).fill(false);
    
    // Position cars at the start of the track
    const startPos = trackPath[0];
    gameState.car.position.x = startPos.x;
    gameState.car.position.z = startPos.z;
    
    // Position blue car slightly offset
    gameState.blueCar.position.x = startPos.x + 2;
    gameState.blueCar.position.z = startPos.z;
    
    // Get direction from first track segment to position cars correctly
    const nextPos = trackPath[1];
    const direction = nextPos.subtract(startPos);
    const angle = Math.atan2(direction.x, direction.z); // Fix angle calculation for proper orientation
    gameState.car.rotation.y = angle; // Correctly orient car to face track direction
    gameState.blueCar.rotation.y = angle; // Same orientation for blue car
    
    // Initialize physics
    initializePhysics(gameState);
    
    // Setup UI
    gameState.ui = setupUI(gameState);
    
    // Register game loop for collision detection and timing
    scene.registerBeforeRender(() => {
        // Update physics and movement
        updatePhysics(gameState);
        
        // Check if red car is on grass
        gameState.isOnGrass = isCarOnGrass(gameState.car, gameState.trackMesh, gameState.leftGrassMesh, gameState.rightGrassMesh);
        
        // Check if blue car is on grass
        gameState.blueIsOnGrass = isCarOnGrass(gameState.blueCar, gameState.trackMesh, gameState.leftGrassMesh, gameState.rightGrassMesh);
        
        // Update UI with terrain info (display red car's terrain)
        if (gameState.isOnGrass) {
            gameState.ui.terrainInfo.textContent = 'Red Car: Grass (Slower)';
        } else {
            gameState.ui.terrainInfo.textContent = 'Red Car: Track';
        }
        
        // Update speed display with both cars' speeds
        updateSpeedDisplay(gameState.ui.speedDisplay, gameState.carSpeed, gameState.blueCarSpeed);
        
        // Update checkpoint progress
        updateCheckpointProgress(gameState.ui.checkpointProgress, gameState.passedCheckpoints);
        
        // Check for crossing checkpoints (only check red car for simplicity)
        checkpoints.forEach((checkpoint, i) => {
            if (gameState.car.intersectsMesh(checkpoint, false) && 
                !gameState.passedCheckpoints[i] && 
                gameState.startTime && 
                !gameState.finished) {
                
                gameState.passedCheckpoints[i] = true;
                const currentTime = new Date();
                const timeElapsed = ((currentTime - gameState.startTime) / 1000).toFixed(2);
                
                // Play checkpoint sound
                playCheckpointSound();
                
                if (gameState.lastCheckpointTime) {
                    const sectionTime = ((currentTime - gameState.lastCheckpointTime) / 1000).toFixed(2);
                    gameState.ui.lapTimeDisplay.textContent = `Checkpoint ${i+1} passed! Section: ${sectionTime}s - Total: ${timeElapsed}s`;
                } else {
                    gameState.ui.lapTimeDisplay.textContent = `Checkpoint ${i+1} passed! Time: ${timeElapsed}s`;
                }
                
                gameState.lastCheckpointTime = currentTime;
            }
        });
        
        // Check for crossing start line (only check red car for race completion)
        if (gameState.car.intersectsMesh(startLineCollision, false)) {
            if (!gameState.startTime && !gameState.finished) {
                // First crossing: start the timer
                gameState.startTime = new Date();
                gameState.lastCheckpointTime = gameState.startTime;
                gameState.ui.lapTimeDisplay.textContent = 'Go! Complete the track!';
                
                // Play race start sound
                playRaceStartSound();
            } else if (gameState.startTime && !gameState.finished && gameState.passedCheckpoints.every(cp => cp)) {
                // Crossing after all checkpoints: finish the race
                gameState.finished = true;
                const endTime = new Date();
                const lapTime = (endTime - gameState.startTime) / 1000; // in seconds
                
                // Display appropriate message based on lap time
                if (lapTime < 60) {
                    gameState.ui.lapTimeDisplay.textContent = `Finished! Time: ${lapTime.toFixed(2)} seconds`;
                } else {
                    const minutes = Math.floor(lapTime / 60);
                    const seconds = (lapTime % 60).toFixed(2);
                    gameState.ui.lapTimeDisplay.textContent = `Finished! Time: ${minutes}:${seconds.padStart(5, '0')}`;
                }
                
                // Show victory banner
                showVictoryBanner(gameState.ui.victoryBanner, lapTime);
                
                // Setup space bar to restart
                const spaceHandler = (e) => {
                    if (e.code === 'Space' && gameState.finished) {
                        resetRace();
                        window.removeEventListener('keydown', spaceHandler);
                    }
                };
                window.addEventListener('keydown', spaceHandler);
                
                // Reset after 5 seconds for another run
                setTimeout(resetRace, 10000);
            }
        }
    });
    
    return scene;
};

// Create the scene
const scene = createScene();

// Setup keyboard controls
setupControls(gameState);

// Run the render loop
engine.runRenderLoop(function(){
    scene.render();
});

// Resize event handler
window.addEventListener('resize', function(){
    engine.resize();
});

// Add a function to reset the race
function resetRace() {
    // Hide victory banner if visible
    hideVictoryBanner(gameState.ui.victoryBanner);
    
    // Reset red car position to start
    const startPos = gameState.trackPath[0];
    gameState.car.position.x = startPos.x;
    gameState.car.position.z = startPos.z;
    
    // Reset blue car position to start (slightly offset)
    gameState.blueCar.position.x = startPos.x + 2;
    gameState.blueCar.position.z = startPos.z;
    
    // Reset car rotations
    const nextPos = gameState.trackPath[1];
    const direction = nextPos.subtract(startPos);
    const angle = Math.atan2(direction.x, direction.z); // Fix angle calculation
    gameState.car.rotation.y = angle; // Correctly orient red car
    gameState.blueCar.rotation.y = angle; // Correctly orient blue car
    
    // Reset car speeds to zero and stop all movement
    gameState.carSpeed = 0;
    gameState.blueCarSpeed = 0;
    gameState.moveForward = false;
    gameState.moveBackward = false;
    gameState.turnLeft = false;
    gameState.turnRight = false;
    gameState.blueMoveForward = false;
    gameState.blueMoveBackward = false;
    gameState.blueTurnLeft = false;
    gameState.blueTurnRight = false;
    
    // Reset game state
    gameState.finished = false;
    gameState.startTime = null;
    gameState.lastCheckpointTime = null;
    gameState.passedCheckpoints = Array(gameState.checkpoints.length).fill(false);
    gameState.ui.lapTimeDisplay.textContent = 'Cross the start line to begin!';
    
    // Update UI displays
    updateSpeedDisplay(gameState.ui.speedDisplay, gameState.carSpeed, gameState.blueCarSpeed);
    gameState.ui.terrainInfo.textContent = 'Red Car: Track';
    updateCheckpointProgress(gameState.ui.checkpointProgress, gameState.passedCheckpoints);
    
    // Make sure BGM is playing after reset
    playBGM(gameState.ui.bgmAudio);
    
    // Flash the race info panel to indicate restart
    const raceInfoPanel = document.getElementById('raceInfoPanel');
    if (raceInfoPanel) {
        // Quick animation to indicate restart
        raceInfoPanel.animate(
            [
                { backgroundColor: 'rgba(0,150,0,0.7)' },
                { backgroundColor: 'rgba(0,0,0,0.7)' }
            ],
            { 
                duration: 800,
                easing: 'ease-out'
            }
        );
    }
} 