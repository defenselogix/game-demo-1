import * as THREE from 'three';
import { getSurfacePoint } from './geometryUtils.js';
/**
 * Spawns an item at a valid position on the tank floor or sand mounds
 * 
 * @param {THREE.Object3D} prefab - The object to clone and place
 * @param {Object} tankBounds - Tank boundary info { min, max }
 * @param {Object} world - Rapier world for physics raycasting
 * @param {Object} rapier - Rapier instance for ray creation
 * @param {number} margin - Margin from edges (0-1, percentage of tank size)
 * @returns {THREE.Object3D|null} - The spawned object or null if failed
 */ export function spawnItem(prefab, tankBounds, world, rapier) {
    var margin = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : 0.1;
    if (!prefab || !tankBounds || !world || !rapier) return null;
    // Clone first so we can measure it
    var model = prefab.clone();
    // Dynamic offset: half of the model's height + small cushion
    var yOffset = function() {
        var box = new THREE.Box3().setFromObject(model);
        return (box.max.y - box.min.y) * 0.5 + 0.02;
    }();
    // Allow manual override via model.userData.yOffset
    if (model.userData && typeof model.userData.yOffset === 'number') {
        yOffset = model.userData.yOffset;
    }
    var tankWidth = tankBounds.max.x - tankBounds.min.x;
    var tankDepth = tankBounds.max.z - tankBounds.min.z;
    var tries = 10;
    while(tries--){
        var x = THREE.MathUtils.randFloatSpread(tankWidth * (1 - margin * 2)) + (tankBounds.min.x + tankBounds.max.x) / 2;
        var z = THREE.MathUtils.randFloatSpread(tankDepth * (1 - margin * 2)) + (tankBounds.min.z + tankBounds.max.z) / 2;
        var surface = getSurfacePoint(x, z, world, rapier);
        if (surface) {
            var n = surface.normal ? new THREE.Vector3(surface.normal.x, surface.normal.y, surface.normal.z).normalize() : new THREE.Vector3(0, 1, 0);
            model.position.set(surface.x + n.x * yOffset, surface.y + n.y * yOffset, surface.z + n.z * yOffset);
            return model;
        }
    }
    return null; // No safe spot found
}
/**
 * Spawns a group of related items in a visually appealing cluster formation
 * 
 * @param {THREE.Object3D[]} prefabs - Array of objects to clone and place
 * @param {Object} tankBounds - Tank boundary info { min, max }
 * @param {Object} world - Rapier world for physics raycasting
 * @param {Object} rapier - Rapier instance for ray creation
 * @param {Object} options - Configuration options
 * @param {number} options.margin - Margin from tank edges (0-1, percentage of tank size)
 * @param {number} options.radius - Radius of the cluster (default: 0.5)
 * @param {number} options.minSpacing - Minimum spacing between items (default: 0.1)
 * @param {number} options.maxAttempts - Maximum spawn attempts (default: 20)
 * @param {boolean} options.randomRotationY - Apply random Y-axis rotation (default: true)
 * @returns {THREE.Object3D[]} - Array of successfully spawned objects
 */ export function spawnGrouped(prefabs, tankBounds, world, rapier) {
    var options = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : {};
    if (!(prefabs === null || prefabs === void 0 ? void 0 : prefabs.length) || !tankBounds || !world || !rapier) return [];
    var _options_margin = options.margin, margin = _options_margin === void 0 ? 0.1 : _options_margin, _options_radius = options.radius, radius = _options_radius === void 0 ? 0.5 : _options_radius, _options_minSpacing = options.minSpacing, minSpacing = _options_minSpacing === void 0 ? 0.1 : _options_minSpacing, _options_maxAttempts = options.maxAttempts, maxAttempts = _options_maxAttempts === void 0 ? 20 : _options_maxAttempts, _options_randomRotationY = options.randomRotationY, randomRotationY = _options_randomRotationY === void 0 ? true : _options_randomRotationY;
    // Find a suitable anchor point for the group
    var tankWidth = tankBounds.max.x - tankBounds.min.x;
    var tankDepth = tankBounds.max.z - tankBounds.min.z;
    var anchorX, anchorZ, anchorSurface;
    var anchorAttempts = 10;
    // Try to find a good anchor point with enough surrounding space
    while(anchorAttempts--){
        anchorX = THREE.MathUtils.randFloatSpread(tankWidth * (1 - margin * 2)) + (tankBounds.min.x + tankBounds.max.x) / 2;
        anchorZ = THREE.MathUtils.randFloatSpread(tankDepth * (1 - margin * 2)) + (tankBounds.min.z + tankBounds.max.z) / 2;
        anchorSurface = getSurfacePoint(anchorX, anchorZ, world, rapier);
        if (anchorSurface) break;
    }
    if (!anchorSurface) return []; // Couldn't find a suitable anchor point
    var spawnedObjects = [];
    var occupiedPositions = [];
    // Helper function to check if a position is too close to existing objects
    var isTooClose = function(x, z) {
        return occupiedPositions.some(function(pos) {
            var dx = pos.x - x;
            var dz = pos.z - z;
            return Math.sqrt(dx * dx + dz * dz) < minSpacing;
        });
    };
    var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
    try {
        // Spawn each prefab in the group
        for(var _iterator = prefabs[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
            var _loop = function() {
                // Random position within cluster radius, weighted toward center
                var angle = Math.random() * Math.PI * 2;
                // Use sqrt for more natural distribution
                var distance = Math.sqrt(Math.random()) * radius;
                var x = anchorSurface.x + Math.cos(angle) * distance;
                var z = anchorSurface.z + Math.sin(angle) * distance;
                // Skip if too close to already placed objects
                if (isTooClose(x, z)) return "continue";
                var surface = getSurfacePoint(x, z, world, rapier);
                if (!surface) return "continue";
                // Clone the prefab
                var model = prefab.clone();
                // Calculate appropriate Y offset
                var yOffset = function() {
                    var box = new THREE.Box3().setFromObject(model);
                    return (box.max.y - box.min.y) * 0.5 + 0.02;
                }();
                // Allow manual override via model.userData.yOffset
                if (model.userData && typeof model.userData.yOffset === 'number') {
                    yOffset = model.userData.yOffset;
                }
                // Set position along the surface normal
                var n = surface.normal ? new THREE.Vector3(surface.normal.x, surface.normal.y, surface.normal.z).normalize() : new THREE.Vector3(0, 1, 0);
                model.position.set(surface.x + n.x * yOffset, surface.y + n.y * yOffset, surface.z + n.z * yOffset);
                // Apply random rotation if enabled
                if (randomRotationY) {
                    model.rotation.y = Math.random() * Math.PI * 2;
                }
                // Add slight random rotation variation for natural look
                model.rotation.x += THREE.MathUtils.randFloatSpread(0.1);
                model.rotation.z += THREE.MathUtils.randFloatSpread(0.1);
                // Track position for spacing check
                occupiedPositions.push({
                    x: x,
                    z: z
                });
                spawnedObjects.push(model);
                spawned = true;
            };
            var prefab = _step.value;
            var attempts = maxAttempts;
            var spawned = false;
            while(attempts-- && !spawned)_loop();
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
    return spawnedObjects;
}
