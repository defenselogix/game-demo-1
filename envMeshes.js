function _array_like_to_array(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}
function _array_without_holes(arr) {
    if (Array.isArray(arr)) return _array_like_to_array(arr);
}
function _iterable_to_array(iter) {
    if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}
function _non_iterable_spread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _to_consumable_array(arr) {
    return _array_without_holes(arr) || _iterable_to_array(arr) || _unsupported_iterable_to_array(arr) || _non_iterable_spread();
}
function _unsupported_iterable_to_array(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _array_like_to_array(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(n);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _array_like_to_array(o, minLen);
}
import * as THREE from 'three';
import { createSeabedMaterial } from './seabedMaterial.js';
import { TANK_DIMENSIONS } from './utilsTankConstants.js';
import { createWaterMaterial } from './waterMaterial.js'; // Import the water material creator
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';
/**
 * Procedurally builds the fish tank environment as a THREE.Group.
 * Uses TANK_DIMENSIONS for consistent sizing with physics and water level.
 * @param {Object} [opts]
 * @param {boolean} [opts.includeSeabed=true] – omit sand mounds when false.
 * @returns {THREE.Group}
 */ // --- Aquarium glass material ---
// Moved outside TankGroup function to fix export scope error
export var glassMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    metalness: 0,
    roughness: 0,
    transparent: true,
    opacity: 0.10,
    transmission: 1,
    thickness: 0,
    ior: 1.05,
    envMapIntensity: 1,
    clearcoat: 1,
    clearcoatRoughness: 0,
    side: THREE.DoubleSide,
    depthWrite: false // Revert: Disable depth writing for glass to fix water rendering
});
export function TankGroup() {
    var opts = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    var _opts_includeSeabed = opts.includeSeabed, includeSeabed = _opts_includeSeabed === void 0 ? true : _opts_includeSeabed; // Default to true to enable seabed
    var group = new THREE.Group();
    // Use TANK_DIMENSIONS for consistent sizing
    var tankWidth = TANK_DIMENSIONS.width;
    var tankHeight = TANK_DIMENSIONS.height;
    var tankDepth = TANK_DIMENSIONS.depth;
    var wallThickness = TANK_DIMENSIONS.wallThickness;
    // const glassColor = 0xadd8e6; // Light blue tint - No longer needed? Keep for potential future use.
    // const sandColor = 0xc2b280; // Sandy color - Not used directly
    // Removed procedural noise texture creation
    // Pearl-white sand material from shader
    var sandMaterial = createSeabedMaterial(); // Restore usage
    // const sandMaterial = new THREE.MeshStandardMaterial({ color: 0xc2b280 }); // Remove placeholder
    // Use the shader material for all sand elements
    // --- Geometries ---
    // --- Calculate Derived Values ---
    var halfWidth = tankWidth / 2;
    var halfHeight = tankHeight / 2;
    var halfDepth = tankDepth / 2;
    var halfWallThickness = wallThickness / 2;
    // Center Y position for walls, considering the tank's base is at TANK_DIMENSIONS.minY
    var wallCenterY = TANK_DIMENSIONS.minY + halfHeight;
    // --- Seabed ---
    // Create uneven seabed, positioning it relative to the tank's bottom (minY)
    // createUnevenSeabed(…) previously ran unconditionally
    if (includeSeabed) {
        createUnevenSeabed(tankWidth, tankDepth, TANK_DIMENSIONS.minY, wallThickness, sandMaterial, group);
    }
    // --- Seabed Floor Plane ---
    var seabedBaseY = TANK_DIMENSIONS.minY + wallThickness; // Position slightly above tank bottom collider
    var floorGeo = new THREE.PlaneGeometry(tankWidth, tankDepth);
    var floorMesh = new THREE.Mesh(floorGeo, sandMaterial);
    floorMesh.rotation.x = -Math.PI / 2; // Rotate to lie flat
    floorMesh.position.y = seabedBaseY - 0.01; // Position just below the mound bases
    floorMesh.receiveShadow = true; // Allow floor to receive shadows
    group.add(floorMesh);
    // --- Walls (using BoxGeometry for simplicity and thickness) ---
    // Front Wall
    var frontWallGeo = new THREE.BoxGeometry(tankWidth, tankHeight, wallThickness);
    var frontWallMesh = new THREE.Mesh(frontWallGeo, glassMaterial); // Uses the exported glassMaterial
    frontWallMesh.position.z = halfDepth - halfWallThickness; // Outer edge
    frontWallMesh.position.y = wallCenterY; // Centered vertically based on TANK_DIMENSIONS
    frontWallMesh.castShadow = true;
    group.add(frontWallMesh);
    // Back Wall
    var backWallMesh = frontWallMesh.clone(); // Clone uses the same material reference
    backWallMesh.position.z = -halfDepth + halfWallThickness; // Outer edge
    group.add(backWallMesh);
    // Left Wall
    // Adjust geometry depth to account for front/back walls thickness
    var sideWallDepth = tankDepth - wallThickness * 2;
    var leftWallGeo = new THREE.BoxGeometry(wallThickness, tankHeight, sideWallDepth);
    var leftWallMesh = new THREE.Mesh(leftWallGeo, glassMaterial); // Uses the exported glassMaterial
    leftWallMesh.position.x = -halfWidth + halfWallThickness; // Outer edge
    leftWallMesh.position.y = wallCenterY; // Centered vertically
    leftWallMesh.castShadow = true;
    group.add(leftWallMesh);
    // Right Wall
    var rightWallMesh = leftWallMesh.clone(); // Clone uses the same material reference
    rightWallMesh.position.x = halfWidth - halfWallThickness; // Outer edge
    group.add(rightWallMesh);
    // --- Optional: Add some water volume indication (can be complex) ---
    // For now, the glass implies the volume.
    /* ---------- Decorations ---------- */ // Create unique materials for each rock with more natural colors and properties
    var rockMaterial1 = new THREE.MeshStandardMaterial({
        color: 0x606060,
        roughness: 0.9,
        metalness: 0.1
    });
    var rockMaterial2 = new THREE.MeshStandardMaterial({
        color: 0x707070,
        roughness: 0.8,
        metalness: 0.15
    });
    var rockMaterial3 = new THREE.MeshStandardMaterial({
        color: 0x808080,
        roughness: 0.75,
        metalness: 0.05
    });
    // Use TetrahedronGeometry for more varied, pointy rock shapes
    var rockGeo1 = new THREE.TetrahedronGeometry(0.3, 1); // radius, detail (level 1 for some complexity)
    var rock1 = new THREE.Mesh(rockGeo1, rockMaterial1);
    // Position rocks relative to the tank bottom (minY + wallThickness)
    var rockBaseY = TANK_DIMENSIONS.minY + wallThickness;
    rock1.position.set(-tankWidth * 0.2, rockBaseY + 0.15, -tankDepth * 0.15);
    rock1.rotation.set(Math.random() * Math.PI * 2, Math.random() * Math.PI * 2, Math.random() * Math.PI * 2);
    rock1.castShadow = true;
    rock1.receiveShadow = true;
    group.add(rock1);
    var rockGeo2 = new THREE.TetrahedronGeometry(0.5, 2); // radius, detail (level 2 for more faces)
    var rock2 = new THREE.Mesh(rockGeo2, rockMaterial2);
    rock2.position.set(0, rockBaseY + 0.25, 0 // Centered Z
    );
    rock2.rotation.set(Math.random() * Math.PI * 2, Math.random() * Math.PI * 2, Math.random() * Math.PI * 2);
    rock2.castShadow = true;
    rock2.receiveShadow = true;
    group.add(rock2);
    var rockGeo3 = new THREE.TetrahedronGeometry(0.2, 0); // radius, detail (level 0 for sharpest points)
    var rock3 = new THREE.Mesh(rockGeo3, rockMaterial3);
    rock3.position.set(tankWidth * 0.1, rockBaseY + 0.1, tankDepth * 0.1);
    rock3.rotation.set(Math.random() * Math.PI * 2, Math.random() * Math.PI * 2, Math.random() * Math.PI * 2);
    rock3.castShadow = true;
    rock3.receiveShadow = true;
    group.add(rock3);
    /* ---------- end decorations ---------- */ // --- Water Volume ---
    var waterHeight = tankHeight * 0.9; // Fill tank 90% visually
    var waterTopY = TANK_DIMENSIONS.minY + waterHeight;
    var waterCenterY = TANK_DIMENSIONS.minY + waterHeight / 2;
    var waterMesh = createWaterBox({
        width: tankWidth - wallThickness * 2,
        height: waterHeight,
        depth: tankDepth - wallThickness * 2,
        positionY: waterCenterY // Center the water volume vertically
    });
    waterMesh.name = "WaterVolume"; // Name it for easier debugging/selection
    // Adjust the color of this specific water volume material instance
    waterMesh.material.color.set(0x87CEEB); // Set to Sky Blue
    group.add(waterMesh);
    group.name = "Tank Meshes Group"; // Name the inner group for debugging
    return group;
}
/**
 * Creates a procedural sand texture using noise patterns
 * @returns {THREE.Texture} The generated texture
 */ function createSandTexture() {
    // Create a canvas for the sand texture
    var canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    var ctx = canvas.getContext('2d');
    // Fill with base sand color
    ctx.fillStyle = '#c2b280';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // Add noise pattern with small grains
    var grainCount = 10000;
    for(var i = 0; i < grainCount; i++){
        // Random position
        var x = Math.random() * canvas.width;
        var y = Math.random() * canvas.height;
        // Random size (small)
        var size = Math.random() * 2 + 0.5;
        // Random shade variation
        var shade = Math.random() * 30 - 15; // -15 to +15
        var color = shade > 0 ? "rgba(220, 200, 160, ".concat(Math.random() * 0.3 + 0.1, ")") // Lighter spots
         : "rgba(160, 140, 100, ".concat(Math.random() * 0.3 + 0.1, ")"); // Darker spots
        // Draw grain
        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
    }
    // Add some larger patches/variations
    for(var i1 = 0; i1 < 30; i1++){
        var x1 = Math.random() * canvas.width;
        var y1 = Math.random() * canvas.height;
        var radius = Math.random() * 30 + 10;
        var alpha = Math.random() * 0.1 + 0.05;
        // Random light/dark patch
        var patchColor = Math.random() > 0.5 ? "rgba(210, 190, 150, ".concat(alpha, ")") : "rgba(170, 150, 120, ".concat(alpha, ")");
        ctx.beginPath();
        ctx.fillStyle = patchColor;
        ctx.arc(x1, y1, radius, 0, Math.PI * 2);
        ctx.fill();
    }
    // Create and return texture
    var texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(2, 2); // Repeat the texture
    return texture;
}
/**
 * Creates an uneven seabed using sand mounds.
 * @param {number} tankWidth - The width of the tank (X-axis).
 * @param {number} tankDepth - The depth of the tank (Z-axis).
 * @param {number} tankBottomY - The Y-coordinate of the tank floor.
 * @param {number} wallThickness - Thickness of walls (used to determine seabed base).
 * @param {THREE.Material} sandMaterial - Material for the sand mounds.
 * @param {THREE.Group} group - The THREE.Group to add the seabed meshes to.
 */ function createUnevenSeabed(tankWidth, tankDepth, tankBottomY, wallThickness, sandMaterial, group) {
    // Determine the base Y level for the mounds (slightly above the tank bottom collider)
    var seabedBaseY = tankBottomY + wallThickness; // Mounds sit on top of the conceptual 'floor' thickness
    // Use a unified approach for mound creation with better distribution
    // Fewer but larger mounds
    var moundPositions = generateNaturalMoundDistribution(tankWidth, tankDepth, 12); // Reduced count for larger mounds
    // Create mounds of varying sizes at the distributed positions
    moundPositions.forEach(function(position, index) {
        // Determine mound size category based on distance from center
        var distanceFromCenter = Math.sqrt(position.x * position.x + position.z * position.z);
        var maxDistance = Math.sqrt(tankWidth / 2 * (tankWidth / 2) + tankDepth / 2 * (tankDepth / 2));
        var normalizedDistance = maxDistance > 0 ? distanceFromCenter / maxDistance : 0;
        // Adjust size parameters: Introduce more variation and allow for larger mounds
        var baseSizeMultiplier = 1.0;
        // Increase size significantly towards the center, decrease towards edges
        if (normalizedDistance < 0.4) {
            baseSizeMultiplier = 1.5 + (0.4 - normalizedDistance) * 2.5; // Larger central mounds
        } else if (normalizedDistance > 0.8) {
            baseSizeMultiplier = 0.4 + (1.0 - normalizedDistance) * 1.0; // Smaller near edges
        } else {
            baseSizeMultiplier = 0.8 + Math.random() * 0.7; // Medium variation in between
        }
        // Add some random variation independent of position
        var randomFactor = 0.7 + Math.random() * 0.6; // Range 0.7 to 1.3
        var sizeMultiplier = baseSizeMultiplier * randomFactor;
        // Ensure minimum size
        sizeMultiplier = Math.max(0.5, sizeMultiplier); // Slightly larger minimum
        // Create mound with calculated size and position
        createMound({
            baseY: seabedBaseY,
            position: {
                x: position.x,
                z: position.z
            },
            size: {
                // Increase base ranges and apply multiplier for larger mounds
                width: (2.0 + Math.random() * 3.0) * sizeMultiplier,
                // Reduced max random height factor from 1.0 to 0.6
                height: (0.5 + Math.random() * 0.6) * sizeMultiplier,
                depth: (2.0 + Math.random() * 3.0) * sizeMultiplier // Deeper base range
            },
            material: sandMaterial,
            detailLevel: Math.max(1, Math.floor(sizeMultiplier * 1.5)),
            group: group,
            index: index // Pass index for blending neighbors and noise seed
        });
    });
    // Call the merge function after all mounds have been added to the group
    mergeSandMounds(group, sandMaterial);
}
/**
 * Creates a natural looking sand mound
 * @param {Object} params - Parameters for the mound
 */ /**
 * Generates a natural-looking distribution of mound positions
 * Generates a natural-looking distribution of mound positions within the tank bounds
 * using a modified poisson-disc sampling approach.
 * @param {number} tankWidth - Width constraint.
 * @param {number} tankDepth - Depth constraint.
 * @param {number} count - Number of mounds to generate.
 * @returns {Array<{x: number, z: number}>} Array of mound center positions.
 */ function generateNaturalMoundDistribution(tankWidth, tankDepth, count) {
    var positions = [];
    var minDistance = 1.2; // Minimum distance between mound centers
    var maxTries = 30;
    // Increased padding to account for max mound radius near edges
    var padding = 2.0;
    var spawnWidth = tankWidth - padding * 2;
    var spawnDepth = tankDepth - padding * 2;
    var halfSpawnWidth = spawnWidth / 2;
    var halfSpawnDepth = spawnDepth / 2;
    // Helper to check if a point is within bounds
    var isInBounds = function(pos) {
        return Math.abs(pos.x) < halfSpawnWidth && Math.abs(pos.z) < halfSpawnDepth;
    };
    // Pre-place some mounds, ensuring they are also in the positive X half
    for(var i = 0; i < Math.floor(count * 0.2); i++){
        positions.push({
            x: THREE.MathUtils.randFloat(0, halfSpawnWidth * 0.8),
            z: THREE.MathUtils.randFloat(-halfSpawnDepth * 0.8, halfSpawnDepth * 0.8) // Allow full depth range, slightly inwards
        });
    }
    // Fill in the rest with positions that respect minimum distance
    var attempts = 0;
    var maxAttempts = count * maxTries * 2; // Safety break
    while(positions.length < count && attempts < maxAttempts){
        attempts++;
        // Generate a candidate position only in the positive X half
        var candidate = {
            x: THREE.MathUtils.randFloat(0, halfSpawnWidth),
            z: THREE.MathUtils.randFloat(-halfSpawnDepth, halfSpawnDepth)
        };
        // Check distance to existing positions
        var tooClose = false;
        var closestDistance = Infinity;
        var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
        try {
            // Find closest existing mound
            for(var _iterator = positions[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                var pos = _step.value;
                var dx = candidate.x - pos.x;
                var dz = candidate.z - pos.z;
                var distance = Math.sqrt(dx * dx + dz * dz);
                if (distance < closestDistance) {
                    closestDistance = distance;
                }
                if (distance < minDistance) {
                    tooClose = true;
                    break;
                }
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally{
            try {
                if (!_iteratorNormalCompletion && _iterator.return != null) {
                    _iterator.return();
                }
            } finally{
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }
        // If it's too close, adjust position to create a natural cluster
        if (tooClose && Math.random() < 0.7) {
            // Sometimes allow closer placement to form natural clusters
            // Slightly offset from existing positions to create natural ridges
            for(var i1 = 0; i1 < maxTries; i1++){
                var nearPos = positions[Math.floor(Math.random() * positions.length)];
                var angle = Math.random() * Math.PI * 2;
                var distance1 = minDistance * (0.6 + Math.random() * 0.4);
                candidate.x = nearPos.x + Math.cos(angle) * distance1;
                candidate.z = nearPos.z + Math.sin(angle) * distance1;
                // Check if this new position works (within bounds AND still in positive X)
                if (isInBounds(candidate) && candidate.x >= 0) {
                    // Now check distance again for the adjusted position
                    var stillTooCloseAfterAdjust = false;
                    var _iteratorNormalCompletion1 = true, _didIteratorError1 = false, _iteratorError1 = undefined;
                    try {
                        for(var _iterator1 = positions[Symbol.iterator](), _step1; !(_iteratorNormalCompletion1 = (_step1 = _iterator1.next()).done); _iteratorNormalCompletion1 = true){
                            var pos1 = _step1.value;
                            var dx1 = candidate.x - pos1.x;
                            var dz1 = candidate.z - pos1.z;
                            if (Math.sqrt(dx1 * dx1 + dz1 * dz1) < minDistance) {
                                stillTooCloseAfterAdjust = true;
                                break;
                            }
                        }
                    } catch (err) {
                        _didIteratorError1 = true;
                        _iteratorError1 = err;
                    } finally{
                        try {
                            if (!_iteratorNormalCompletion1 && _iterator1.return != null) {
                                _iterator1.return();
                            }
                        } finally{
                            if (_didIteratorError1) {
                                throw _iteratorError1;
                            }
                        }
                    }
                    if (!stillTooCloseAfterAdjust) {
                        tooClose = false; // Found a good clustered spot
                        break;
                    }
                }
            }
        }
        // If candidate is valid (not too close OR adjusted clustering worked), add it
        if (!tooClose && isInBounds(candidate)) {
            positions.push(candidate);
        }
    }
    if (attempts >= maxAttempts) {
        console.warn("generateNaturalMoundDistribution: Reached max attempts, generated", positions.length, "mounds.");
    }
    return positions;
}
/**
 * Creates a single, natural-looking sand mound mesh.
 * @param {object} params - Mound parameters.
 * @param {number} params.baseY - The base Y-level for the mound bottom.
 * @param {{x: number, z: number}} params.position - XZ coordinates for the mound center.
 * @param {{width: number, height: number, depth: number}} params.size - Dimensions of the mound.
 * @param {THREE.Material} params.material - Material to apply.
 * @param {number} params.detailLevel - Controls geometry segments.
 * @param {THREE.Group} params.group - Group to add the mesh to.
 * @param {number} params.index - Unique index for noise seed.
 */ function createMound(param) {
    var baseY = param.baseY, position = param.position, size = param.size, material = param.material, detailLevel = param.detailLevel, group = param.group, index = param.index;
    // Clipping planes removed - better applied post-merge if needed
    // Create the mound using a sphere geometry sliced in half (hemisphere)
    var segments = 16 + detailLevel * 6; // Adjust detail
    // Use HemisphereGeometry for a naturally flat bottom
    var moundGeo = new THREE.SphereGeometry(1, segments, Math.max(8, Math.floor(segments / 2)), 0, Math.PI * 2, 0, Math.PI / 2 // Theta length (to equator)
    );
    // Create the mound mesh using the provided material directly
    // No need to clone if not applying per-mound clipping
    var moundMesh = new THREE.Mesh(moundGeo, material); // Use original material
    // Position and scale the mound
    // The base of the hemisphere is at y=0 in local space.
    // We position it so the base rests at baseY.
    moundMesh.position.set(position.x, baseY, position.z);
    // Scale affects the radius (x, z) and height (y)
    moundMesh.scale.set(size.width / 2, size.height, size.depth / 2); // Scale radius and height
    // Apply random Y rotation
    moundMesh.rotation.y = Math.random() * Math.PI * 2;
    // Use improved vertex manipulation for more natural blending
    // Add coherent noise to vertices for a more natural shape
    var positionAttribute = moundGeo.getAttribute('position');
    var vertex = new THREE.Vector3();
    // Use noise with consistent seed per mound for coherent deformation
    var moundSeed = index * 1000; // Use index to create deterministic but varied noise
    for(var i = 0; i < positionAttribute.count; i++){
        vertex.fromBufferAttribute(positionAttribute, i);
        // Smoother falloff at edges for better blending
        var yFactor = Math.pow(vertex.y, 1.5); // More gradual falloff near base
        var radialFactor = Math.sqrt(vertex.x * vertex.x + vertex.z * vertex.z);
        var edgeFactor = Math.max(0, 1 - radialFactor); // Softer at edges
        // Apply coherent noise based on position and mound seed
        var noiseX = Math.sin(vertex.x * 5 + moundSeed) * 0.5 + 0.5;
        var noiseZ = Math.cos(vertex.z * 5 + moundSeed + 100) * 0.5 + 0.5;
        var noiseY = Math.sin(vertex.y * 3 + moundSeed + 200) * 0.5 + 0.5;
        var blendedNoise = (noiseX + noiseZ + noiseY) / 3;
        // Apply smoothed displacement with more natural falloff
        var distortionAmount = 0.08 * Math.min(detailLevel, 2); // Slightly less aggressive distortion
        if (vertex.y > 0.05) {
            // More coherent, less random distortion
            vertex.x += (blendedNoise - 0.5) * distortionAmount * yFactor * edgeFactor;
            vertex.y += (blendedNoise - 0.5) * distortionAmount * yFactor;
            vertex.z += (blendedNoise - 0.5) * distortionAmount * yFactor * edgeFactor;
            // Extra horizontal stretching for more natural mound shapes
            if (vertex.y > 0.7) {
                var stretchFactor = 0.1 * (vertex.y - 0.7);
                vertex.x *= 1 + stretchFactor;
                vertex.z *= 1 + stretchFactor;
            }
        }
        positionAttribute.setXYZ(i, vertex.x, vertex.y, vertex.z);
    }
    // Smooth the geometry for better blending between mounds
    smoothGeometry(moundGeo, 1); // Apply light smoothing
    // Update normals after vertex modifications
    moundGeo.computeVertexNormals();
    // Set up shadows and add to group
    moundMesh.castShadow = true;
    moundMesh.receiveShadow = true;
    moundMesh.name = "SandMound";
    group.add(moundMesh);
}
/**
 * Merges individual sand mound meshes into a single mesh for better performance
 * and smoother appearance. Also adds a physics collider for the merged shape.
 * @param {THREE.Group} group - The group containing the individual mound meshes.
 * @param {THREE.Material} sandMaterial - The material to apply to the merged mesh.
 */ function mergeSandMounds(group, sandMaterial) {
    // ── Merge individual sand mounds into one smooth mesh ───────────────────
    var moundGeometries = [];
    var moundMeshes = [];
    group.traverse(function(child) {
        if (child.isMesh && /sandmound/i.test(child.name)) {
            // Apply world matrix BEFORE cloning geometry
            child.updateMatrixWorld(true); // Ensure matrixWorld is up-to-date
            var worldGeometry = child.geometry.clone().applyMatrix4(child.matrixWorld);
            moundGeometries.push(worldGeometry);
            moundMeshes.push(child); // keep reference so we can hide later
        }
    });
    if (moundGeometries.length >= 1) {
        var mergedGeometry = BufferGeometryUtils.mergeGeometries(moundGeometries, false); // Use groups = false
        if (mergedGeometry) {
            BufferGeometryUtils.mergeVertices(mergedGeometry, 1e-3); // Weld vertices
            mergedGeometry.computeVertexNormals(); // Recalculate normals for smooth shading
            // Create the visual merged mesh
            var superMoundMesh = new THREE.Mesh(mergedGeometry, sandMaterial);
            superMoundMesh.name = 'SandMoundMergedVisual'; // Differentiate visual mesh
            superMoundMesh.castShadow = true;
            superMoundMesh.receiveShadow = true;
            // Reset position/rotation/scale as geometry is already in world space
            superMoundMesh.position.set(0, 0, 0);
            superMoundMesh.rotation.set(0, 0, 0);
            superMoundMesh.scale.set(1, 1, 1);
            group.add(superMoundMesh);
            // Hide originals only *after* we have a valid merged mesh
            moundMeshes.forEach(function(m) {
                return m.visible = false;
            });
            // Add fixed-body collider so physics matches visual
            // NOTE: This assumes @react-three/rapier and React are available in this scope
            // If not, this part needs to be handled differently or moved.
            /*
        // This React component creation won't work directly inside this plain JS function.
        // The collider needs to be created within a React component context where RigidBody is used.
        // We will add the *geometry* to the group, and the React component using TankGroup
        // will need to create the RigidBody wrapper.
        group.add(
          // #PURE React.createElement(
          // RigidBody,
          // { colliders: 'trimesh', type: 'fixed', name: 'SandMoundMergedBody' },
          // #PURE React.createElement('mesh', { geometry: mergedGeometry, material: sandMaterial }) // Material doesn't matter for collider
          // )
        );
        */ // Instead, we store the geometry for the physics component to use
            group.userData.mergedSeabedGeometry = mergedGeometry;
        } else {
            console.warn('[envMeshes] mergeGeometries failed – keeping original mounds.');
        }
    } else {
        console.log('[envMeshes] No sand mounds found to merge.');
    }
}
function smoothGeometry(geometry) {
    var iterations = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 1;
    // Simple Laplacian smoothing
    var positionAttribute = geometry.getAttribute('position');
    var vertexCount = positionAttribute.count;
    // Work with a copy of the positions to avoid in-place modification issues
    var originalPositions = [];
    var tempVertex = new THREE.Vector3();
    for(var i = 0; i < vertexCount; i++){
        tempVertex.fromBufferAttribute(positionAttribute, i);
        originalPositions.push(tempVertex.clone());
    }
    // Find vertex neighbors (simplified approach)
    // This is a simple approach that works for sphere geometry
    // but would need to be more sophisticated for general meshes
    for(var iteration = 0; iteration < iterations; iteration++){
        var _originalPositions;
        var smoothedPositions = [];
        for(var i1 = 0; i1 < vertexCount; i1++){
            var currentPos = originalPositions[i1];
            var smoothedPos = currentPos.clone();
            // Find neighbors (simplified)
            var neighborCount = 0;
            var neighborSum = new THREE.Vector3(0, 0, 0);
            // Find nearby vertices (simplified neighborhood)
            for(var j = 0; j < vertexCount; j++){
                if (i1 === j) continue;
                var otherPos = originalPositions[j];
                var distance = currentPos.distanceTo(otherPos);
                // Consider points within a threshold as neighbors
                if (distance < 0.3) {
                    neighborSum.add(otherPos);
                    neighborCount++;
                }
            }
            // Apply smoothing if we found neighbors
            if (neighborCount > 0) {
                // More weight to original position for bottom vertices (y near 0)
                // to preserve the base shape and avoid sinking
                var basePreservation = currentPos.y < 0.1 ? 0.8 : 0.3;
                neighborSum.divideScalar(neighborCount);
                smoothedPos.multiplyScalar(basePreservation);
                neighborSum.multiplyScalar(1 - basePreservation);
                smoothedPos.add(neighborSum);
            }
            smoothedPositions.push(smoothedPos);
        }
        // Update original positions for next iteration
        originalPositions.length = 0;
        (_originalPositions = originalPositions).push.apply(_originalPositions, _to_consumable_array(smoothedPositions));
    }
    // Apply smoothed positions back to geometry
    for(var i2 = 0; i2 < vertexCount; i2++){
        var pos = originalPositions[i2];
        positionAttribute.setXYZ(i2, pos.x, pos.y, pos.z);
    }
} // <-- Added missing closing brace for smoothGeometry
// Removed the now-obsolete smoothGeometry function as merging and normal recalculation handle this better
/**
 * Creates a translucent water box mesh.
 * @param {object} params - Water box parameters.
 * @param {number} params.width - Width of the water volume.
 * @param {number} params.height - Height of the water volume.
 * @param {number} params.depth - Depth of the water volume.
 * @param {number} [params.positionY=0] - Y position of the water center.
 * @returns {THREE.Mesh} The water mesh.
 */ function createWaterBox(param) {
    var width = param.width, height = param.height, depth = param.depth, _param_positionY = param.positionY, positionY = _param_positionY === void 0 ? 0 : _param_positionY;
    var waterGeo = new THREE.BoxGeometry(width, height, depth);
    var waterMat = createWaterMaterial(); // Use the imported material function
    var waterMesh = new THREE.Mesh(waterGeo, waterMat);
    waterMesh.position.y = positionY; // Set vertical position
    waterMesh.renderOrder = 1; // Render water after opaque objects
    return waterMesh;
}
