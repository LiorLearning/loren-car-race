// Track module for the racing game

/**
 * Creates the environment including lights and ground
 * @param {BABYLON.Scene} scene - The Babylon.js scene
 */
export function createEnvironment(scene) {
    // Add ambient light
    const ambientLight = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), scene);
    ambientLight.intensity = 0.7;

    // Add directional light (sun)
    const directionalLight = new BABYLON.DirectionalLight('directionalLight', new BABYLON.Vector3(-1, -2, -1), scene);
    directionalLight.position = new BABYLON.Vector3(20, 40, 20);
    directionalLight.intensity = 0.7;
    
    // Create ground - much larger to accommodate the long track
    const ground = BABYLON.MeshBuilder.CreateGround('ground', {width: 1200, height: 400}, scene);
    const groundMaterial = new BABYLON.StandardMaterial('groundMat', scene);
    groundMaterial.diffuseColor = new BABYLON.Color3(0.2, 0.6, 0.2); // Green grass
    ground.material = groundMaterial;
    ground.receiveShadows = true;
}

/**
 * Creates the race track with checkpoints and finish line
 * @param {BABYLON.Scene} scene - The Babylon.js scene
 * @param {BABYLON.Mesh} car - The car mesh for collisions
 * @returns {Object} Object containing track path, checkpoints, and start line collision
 */
export function createTrack(scene, car) {
    // Track dimensions
    const trackWidth = 16;
    const grassWidth = 8; // Same width as track
    
    // Generate track path
    const { trackPath, leftTrackPath, rightTrackPath, leftGrassPath, rightGrassPath } = generateTrackPath(trackWidth, grassWidth);
    
    // Create track mesh
    const trackMesh = createTrackMesh(scene, leftTrackPath, rightTrackPath);
    
    // Create grass areas
    const leftGrassMesh = createGrassMesh(scene, leftTrackPath, leftGrassPath, 'leftGrass');
    const rightGrassMesh = createGrassMesh(scene, rightTrackPath, rightGrassPath, 'rightGrass');
    
    // Create barriers
    createBarriers(scene, leftGrassPath, rightGrassPath);
    
    // Create finish line and collider
    const startLineCollision = createFinishLine(scene, trackPath);
    
    // Create checkpoints
    const checkpoints = createCheckpoints(scene, trackPath);
    
    return {
        trackPath,
        trackMesh,
        leftGrassMesh,
        rightGrassMesh,
        checkpoints,
        startLineCollision
    };
}

/**
 * Generates the track path with curves
 * @param {number} trackWidth - Width of the track
 * @param {number} grassWidth - Width of the grass areas
 * @returns {Object} Object containing the main track path and left/right edges for track and grass
 */
function generateTrackPath(trackWidth, grassWidth) {
    const trackPath = [];
    const trackPointCount = 500; // More points for a smoother circle
    
    // Create a circular track
    const radius = 200;
    
    for (let i = 0; i <= trackPointCount; i++) {
        const angle = (i / trackPointCount) * 2 * Math.PI;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        trackPath.push(new BABYLON.Vector3(
            x, 
            0.01, // Slightly above ground
            z
        ));
    }
    
    // Calculate track edges
    const leftTrackPath = [];
    const rightTrackPath = [];
    const leftGrassPath = [];
    const rightGrassPath = [];
    
    // Create left and right edges of the track and grass
    for (let i = 0; i < trackPath.length; i++) {
        const current = trackPath[i];
        let next, tangent, normal;
        
        if (i < trackPath.length - 1) {
            next = trackPath[i + 1];
            tangent = next.subtract(current).normalize();
        } else {
            next = trackPath[0];
            tangent = next.subtract(current).normalize();
        }
        
        // Calculate normal vector (perpendicular to tangent)
        normal = new BABYLON.Vector3(tangent.z, 0, -tangent.x).normalize();
        
        // Create track edges
        leftTrackPath.push(current.add(normal.scale(trackWidth / 2)));
        rightTrackPath.push(current.subtract(normal.scale(trackWidth / 2)));
        
        // Create grass edges (outside track edges)
        leftGrassPath.push(current.add(normal.scale((trackWidth + grassWidth) / 2)));
        rightGrassPath.push(current.subtract(normal.scale((trackWidth + grassWidth) / 2)));
    }
    
    return { trackPath, leftTrackPath, rightTrackPath, leftGrassPath, rightGrassPath };
}

/**
 * Creates the track mesh from the path data
 * @param {BABYLON.Scene} scene - The Babylon.js scene
 * @param {Array} leftTrackPath - Left edge path points
 * @param {Array} rightTrackPath - Right edge path points
 * @returns {BABYLON.Mesh} The created track mesh
 */
function createTrackMesh(scene, leftTrackPath, rightTrackPath) {
    // Create mesh for the track
    const trackData = [];
    for (let i = 0; i < leftTrackPath.length; i++) {
        trackData.push([leftTrackPath[i], rightTrackPath[i]]);
    }
    
    const track = BABYLON.MeshBuilder.CreateRibbon('track', {
        pathArray: trackData,
        sideOrientation: BABYLON.Mesh.DOUBLESIDE
    }, scene);
    
    const trackMaterial = new BABYLON.StandardMaterial('trackMat', scene);
    trackMaterial.diffuseColor = new BABYLON.Color3(0.3, 0.3, 0.3); // Dark gray asphalt
    track.material = trackMaterial;
    
    return track;
}

/**
 * Creates the grass area mesh
 * @param {BABYLON.Scene} scene - The Babylon.js scene
 * @param {Array} trackEdgePath - The track edge path
 * @param {Array} grassEdgePath - The grass edge path
 * @param {string} name - The name for the mesh
 * @returns {BABYLON.Mesh} The created grass mesh
 */
function createGrassMesh(scene, trackEdgePath, grassEdgePath, name) {
    const grassData = [];
    for (let i = 0; i < trackEdgePath.length; i++) {
        grassData.push([trackEdgePath[i], grassEdgePath[i]]);
    }
    
    const grass = BABYLON.MeshBuilder.CreateRibbon(name, {
        pathArray: grassData,
        sideOrientation: BABYLON.Mesh.DOUBLESIDE
    }, scene);
    
    const grassMaterial = new BABYLON.StandardMaterial(name + 'Mat', scene);
    grassMaterial.diffuseColor = new BABYLON.Color3(0.4, 0.8, 0.4); // Brighter green for grass
    grass.material = grassMaterial;
    
    return grass;
}

/**
 * Creates barriers along the track edges
 * @param {BABYLON.Scene} scene - The Babylon.js scene
 * @param {Array} leftGrassPath - Left outer edge path points
 * @param {Array} rightGrassPath - Right outer edge path points
 */
function createBarriers(scene, leftGrassPath, rightGrassPath) {
    const barrierHeight = 1.5;
    const barrierMaterial = new BABYLON.StandardMaterial('barrierMat', scene);
    barrierMaterial.diffuseColor = new BABYLON.Color3(0.8, 0.8, 0.8); // Light gray
    
    // Place barrier segments along the outer edges (grass boundaries)
    for (let i = 0; i < leftGrassPath.length - 1; i += 5) { // Add barriers every few segments
        // Left barrier segment
        const leftStart = leftGrassPath[i];
        const leftEnd = leftGrassPath[i + 1];
        const leftMid = leftStart.add(leftEnd).scale(0.5);
        const leftDir = leftEnd.subtract(leftStart);
        const leftLength = leftDir.length();
        const leftBarrier = BABYLON.MeshBuilder.CreateBox('leftBarrier' + i, 
            {width: 0.5, height: barrierHeight, depth: leftLength + 0.1}, scene);
        leftBarrier.position = new BABYLON.Vector3(leftMid.x, barrierHeight/2, leftMid.z);
        
        // Rotate to align with track
        const leftAngle = Math.atan2(leftDir.z, leftDir.x) - Math.PI/2;
        leftBarrier.rotation.y = leftAngle;
        leftBarrier.material = barrierMaterial;
        
        // Right barrier segment
        const rightStart = rightGrassPath[i];
        const rightEnd = rightGrassPath[i + 1];
        const rightMid = rightStart.add(rightEnd).scale(0.5);
        const rightDir = rightEnd.subtract(rightStart);
        const rightLength = rightDir.length();
        const rightBarrier = BABYLON.MeshBuilder.CreateBox('rightBarrier' + i, 
            {width: 0.5, height: barrierHeight, depth: rightLength + 0.1}, scene);
        rightBarrier.position = new BABYLON.Vector3(rightMid.x, barrierHeight/2, rightMid.z);
        
        // Rotate to align with track
        const rightAngle = Math.atan2(rightDir.z, rightDir.x) - Math.PI/2;
        rightBarrier.rotation.y = rightAngle;
        rightBarrier.material = barrierMaterial;
    }
}

/**
 * Creates the finish line and collision detection
 * @param {BABYLON.Scene} scene - The Babylon.js scene
 * @param {Array} trackPath - The track path points
 * @returns {BABYLON.Mesh} The finish line collision mesh
 */
function createFinishLine(scene, trackPath) {
    const trackWidth = 8;
    
    // Create start/finish line at the beginning of the track
    const finishLine = BABYLON.MeshBuilder.CreateGround('finishLine', {width: trackWidth, height: 3}, scene);
    const startPos = trackPath[0];
    finishLine.position = new BABYLON.Vector3(startPos.x, 0.02, startPos.z);
    
    // Rotate finish line to align with track direction
    const finishDir = trackPath[1].subtract(trackPath[0]);
    const finishAngle = Math.atan2(finishDir.z, finishDir.x) - Math.PI/2;
    finishLine.rotation.y = finishAngle;
    
    const finishMaterial = new BABYLON.StandardMaterial('finishMat', scene);
    finishMaterial.diffuseTexture = new BABYLON.Texture('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAAICAYAAABJRVcDAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QA/wD/AP+gvaeTAAAAB3RJTUUH4AoTER8k9GxngwAAA19JREFUSMe1lk1IVFEUx//n3vfmOeqMoz6NuIiK5qP8yMVQRC7MjYooCC0KIjJaGERFUAhFtYigndCiKKJoUx9EREVEUGS0iKIviiLIqHH0OaPzZvTNvafFnTfzRmecGTtwNu+ee37nd8655/4JOYaUcmR7e3vn1q1bWymBBADV1dWptqkGxsQYkxDCcP8qn24DY8ySUh5esmRJmzsGoMkdI9cJhULpcDj8XSVR/HCYTCZjHR0d4v3ncaO5tZfCkRAREUpySvFtMaWrA3rk4WAgYIm3LpdgWRVKfLk4YsWUeLZoH8qWRiM/e0XlgdlKJOLrqxWZWbkkGV9lGRKDEZrxGVYdXGSphQWo4rwEU1PTVFdXR5FIBDnnPZwzP41Go/T58xf6ExukWbNmJSKRSJaAeVJT0wK7aW7+lLbvfkPzygsomUhQb28vlZSUUIqEYzXGGKmsrJQYY9QfoaS/AIZluC1NB7JVP4NVV69eqWVWIBCoHhoaSjqOQ5zzjwBu5nJ48uTJR7q6usYQDUQg1K+Yc3YnJyfnAqB4PL5nZGTkrBcTQlwMBoM9QggcPHgcxhjLs7EQwlu7h8rLy+uchbTYcRSWLCmlZNLxpEQiIeBTgwZjqKmpoa6uLnIcZ60bFY7jrN61a9e+xsbGkzU1NcGGhoYDROQUi0XXWpY1qwgO1c3NzZvdbfO6p6enxrbtMbsQ4lksFtuglHoA4KcQ4vckaQWApuPHj5+eMWOGKiqAiEgpJS2aaQV91B/Ru2rVigXpdFoopfo553dN0zyWy/D+/ft7AZz3IgaAVCr1MBAI3HO3t1taWlr6WltboZRCKBTaN5kvgFf19fVP8/aNAK4SKcgcKAVIJdHT00Otra00PDy8AoBjGMYFGytjY2Mil0kqlZrj9/vDExWCMdb64sWLZiIC5/y1EOKTZVlzxn0ZY8nz58/fz/EDgGGfDo6CZTtGxtJMHFJJfSoiBAIBam9vp8bGRmpubn7FGCsYpRfpdHrIsqyuAts/RPTFzZ3wvRsIBPw+n89oamq6Mf6KM8ZWABgFMADgA4AuzjkbP9YTAHYDaHA/8Uc3rr/q6upOXL582QQAHWdDXmlsbHzh2fxoaGjYM9E4IoIzKSNgIcMYuqtSvXr+/MU1IQQJIR47jrOeZcpswJtEJv0r/G/iHyvdZhJpYzVsAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDE2LTEwLTE5VDE3OjMxOjM2KzAzOjAwPBvGHgAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxNi0xMC0xOVQxNzozMTozNiswMzowME1Gfq4AAAAASUVORK5CYII=', scene);
    finishMaterial.diffuseTexture.uScale = 8; // Bigger pattern
    finishLine.material = finishMaterial;

    // Add finish line collision detection
    const finishLineCollider = BABYLON.MeshBuilder.CreateBox('finishLineCollider', 
        {width: trackWidth, height: 3, depth: 0.1}, scene);
    finishLineCollider.position = finishLine.position.clone();
    finishLineCollider.rotation.y = finishAngle;
    finishLineCollider.position.y = 1.5; // Set height to detect car collision
    finishLineCollider.isVisible = false; // Make it invisible
    finishLineCollider.checkCollisions = true;
    
    // Create start/finish markers (pillars)
    createStartFinishMarkers(scene, finishLine, trackWidth, finishAngle);
    
    return finishLineCollider;
}

/**
 * Creates decorative markers for the start/finish line
 * @param {BABYLON.Scene} scene - The Babylon.js scene
 * @param {BABYLON.Mesh} finishLine - The finish line mesh
 * @param {number} trackWidth - Width of the track
 * @param {number} angle - Rotation angle to align with track
 */
function createStartFinishMarkers(scene, finishLine, trackWidth, angle) {
    const pillarHeight = 5;
    
    // Create a pair of pillars
    const leftPillar = BABYLON.MeshBuilder.CreateCylinder('leftStartPillar', {
        height: pillarHeight,
        diameter: 0.8,
        tessellation: 12
    }, scene);
    
    const rightPillar = BABYLON.MeshBuilder.CreateCylinder('rightStartPillar', {
        height: pillarHeight,
        diameter: 0.8,
        tessellation: 12
    }, scene);
    
    // Position pillars on either side of the track
    const normal = new BABYLON.Vector3(Math.sin(angle), 0, Math.cos(angle));
    
    leftPillar.position = new BABYLON.Vector3(
        finishLine.position.x + normal.x * (trackWidth/2 + 0.5),
        pillarHeight/2,
        finishLine.position.z + normal.z * (trackWidth/2 + 0.5)
    );
    
    rightPillar.position = new BABYLON.Vector3(
        finishLine.position.x - normal.x * (trackWidth/2 + 0.5),
        pillarHeight/2,
        finishLine.position.z - normal.z * (trackWidth/2 + 0.5)
    );
    
    // Add materials
    const pillarMaterial = new BABYLON.StandardMaterial('pillarMat', scene);
    pillarMaterial.diffuseColor = new BABYLON.Color3(0.9, 0.1, 0.1); // Red pillars
    leftPillar.material = pillarMaterial;
    rightPillar.material = pillarMaterial;
    
    // Add banner/finish flag between pillars
    const banner = BABYLON.MeshBuilder.CreateBox('finishBanner', {
        width: trackWidth + 2,
        height: 1.5,
        depth: 0.1
    }, scene);
    
    banner.position = new BABYLON.Vector3(
        finishLine.position.x,
        pillarHeight - 0.8,
        finishLine.position.z
    );
    banner.rotation.y = angle;
    
    const bannerMaterial = new BABYLON.StandardMaterial('bannerMat', scene);
    bannerMaterial.diffuseColor = new BABYLON.Color3(0.1, 0.1, 0.1); // Dark background
    
    // Add text texture to banner
    const dynamicTexture = new BABYLON.DynamicTexture('bannerTexture', {width: 512, height: 128}, scene);
    dynamicTexture.hasAlpha = true;
    
    // Draw text on dynamic texture
    const ctx = dynamicTexture.getContext();
    ctx.clearRect(0, 0, 512, 128);
    ctx.fillStyle = 'white';
    ctx.font = 'bold 60px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('START / FINISH', 256, 64);
    
    dynamicTexture.update();
    bannerMaterial.diffuseTexture = dynamicTexture;
    banner.material = bannerMaterial;
}

/**
 * Creates checkpoints along the track
 * @param {BABYLON.Scene} scene - The Babylon.js scene
 * @param {Array} trackPath - The track path points
 * @returns {Array} Array of checkpoint meshes
 */
function createCheckpoints(scene, trackPath) {
    const checkpoints = [];
    
    // Select points along the track to place checkpoints
    // For a long track, place more checkpoints at sensible intervals
    const checkpointIndices = [
        Math.floor(trackPath.length * 0.10),  // 10% of the track
        Math.floor(trackPath.length * 0.25),  // 25% of the track
        Math.floor(trackPath.length * 0.40),  // 40% of the track
        Math.floor(trackPath.length * 0.55),  // 55% of the track
        Math.floor(trackPath.length * 0.70),  // 70% of the track
        Math.floor(trackPath.length * 0.85),  // 85% of the track
    ];
    
    const trackWidth = 8;
    const checkpointHeight = 6;
    
    // Create checkpoints at selected positions
    checkpointIndices.forEach((index, i) => {
        const checkpointPos = trackPath[index];
        
        // Create checkpoint portal
        const checkpoint = new BABYLON.MeshBuilder.CreateBox('checkpoint' + i, 
            {width: trackWidth + 4, height: checkpointHeight, depth: 0.5}, scene);
        checkpoint.position = new BABYLON.Vector3(checkpointPos.x, checkpointHeight/2, checkpointPos.z);
        
        // Orient checkpoint perpendicular to track direction
        if (index < trackPath.length - 1) {
            const dir = trackPath[index + 1].subtract(checkpointPos);
            const angle = Math.atan2(dir.z, dir.x) - Math.PI/2;
            checkpoint.rotation.y = angle;
        } else {
            const dir = checkpointPos.subtract(trackPath[index - 1]);
            const angle = Math.atan2(dir.z, dir.x) - Math.PI/2;
            checkpoint.rotation.y = angle;
        }
        
        // Create checkpoint material
        const checkpointMaterial = new BABYLON.StandardMaterial('checkpointMat' + i, scene);
        checkpointMaterial.diffuseColor = new BABYLON.Color3(0.3, 0.3, 1.0); // Blue
        checkpointMaterial.alpha = 0.3; // Transparent
        checkpoint.material = checkpointMaterial;
        
        checkpoints.push(checkpoint);
    });
    
    return checkpoints;
}

/**
 * Check if car is on grass and adjust speed
 * @param {BABYLON.Mesh} car - The car mesh
 * @param {BABYLON.Mesh} trackMesh - Track mesh
 * @param {BABYLON.Mesh} leftGrassMesh - Left grass mesh
 * @param {BABYLON.Mesh} rightGrassMesh - Right grass mesh
 * @returns {boolean} Whether the car is on grass
 */
export function isCarOnGrass(car, trackMesh, leftGrassMesh, rightGrassMesh) {
    // Get car position
    const carPos = car.position;
    
    // Simple raycast to check if car is on track or grass
    const ray = new BABYLON.Ray(
        new BABYLON.Vector3(carPos.x, carPos.y + 1, carPos.z),
        new BABYLON.Vector3(0, -1, 0),
        2
    );
    
    // Check if ray hits track
    const trackHit = trackMesh.intersects(ray);
    
    if (trackHit) {
        return false; // Car is on track
    }
    
    // Check if ray hits either grass area
    const leftGrassHit = leftGrassMesh.intersects(ray);
    const rightGrassHit = rightGrassMesh.intersects(ray);
    
    return (leftGrassHit || rightGrassHit); // Car is on grass
} 