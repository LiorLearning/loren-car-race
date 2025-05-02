# Babylon.js 3D Racing Game

A modular 3D racing game built with Babylon.js, featuring a car, a long track with slight curves, and a finish line.

## How to Play

1. Open `index.html` in a web browser (Chrome, Firefox, Edge, or Safari)
2. Use the following controls to drive the car:
   - W or Up Arrow: Accelerate
   - S or Down Arrow: Brake/Reverse
   - A or Left Arrow: Turn Left
   - D or Right Arrow: Turn Right
3. Drive through the checkpoints in sequence and cross the finish line to record your lap time
4. Try to improve your time with each run!

## Features

- 3D car with realistic physics (acceleration, deceleration, and turning)
- Very long track with slight curves and challenging sections
- Start/finish line with lap timing
- Multiple checkpoints along the track for progress tracking
- Follow camera that stays behind the car with mini-map for better orientation
- Different terrain types that affect speed:
  - **Track**: Normal speed
  - **Grass**: 50% slower
- Enhanced UI with:
  - Real-time speed display
  - Checkpoint progress tracker
  - Section times between checkpoints
  - Total race time
- Boundary walls to keep the car in the play area

## Track Layout

The track is designed with multiple sections:
```
<wall> <grass> <track> <grass> <wall>
```

Where:
- **Track**: The main racing surface (fastest speed)
- **Grass**: Surrounds the track (50% slower)
- **Walls**: Form the outer boundaries to keep players on the course

## Technical Details

This game uses:
- Babylon.js for 3D rendering and physics
- Modern JavaScript ES modules for organized, modular code
- HTML5 Canvas for rendering

The code is organized into several modules:
- `main.js` - Entry point that initializes the game
- `camera.js` - Camera setup and handling with mini-map view
- `car.js` - Car creation and handling
- `track.js` - Track and environment creation
- `ui.js` - Enhanced UI elements and timing displays
- `controls.js` - Keyboard and input handling
- `physics.js` - Physics calculations and movement

## Running the Game

No installation or build process required - just open the HTML file in a browser that supports ES modules!

## License

Free to use and modify. 