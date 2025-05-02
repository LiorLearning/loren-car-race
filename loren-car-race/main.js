// Main entry point for the racing game

// Import modules
import { setupCamera, setupSplitScreenCameras } from './camera.js';
import { createCar, createBlueCar } from './car.js';
import { createTrack, createEnvironment, isCarOnGrass } from './track.js';
import { setupUI, updateLapTimer, updateSpeedDisplay, updateCheckpointProgress, showVictoryBanner, hideVictoryBanner, showGameModeModal, updateUI } from './ui.js';
import { setupControls } from './controls.js';
import { initializePhysics, updatePhysics } from './physics.js';
import { createAmmoPickups, updateAmmoSystem } from './gameUtils.js';

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
    cameras: null,
    gameMode: null, // 'multiplayer' or 'singleplayer'
    currentPathPoint: 0, // For AI car path following
    lapCount: 0, // Track current lap
    maxLaps: 5, // Maximum number of laps
    raceStarted: false,
    redAmmo: 0,
    blueAmmo: 0,
    ammoPickups: [],
    blueAmmoPickups: [],
    projectiles: [],
    blueProjectiles: [],
    blueCarSpeedDebuff: 0,
    blueCarSpeedDebuffEndTime: 0,
    redCarSpeedDebuff: 0,
    redCarSpeedDebuffEndTime: 0,
    quizActive: false
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
    
    // Create cars
    gameState.car = createCar(scene);
    gameState.blueCar = createBlueCar(scene);
    
    // Position cars at the start of the track
    const startPos = trackPath[0];
    const nextPos = trackPath[1];
    
    // Position red car
    gameState.car.position.x = startPos.x;
    gameState.car.position.z = startPos.z;
    
    // Position blue car directly behind the red car
    const startDirection = nextPos.subtract(startPos);
    startDirection.normalize();
    const offset = 3; // Distance behind red car
    
    gameState.blueCar.position.x = startPos.x - (startDirection.x * offset);
    gameState.blueCar.position.z = startPos.z - (startDirection.z * offset);
    
    // Get direction from first track segment to position cars correctly
    const angle = Math.atan2(startDirection.x, startDirection.z);
    gameState.car.rotation.y = angle;
    gameState.blueCar.rotation.y = angle;
    
    // Setup split-screen cameras
    gameState.cameras = setupSplitScreenCameras(scene, gameState.car, gameState.blueCar, gameState.trackPath);
    
    // Initialize physics
    initializePhysics(gameState);
    
    // Setup UI
    gameState.ui = setupUI(gameState);
    
    // Show game mode selection modal
    showGameModeModal(gameState);
    
    // Create ammo pickups
    gameState.ammoPickups = createAmmoPickups(scene, trackPath, 'red');
    gameState.blueAmmoPickups = createAmmoPickups(scene, trackPath, 'blue');
    
    // Register game loop for collision detection and timing
    scene.registerBeforeRender(() => {
        if (gameState.quizActive) return; // Completely pause game logic during quiz
        
        if (gameState.gameMode) {
            // Update AI car movement in single player mode BEFORE physics update
            if (gameState.gameMode === 'singleplayer' && gameState.raceStarted) {
                updateAICar(gameState);
            }
            
            // Update physics after AI movement is calculated
            if (gameState.raceStarted) {
                updatePhysics(gameState);
            }
        }
        
        // Draw 2D minimap
        draw2DMinimap(gameState);
        
        // Check if red car is on grass
        gameState.isOnGrass = isCarOnGrass(gameState.car, gameState.trackMesh, gameState.leftGrassMesh, gameState.rightGrassMesh);
        
        // Check if blue car is on grass
        gameState.blueIsOnGrass = isCarOnGrass(gameState.blueCar, gameState.trackMesh, gameState.leftGrassMesh, gameState.rightGrassMesh);
        
        // Update UI with terrain info (display red car's terrain)
        if (gameState.ui && gameState.ui.terrainInfo) {
            if (gameState.isOnGrass) {
                gameState.ui.terrainInfo.textContent = 'Red Car: Grass (Slower)';
            } else {
                gameState.ui.terrainInfo.textContent = 'Red Car: Track';
            }
        }
        
        // Update speed display with both cars' speeds
        if (gameState.ui && gameState.ui.speedDisplay) {
            updateSpeedDisplay(gameState.ui.speedDisplay, gameState.carSpeed, gameState.blueCarSpeed);
        }
        
        // Update checkpoint progress
        if (gameState.ui && gameState.ui.checkpointProgress) {
            updateCheckpointProgress(gameState.ui.checkpointProgress, gameState.passedCheckpoints);
        }
        
        // Check for crossing checkpoints
        checkpoints.forEach((checkpoint, i) => {
            if (gameState.car.intersectsMesh(checkpoint, false) && 
                !gameState.passedCheckpoints[i] && 
                gameState.startTime && 
                !gameState.finished) {
                
                gameState.passedCheckpoints[i] = true;
                const currentTime = new Date();
                const timeElapsed = ((currentTime - gameState.startTime) / 1000).toFixed(2);
                
                if (gameState.lastCheckpointTime) {
                    const sectionTime = ((currentTime - gameState.lastCheckpointTime) / 1000).toFixed(2);
                    if (gameState.ui && gameState.ui.lapTimeDisplay) {
                        gameState.ui.lapTimeDisplay.textContent = `Checkpoint ${i+1} passed! Section: ${sectionTime}s - Total: ${timeElapsed}s`;
                    }
                } else {
                    if (gameState.ui && gameState.ui.lapTimeDisplay) {
                        gameState.ui.lapTimeDisplay.textContent = `Checkpoint ${i+1} passed! Time: ${timeElapsed}s`;
                    }
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
                if (gameState.ui && gameState.ui.lapTimeDisplay) {
                    gameState.ui.lapTimeDisplay.textContent = 'Go! Complete the track!';
                }
            } else if (gameState.startTime && !gameState.finished && gameState.passedCheckpoints.every(cp => cp)) {
                // Crossing after all checkpoints: increment lap count
                gameState.lapCount++;
                
                // Update lap display
                if (gameState.ui && gameState.ui.lapTimeDisplay) {
                    gameState.ui.lapTimeDisplay.textContent = `Lap ${gameState.lapCount} / ${gameState.maxLaps}`;
                }
                
                // Reset checkpoints for next lap
                gameState.passedCheckpoints = Array(gameState.checkpoints.length).fill(false);
                
                // Check if race is complete
                if (gameState.lapCount >= gameState.maxLaps) {
                    gameState.finished = true;
                    const endTime = new Date();
                    const lapTime = (endTime - gameState.startTime) / 1000; // in seconds
                    
                    // Display appropriate message based on lap time
                    if (gameState.ui && gameState.ui.lapTimeDisplay) {
                        if (lapTime < 60) {
                            gameState.ui.lapTimeDisplay.textContent = `Finished! Time: ${lapTime.toFixed(2)} seconds`;
                        } else {
                            const minutes = Math.floor(lapTime / 60);
                            const seconds = (lapTime % 60).toFixed(2);
                            gameState.ui.lapTimeDisplay.textContent = `Finished! Time: ${minutes}:${seconds.padStart(5, '0')}`;
                        }
                    }
                    
                    // Show victory banner
                    if (gameState.ui && gameState.ui.victoryBanner) {
                        showVictoryBanner(gameState.ui.victoryBanner, lapTime);
                    }
                    
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
        }
        
        // Update ammo system
        updateAmmoSystem(gameState);
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
    if (gameState.ui && gameState.ui.victoryBanner) {
        hideVictoryBanner(gameState.ui.victoryBanner);
    }
    
    // Reset lap count
    gameState.lapCount = 0;
    
    // Reset red car position to start
    const startPos = gameState.trackPath[0];
    gameState.car.position.x = startPos.x;
    gameState.car.position.z = startPos.z;
    
    // Reset blue car position to start (slightly offset)
    gameState.blueCar.position.x = startPos.x - 3;
    gameState.blueCar.position.z = startPos.z;
    
    // Reset car rotations
    const nextPos = gameState.trackPath[1];
    const direction = nextPos.subtract(startPos);
    const angle = Math.atan2(direction.x, direction.z);
    gameState.car.rotation.y = angle;
    gameState.blueCar.rotation.y = angle;
    
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
    gameState.currentPathPoint = 0; // Reset bot's path index
    
    // Update UI displays
    if (gameState.ui) {
        if (gameState.ui.speedDisplay) {
            updateSpeedDisplay(gameState.ui.speedDisplay, gameState.carSpeed, gameState.blueCarSpeed);
        }
        if (gameState.ui.terrainInfo) {
            gameState.ui.terrainInfo.textContent = 'Red Car: Track';
        }
        if (gameState.ui.checkpointProgress) {
            updateCheckpointProgress(gameState.ui.checkpointProgress, gameState.passedCheckpoints);
        }
    }
    
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

function getNextTrackPoint(path, index) {
    return path[index % path.length];
}

function updateAICar(gameState) {
    const car = gameState.blueCar;
    const path = gameState.trackPath;
    const index = gameState.currentPathPoint;

    if (!car || !path || path.length === 0 || !gameState.car) return;

    const target = getNextTrackPoint(path, index);

    // Calculate vector toward target
    const direction = target.subtract(car.position);
    direction.y = 0;
    const distance = direction.length();

    // If close enough, move to next path point
    if (distance < 4) {
        gameState.currentPathPoint = (index + 1) % path.length;
        return;
    }

    // Normalize and face exactly toward the direction
    const angle = Math.atan2(direction.x, direction.z);
    car.rotation.y = angle;

    // Find the closest path point to the red car
    let redCarPathIndex = 0;
    let minDistance = Infinity;
    for (let i = 0; i < path.length; i++) {
        const dist = BABYLON.Vector3.Distance(gameState.car.position, path[i]);
        if (dist < minDistance) {
            minDistance = dist;
            redCarPathIndex = i;
        }
    }

    // Calculate how far ahead/behind the blue car is on the track
    const pathLength = path.length;
    const blueIndex = gameState.currentPathPoint;
    let pathDistance = (redCarPathIndex - blueIndex + pathLength) % pathLength;
    
    // Use a larger window for speed adjustments (3/4 of the track)
    const windowSize = pathLength * 0.75;
    const halfWindow = windowSize / 2;
    
    // Use higher base speed and adjust speed factors
    let moveStep = 1.2; // Increased base speed from 0.8 to 1.2
    
    if (pathDistance > pathLength - halfWindow) {
        // Blue car is ahead, slow down less aggressively
        const speedFactor = 1 - ((pathDistance - (pathLength - halfWindow)) / halfWindow) * 0.3; // Reduced slowdown from 40% to 30%
        moveStep *= speedFactor;
    }

    // Step forward at adjusted speed
    const forward = new BABYLON.Vector3(Math.sin(angle), 0, Math.cos(angle));
    car.position.addInPlace(forward.scale(moveStep));

    // Set visible speed for UI
    gameState.blueCarSpeed = moveStep;
}

// Add 2D minimap drawing function
function draw2DMinimap(gameState) {
    const canvas = document.getElementById('minimap2D');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const scale = 4; // Scale factor for world coordinates to minimap pixels
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw track outline
    if (gameState.trackPath) {
        ctx.beginPath();
        ctx.strokeStyle = '#666666';
        ctx.lineWidth = 2;
        
        // Draw the track path
        for (let i = 0; i < gameState.trackPath.length; i++) {
            const point = gameState.trackPath[i];
            const x = centerX + point.x / scale;
            const y = centerY + point.z / scale;
            
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        
        // Close the loop
        const firstPoint = gameState.trackPath[0];
        ctx.lineTo(centerX + firstPoint.x / scale, centerY + firstPoint.z / scale);
        ctx.stroke();
    }
    
    // Draw red car
    if (gameState.car) {
        const redX = centerX + gameState.car.position.x / scale;
        const redY = centerY + gameState.car.position.z / scale;
        
        // Draw direction triangle
        ctx.save();
        ctx.translate(redX, redY);
        ctx.rotate(gameState.car.rotation.y);
        
        ctx.beginPath();
        ctx.fillStyle = '#ff0000';
        ctx.moveTo(0, -5);
        ctx.lineTo(-3, 5);
        ctx.lineTo(3, 5);
        ctx.closePath();
        ctx.fill();
        
        ctx.restore();
    }
    
    // Draw blue car
    if (gameState.blueCar) {
        const blueX = centerX + gameState.blueCar.position.x / scale;
        const blueY = centerY + gameState.blueCar.position.z / scale;
        
        // Draw direction triangle
        ctx.save();
        ctx.translate(blueX, blueY);
        ctx.rotate(gameState.blueCar.rotation.y);
        
        ctx.beginPath();
        ctx.fillStyle = '#0000ff';
        ctx.moveTo(0, -5);
        ctx.lineTo(-3, 5);
        ctx.lineTo(3, 5);
        ctx.closePath();
        ctx.fill();
        
        ctx.restore();
    }
}

// Add race start function
function startRace(gameState) {
    // Show countdown
    showCountdown(gameState.ui.countdownDisplay, () => {
        // Race starts after countdown
        gameState.raceStarted = true;
    });
}

// Create projectile
function createProjectile(scene, position, direction) {
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