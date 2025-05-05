function _instanceof(left, right) {
    if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) {
        return !!right[Symbol.hasInstance](left);
    } else {
        return left instanceof right;
    }
}
function _type_of(obj) {
    "@swc/helpers - typeof";
    return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj;
}
import * as THREE from 'three';
// Add Raycaster and Vector3 for the new fallback function
import { Raycaster, Vector3 } from 'three';
// Note: createSeaweedMesh from PlantLife seems unused; spawnSeaweed uses createSeaweed from seaweedPrefab.
// import { createSeaweedMesh } from './PlantLife.js'; // Removed unused import
/**
 * Helper to find surface points (like tank floor and sand mounds) via raycasting
 *
 * @param {number} x - X position to raycast from
 * @param {number} z - Z position to raycast from
 * @param {Object} world - Rapier world for physics raycasting
 * @param {Object} rapier - Rapier instance for ray creation
 * @param {string} boundaryType - Type of boundary to detect (default: 'tankBoundary')
 * @returns {THREE.Vector3|null} - Surface point or null if no hit
 */ export function getSurfacePoint(x, z, world, rapier) {
    var wantedTags = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : [
        'tankBoundary',
        'sandMound'
    ];
    var _hit_collider;
    // Resolve raw Rapier world object
    var rw = world;
    if (rw && typeof rw.castRay !== 'function') rw = typeof rw.raw === 'function' ? rw.raw() : rw.raw;
    if (!rw || typeof rw.castRay !== 'function') return null;
    // Down-ray from well above the tank
    var origin = new THREE.Vector3(x, 100, z);
    var dir = new THREE.Vector3(0, -1, 0);
    var ray = (rapier === null || rapier === void 0 ? void 0 : rapier.Ray) ? new rapier.Ray(origin, dir) : {
        origin: origin,
        dir: dir
    };
    // Pass 1 – only colliders tagged as wanted
    var filter = function(c) {
        var _c_userData, _c_parent_userData, _c_parent;
        return wantedTags.length === 0 || wantedTags.includes((c === null || c === void 0 ? void 0 : (_c_userData = c.userData) === null || _c_userData === void 0 ? void 0 : _c_userData.type) || (c === null || c === void 0 ? void 0 : (_c_parent = c.parent) === null || _c_parent === void 0 ? void 0 : (_c_parent_userData = _c_parent.userData) === null || _c_parent_userData === void 0 ? void 0 : _c_parent_userData.type));
    };
    var hit = rw.castRay(ray, 1000, true, undefined, undefined, filter);
    // If the filtered raycast didn't hit, return null immediately.
    // Do NOT perform an unfiltered fallback raycast here.
    if (!hit) return null;
    // Build result object using the hit from the filtered raycast
    var point = origin.clone().addScaledVector(dir, hit.toi);
    var normal = {
        x: 0,
        y: 1,
        z: 0
    };
    if ((_hit_collider = hit.collider) === null || _hit_collider === void 0 ? void 0 : _hit_collider.normalAt) normal = hit.collider.normalAt(point, dir.clone().negate());
    return {
        x: point.x,
        y: point.y,
        z: point.z,
        normal: new THREE.Vector3(normal.x, normal.y, normal.z).normalize(),
        collider: hit.collider
    };
}
/**
 * General helper to place a prefab clone onto a surface point, aligning to normal.
 * Handles cloning, positioning, Y-offset calculation, alignment, and random Y rotation.
 * 
 * @param {THREE.Object3D} prefab - The object to clone and place. Must have geometry.
 * @param {Object} surfaceHit - The hit object from getSurfacePoint (must include x, y, z, normal).
 * @param {number} [clearance=0.01] - Small vertical offset above the surface.
 * @param {boolean} [randomRotationY=true] - Apply a random rotation around the Y-axis.
 * @returns {THREE.Object3D|null} - The cloned, positioned, and oriented object, or null on error.
 */ export function placePrefabOnSurface(prefab, surfaceHit) {
    var clearance = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : 0.01, randomRotationY = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : true;
    if (!prefab || !(surfaceHit === null || surfaceHit === void 0 ? void 0 : surfaceHit.normal)) return null;
    var model = prefab.clone();
    // ── orient ───────────────────────────────────────────────────────
    var up = new THREE.Vector3(0, 1, 0);
    var n = surfaceHit.normal.clone().normalize();
    model.quaternion.setFromUnitVectors(up, n);
    if (randomRotationY) {
        model.quaternion.multiply(new THREE.Quaternion().setFromAxisAngle(n, THREE.MathUtils.randFloat(0, Math.PI * 2)));
    }
    // ── seed at hit-point before measuring bbox ─────────────────────
    var hitPos = new THREE.Vector3(surfaceHit.x, surfaceHit.y, surfaceHit.z);
    model.position.copy(hitPos);
    model.updateMatrixWorld(true);
    // ── compute world-space bbox ─────────────────────────────────────
    var bbox = new THREE.Box3().setFromObject(model);
    // ── project all bbox corners onto the surface normal ────────────
    var pts = [
        new THREE.Vector3(bbox.min.x, bbox.min.y, bbox.min.z),
        new THREE.Vector3(bbox.min.x, bbox.min.y, bbox.max.z),
        new THREE.Vector3(bbox.min.x, bbox.max.y, bbox.min.z),
        new THREE.Vector3(bbox.min.x, bbox.max.y, bbox.max.z),
        new THREE.Vector3(bbox.max.x, bbox.min.y, bbox.min.z),
        new THREE.Vector3(bbox.max.x, bbox.min.y, bbox.max.z),
        new THREE.Vector3(bbox.max.x, bbox.max.y, bbox.min.z),
        new THREE.Vector3(bbox.max.x, bbox.max.y, bbox.max.z)
    ];
    var lowest = Infinity;
    var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
    try {
        for(var _iterator = pts[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
            var p = _step.value;
            var dot = p.sub(hitPos).dot(n); // signed distance along surface normal
            if (dot < lowest) lowest = dot;
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
    // ── shift so the lowest corner rests at +clearance above surface ─
    var shift = -lowest + clearance; // can be ±
    model.position.addScaledVector(n, shift);
    return model;
}
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
    if (!prefab || !tankBounds || !world || !rapier) return null; // Added rapier check
    // No need to clone or calculate yOffset here; placePrefabOnSurface handles it.
    var tankWidth = tankBounds.max.x - tankBounds.min.x;
    var tankDepth = tankBounds.max.z - tankBounds.min.z;
    var tries = 10;
    while(tries--){
        var x = THREE.MathUtils.randFloatSpread(tankWidth * (1 - margin * 2)) + (tankBounds.min.x + tankBounds.max.x) / 2;
        var z = THREE.MathUtils.randFloatSpread(tankDepth * (1 - margin * 2)) + (tankBounds.min.z + tankBounds.max.z) / 2;
        // Pass rapier instance to getSurfacePoint (already done)
        var surfaceHit = getSurfacePoint(x, z, world, rapier); // Default tags ['tankBoundary', 'sandMound'] are used
        if (surfaceHit) {
            // Use the helper for placement and alignment
            // Pass the *original* prefab, not the initial clone
            var placedModel = placePrefabOnSurface(prefab, surfaceHit, 0.02); // Using default clearance
            // Random Y rotation is handled inside placePrefabOnSurface, no need to add it here.
            // Ensure the placed model has the correct userData if the prefab had it
            // placePrefabOnSurface clones userData, so this should be fine.
            return placedModel; // Return the model placed by the helper
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
    var _options_margin = options.margin, margin = _options_margin === void 0 ? 0.1 : _options_margin, _options_radius = options.radius, radius = _options_radius === void 0 ? 0.5 : _options_radius, _options_minSpacing = options.minSpacing, minSpacing = _options_minSpacing === void 0 ? 0.1 : _options_minSpacing, _options_maxAttempts = options.maxAttempts, maxAttempts = _options_maxAttempts === void 0 ? 20 : _options_maxAttempts, _options_randomRotationY = options.randomRotationY, randomRotationY = _options_randomRotationY === void 0 ? true // Pass this down if needed, placePrefabOnSurface uses it
     : _options_randomRotationY;
    // Find a suitable anchor point for the group
    var tankWidth = tankBounds.max.x - tankBounds.min.x;
    var tankDepth = tankBounds.max.z - tankBounds.min.z;
    var anchorX, anchorZ, anchorHit;
    var anchorAttempts = 10;
    // Try to find a good anchor point with enough surrounding space
    while(anchorAttempts--){
        anchorX = THREE.MathUtils.randFloatSpread(tankWidth * (1 - margin * 2)) + (tankBounds.min.x + tankBounds.max.x) / 2;
        anchorZ = THREE.MathUtils.randFloatSpread(tankDepth * (1 - margin * 2)) + (tankBounds.min.z + tankBounds.max.z) / 2;
        anchorHit = getSurfacePoint(anchorX, anchorZ, world, rapier);
        if (anchorHit) break;
    }
    if (!anchorHit) return []; // Couldn't find a suitable anchor point
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
            var prefab = _step.value;
            var attempts = maxAttempts;
            var spawned = false;
            while(attempts-- && !spawned){
                // Random position within cluster radius, weighted toward center
                var angle = Math.random() * Math.PI * 2;
                // Use sqrt for more natural distribution
                var distance = Math.sqrt(Math.random()) * radius;
                var x = anchorHit.x + Math.cos(angle) * distance;
                var z = anchorHit.z + Math.sin(angle) * distance;
                // Skip if too close to already placed objects
                if (isTooClose(x, z)) continue;
                var surfaceHit = getSurfacePoint(x, z, world, rapier);
                if (!surfaceHit) continue;
                // Use the helper for placement and alignment
                // Pass randomRotationY option from spawnGrouped options
                var model = placePrefabOnSurface(prefab, surfaceHit, 0.02, randomRotationY);
                if (!model) continue; // Placement failed
                // Add slight random rotation variation for natural look *after* placement if not already rotated
                // This adds tilt variation, placePrefab handles the base Y rotation
                if (!randomRotationY) {
                    model.rotation.x += THREE.MathUtils.randFloatSpread(0.1);
                    model.rotation.z += THREE.MathUtils.randFloatSpread(0.1);
                }
                // Track position for spacing check using the final model position
                occupiedPositions.push({
                    x: model.position.x,
                    z: model.position.z
                });
                spawnedObjects.push(model);
                spawned = true;
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
    return spawnedObjects;
}
/**
 * Creates bounding volumes for collision detection based on object geometry
 * 
 * @param {THREE.Object3D} object - The 3D object to create bounds for
 * @param {Object} options - Configuration options
 * @param {string} options.type - Type of bounding volume ('box', 'sphere', 'capsule', 'convex', 'hull', 'trimesh')
 * @param {number} options.scale - Scale factor for the bounding volume (default: 1.0)
 * @param {boolean} options.alignToBottom - Align the collision to the bottom of the object (default: true)
 * @param {boolean} options.visualize - Show debug visualization of the collision shape (default: false)
 * @param {THREE.Vector3} options.offset - Additional offset for the collision shape
 * @returns {Object} - Collision descriptor object for use with physics systems
 */ export function createBoundingVolume(object) {
    var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    if (!object) return null;
    var _options_type = options.type, type = _options_type === void 0 ? 'box' : _options_type, _options_scale = options.scale, scale = _options_scale === void 0 ? 1.0 : _options_scale, _options_alignToBottom = options.alignToBottom, alignToBottom = _options_alignToBottom === void 0 ? true : _options_alignToBottom, _options_visualize = options.visualize, visualize = _options_visualize === void 0 ? false : _options_visualize, _options_offset = options.offset, offset = _options_offset === void 0 ? new THREE.Vector3(0, 0, 0) : _options_offset;
    // Create bounding box to measure the object
    var boundingBox = new THREE.Box3().setFromObject(object);
    var size = new THREE.Vector3();
    boundingBox.getSize(size);
    // Calculate center point
    var center = new THREE.Vector3();
    boundingBox.getCenter(center);
    // Apply alignment if requested
    var alignmentOffset = new THREE.Vector3(0, 0, 0);
    if (alignToBottom) {
        // Move collision shape up so its bottom aligns with object's bottom
        alignmentOffset.y = center.y - boundingBox.min.y - size.y / 2;
    }
    // Combine all offsets
    var finalOffset = new THREE.Vector3().copy(alignmentOffset).add(offset);
    // Create the appropriate collision volume based on type
    var collisionDescriptor = {
        type: type,
        position: new THREE.Vector3().copy(center).add(finalOffset),
        scale: scale
    };
    switch(type){
        case 'box':
            collisionDescriptor.halfExtents = new THREE.Vector3(size.x * 0.5 * scale, size.y * 0.5 * scale, size.z * 0.5 * scale);
            break;
        case 'sphere':
            // Use the largest dimension for a sphere
            collisionDescriptor.radius = Math.max(size.x, size.y, size.z) * 0.5 * scale;
            break;
        case 'capsule':
            collisionDescriptor.radius = Math.max(size.x, size.z) * 0.5 * scale;
            collisionDescriptor.height = size.y * scale;
            break;
        case 'cylinder':
            collisionDescriptor.radius = Math.max(size.x, size.z) * 0.5 * scale;
            collisionDescriptor.height = size.y * scale;
            break;
        case 'convex':
        case 'hull':
        case 'trimesh':
            // These require the actual geometry vertices
            // Collect all vertices from the object's geometry
            collisionDescriptor.vertices = extractVertices(object);
            break;
        default:
            console.warn("Unsupported collision type: ".concat(type, ", falling back to box"));
            collisionDescriptor.type = 'box';
            collisionDescriptor.halfExtents = new THREE.Vector3(size.x * 0.5 * scale, size.y * 0.5 * scale, size.z * 0.5 * scale);
    }
    // Add visualization if requested
    if (visualize) {
        collisionDescriptor.debugMesh = createDebugVisualization(collisionDescriptor);
    }
    return collisionDescriptor;
}
/**
 * Helper function to extract vertices from a THREE.Object3D and its children
 * 
 * @param {THREE.Object3D} object - The object to extract vertices from
 * @returns {THREE.Vector3[]} - Array of vertex positions
 */ function extractVertices(object) {
    var vertices = [];
    var worldMatrix = object.matrixWorld;
    object.traverse(function(child) {
        if (child.isMesh && child.geometry) {
            var geometry = child.geometry;
            var position = geometry.attributes.position;
            // Ensure we have a position attribute
            if (!position) return;
            // Transform each vertex by the world matrix to get world positions
            for(var i = 0; i < position.count; i++){
                var vertex = new THREE.Vector3();
                vertex.fromBufferAttribute(position, i);
                vertex.applyMatrix4(worldMatrix);
                vertices.push(vertex);
            }
        }
    });
    return vertices;
}
/**
 * Creates a debug visualization mesh for a collision shape
 * 
 * @param {Object} collisionDescriptor - The collision descriptor
 * @returns {THREE.Mesh} - Debug visualization mesh
 */ function createDebugVisualization(collisionDescriptor) {
    var geometry;
    var material = new THREE.MeshBasicMaterial({
        color: 0x00ff00,
        wireframe: true,
        transparent: true,
        opacity: 0.5
    });
    switch(collisionDescriptor.type){
        case 'box':
            geometry = new THREE.BoxGeometry(collisionDescriptor.halfExtents.x * 2, collisionDescriptor.halfExtents.y * 2, collisionDescriptor.halfExtents.z * 2);
            break;
        case 'sphere':
            geometry = new THREE.SphereGeometry(collisionDescriptor.radius, 16, 12);
            break;
        case 'capsule':
            // Capsule is more complex - we'll approximate with a cylinder and two spheres
            var radius = collisionDescriptor.radius;
            var height = collisionDescriptor.height;
            // Create a group to hold the parts
            var capsuleGroup = new THREE.Group();
            // Cylinder for the middle
            var cylinderGeometry = new THREE.CylinderGeometry(radius, radius, height - radius * 2, 16);
            var cylinder = new THREE.Mesh(cylinderGeometry, material);
            capsuleGroup.add(cylinder);
            // Spheres for the ends
            var sphereGeometry = new THREE.SphereGeometry(radius, 16, 12);
            var topSphere = new THREE.Mesh(sphereGeometry, material);
            topSphere.position.y = (height - radius * 2) / 2;
            capsuleGroup.add(topSphere);
            var bottomSphere = new THREE.Mesh(sphereGeometry, material);
            bottomSphere.position.y = -(height - radius * 2) / 2;
            capsuleGroup.add(bottomSphere);
            capsuleGroup.position.copy(collisionDescriptor.position);
            return capsuleGroup;
        case 'cylinder':
            geometry = new THREE.CylinderGeometry(collisionDescriptor.radius, collisionDescriptor.radius, collisionDescriptor.height, 16);
            break;
        case 'convex':
        case 'hull':
        case 'trimesh':
            if (collisionDescriptor.vertices && collisionDescriptor.vertices.length > 0) {
                // Create a convex hull from the vertices
                var temp = new THREE.BufferGeometry();
                // Convert vertices to positions array
                var positions = new Float32Array(collisionDescriptor.vertices.length * 3);
                collisionDescriptor.vertices.forEach(function(vertex, i) {
                    positions[i * 3] = vertex.x;
                    positions[i * 3 + 1] = vertex.y;
                    positions[i * 3 + 2] = vertex.z;
                });
                temp.setAttribute('position', new THREE.BufferAttribute(positions, 3));
                geometry = new THREE.BufferGeometry().setFromPoints(collisionDescriptor.vertices);
            } else {
                // Fallback to a simple box if no vertices
                geometry = new THREE.BoxGeometry(1, 1, 1);
                console.warn('No vertices provided for convex/hull/trimesh collision shape');
            }
            break;
    }
    if (!geometry) {
        console.warn('Failed to create debug visualization for collision shape');
        return null;
    }
    var mesh = new THREE.Mesh(geometry, material);
    mesh.position.copy(collisionDescriptor.position);
    return mesh;
}
/**
 * Spawns an object with physics properties based on its bounding volume
 * 
 * @param {THREE.Object3D} prefab - The object to clone and place
 * @param {Object} tankBounds - Tank boundary info { min, max }
 * @param {Object} world - Rapier world for physics raycasting and body creation
 * @param {Object} rapier - Rapier instance for physics objects
 * @param {Object} options - Configuration options
 * @param {number} options.margin - Margin from tank edges (0-1, percentage of tank size)
 * @param {string|Object} options.collisionType - Type of collision shape or collision descriptor
 * @param {number} options.collisionScale - Scale for collision shape (default: 0.9)
 * @param {number} options.mass - Mass of the object (default: 1)
 * @param {boolean} options.isStatic - Whether object is static (default: false)
 * @param {number} options.friction - Friction coefficient (default: 0.3)
 * @param {number} options.restitution - Restitution/bounciness (default: 0.2)
 * @param {boolean} options.visualizeCollision - Show collision shape (default: false)
 * @param {boolean} options.randomRotationY - Apply random Y-axis rotation (default: true)
 * @returns {Object} - Object with the model and physics body
 */ export function spawnWithPhysics(prefab, tankBounds, world, rapier) {
    var options = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : {};
    if (!prefab || !tankBounds || !world || !rapier) return null;
    var _options_margin = options.margin, margin = _options_margin === void 0 ? 0.1 : _options_margin, _options_collisionType = options.collisionType, collisionType = _options_collisionType === void 0 ? 'box' : _options_collisionType, _options_collisionScale = options.collisionScale, collisionScale = _options_collisionScale === void 0 ? 0.9 : _options_collisionScale, _options_mass = options.mass, mass = _options_mass === void 0 ? 1 : _options_mass, _options_isStatic = options.isStatic, isStatic = _options_isStatic === void 0 ? false : _options_isStatic, _options_friction = options.friction, friction = _options_friction === void 0 ? 0.3 : _options_friction, _options_restitution = options.restitution, restitution = _options_restitution === void 0 ? 0.2 : _options_restitution, _options_visualizeCollision = options.visualizeCollision, visualizeCollision = _options_visualizeCollision === void 0 ? false : _options_visualizeCollision, _options_randomRotationY = options.randomRotationY, randomRotationY = _options_randomRotationY === void 0 ? true // Passed to placePrefabOnSurface via spawnItem
     : _options_randomRotationY;
    // Force visualization off, overriding any passed option
    var effectiveVisualizeCollision = false;
    // First spawn the visual model at a valid location
    // spawnItem now uses placePrefabOnSurface which handles random Y rotation
    var model = spawnItem(prefab, tankBounds, world, rapier, margin);
    if (!model) return null; // Failed to find valid spawn location
    // Note: Random Y rotation is already applied by placePrefabOnSurface called within spawnItem
    // Generate appropriate collision volume
    var collisionDesc;
    if (typeof collisionType === 'string') {
        // Create a new collision descriptor based on the model
        collisionDesc = createBoundingVolume(model, {
            type: collisionType,
            scale: collisionScale,
            alignToBottom: true,
            visualize: effectiveVisualizeCollision // Use the forced value
        });
    } else if ((typeof collisionType === "undefined" ? "undefined" : _type_of(collisionType)) === 'object') {
        // Use provided collision descriptor directly
        collisionDesc = collisionType;
    }
    if (!collisionDesc) {
        console.warn('Failed to create collision descriptor');
        return {
            model: model,
            body: null
        };
    }
    // Add the debug visualization to the model if requested and available
    if (effectiveVisualizeCollision && collisionDesc.debugMesh) {
        model.add(collisionDesc.debugMesh);
    }
    // Create the rigid body description
    var bodyDesc;
    if (isStatic) {
        bodyDesc = rapier.RigidBodyDesc.fixed();
        // Set position and rotation for static bodies too
        bodyDesc.setTranslation(model.position.x, model.position.y, model.position.z);
        bodyDesc.setRotation(new rapier.Quaternion(model.quaternion.x, model.quaternion.y, model.quaternion.z, model.quaternion.w));
    } else {
        bodyDesc = rapier.RigidBodyDesc.dynamic().setTranslation(model.position.x, model.position.y, model.position.z).setRotation(new rapier.Quaternion(model.quaternion.x, model.quaternion.y, model.quaternion.z, model.quaternion.w)).setLinearDamping(0.4) // Add some damping to prevent excessive movement
        .setAngularDamping(0.4);
        // If using mass, set it
        if (mass > 0) {
            bodyDesc.setMass(mass);
        }
    }
    // Create the actual body in the physics world
    var body = world.createRigidBody(bodyDesc);
    // Create the appropriate collider based on collision type
    var colliderDesc;
    switch(collisionDesc.type){
        case 'box':
            colliderDesc = rapier.ColliderDesc.cuboid(collisionDesc.halfExtents.x, collisionDesc.halfExtents.y, collisionDesc.halfExtents.z);
            break;
        case 'sphere':
            colliderDesc = rapier.ColliderDesc.ball(collisionDesc.radius);
            break;
        case 'capsule':
            // For capsules, the height defines the distance between the centers of the spheres at each end
            colliderDesc = rapier.ColliderDesc.capsule(collisionDesc.height * 0.5 - collisionDesc.radius, collisionDesc.radius);
            break;
        case 'cylinder':
            colliderDesc = rapier.ColliderDesc.cylinder(collisionDesc.height * 0.5, collisionDesc.radius);
            break;
        case 'convex':
        case 'hull':
            if (collisionDesc.vertices && collisionDesc.vertices.length >= 4) {
                // Convert to flat array format that Rapier expects
                var flatVertices = new Float32Array(collisionDesc.vertices.length * 3);
                collisionDesc.vertices.forEach(function(vertex, i) {
                    flatVertices[i * 3] = vertex.x;
                    flatVertices[i * 3 + 1] = vertex.y;
                    flatVertices[i * 3 + 2] = vertex.z;
                });
                colliderDesc = rapier.ColliderDesc.convexHull(flatVertices);
            } else {
                // Fallback to box if insufficient vertices
                console.warn('Insufficient vertices for convex hull, falling back to box');
                colliderDesc = rapier.ColliderDesc.cuboid(0.5, 0.5, 0.5);
            }
            break;
        case 'trimesh':
            if (collisionDesc.vertices && collisionDesc.vertices.length >= 3) {
                // Convert to flat array format that Rapier expects
                var flatVertices1 = new Float32Array(collisionDesc.vertices.length * 3);
                collisionDesc.vertices.forEach(function(vertex, i) {
                    flatVertices1[i * 3] = vertex.x;
                    flatVertices1[i * 3 + 1] = vertex.y;
                    flatVertices1[i * 3 + 2] = vertex.z;
                });
                // For trimesh we also need indices
                // Simple approach: assume vertices are already in triangle order
                var indices = new Uint32Array(collisionDesc.vertices.length);
                for(var i = 0; i < collisionDesc.vertices.length; i++){
                    indices[i] = i;
                }
                colliderDesc = rapier.ColliderDesc.trimesh(flatVertices1, indices);
            } else {
                // Fallback to box if insufficient vertices
                console.warn('Insufficient vertices for trimesh, falling back to box');
                colliderDesc = rapier.ColliderDesc.cuboid(0.5, 0.5, 0.5);
            }
            break;
        default:
            console.warn("Unsupported collision type: ".concat(collisionDesc.type, ", falling back to box"));
            colliderDesc = rapier.ColliderDesc.cuboid(0.5, 0.5, 0.5);
    }
    // Set material properties
    colliderDesc.setFriction(friction);
    colliderDesc.setRestitution(restitution);
    // Apply offset if needed
    if (collisionDesc.position) {
        var posOffset = new THREE.Vector3().copy(collisionDesc.position).sub(model.position); // Convert to local space offset relative to model's origin
        // Apply the inverse of the body's rotation to the offset vector
        // to get the correct offset in the body's local frame
        var invRot = new THREE.Quaternion().copy(model.quaternion).invert();
        posOffset.applyQuaternion(invRot);
        if (posOffset.length() > 0.001) {
            colliderDesc.setTranslation(posOffset.x, posOffset.y, posOffset.z);
        }
    }
    // Create the collider and attach it to the body
    var collider = world.createCollider(colliderDesc, body);
    // Set user data to link the physics body to the 3D model
    // FIXED: Avoid circular references between body and collider
    body.userData = {
        type: 'physicsObject',
        objectId: model.uuid,
        colliderId: collider.handle // Store ID instead of reference
    };
    // Add a reference to the physics body in the model's user data
    model.userData = model.userData || {};
    model.userData.physicsBodyId = body.handle; // Store ID instead of direct reference
    // Setup synchronization (will need to be called in an animation loop)
    // FIXED: Created a closure that doesn't create circular references
    var sync = function() {
        if (!body.isValid() || isStatic) return; // Don't sync static bodies
        // Get the updated transform from the physics body
        var position = body.translation();
        var rotation = body.rotation();
        // Apply to the 3D model
        model.position.set(position.x, position.y, position.z);
        model.quaternion.set(rotation.x, rotation.y, rotation.z, rotation.w);
    };
    // Create a lookup helper to get references by ID
    var getById = {
        getBody: function() {
            return body;
        },
        getModel: function() {
            return model;
        },
        getCollider: function() {
            return collider;
        }
    };
    return {
        model: model,
        body: body,
        collider: collider,
        sync: sync,
        getById: getById
    };
}
/**
 * Spawns a group of physics-enabled objects in a visually appealing cluster formation
 * 
 * @param {THREE.Object3D[]} prefabs - Array of objects to clone and place
 * @param {Object} tankBounds - Tank boundary info { min, max }
 * @param {Object} world - Rapier world for physics raycasting and body creation
 * @param {Object} rapier - Rapier instance for physics objects
 * @param {Object} options - Configuration options
 * @param {number} options.margin - Margin from tank edges (0-1, percentage of tank size)
 * @param {number} options.radius - Radius of the cluster (default: 0.5)
 * @param {number} options.minSpacing - Minimum spacing between items (default: 0.2)
 * @param {string|Object} options.collisionType - Type of collision shape or collision descriptor
 * @param {number} options.collisionScale - Scale for collision shape (default: 0.9)
 * @param {number} options.mass - Mass of the objects (default: 1)
 * @param {number} options.friction - Friction coefficient (default: 0.3)
 * @param {number} options.restitution - Restitution/bounciness (default: 0.2)
 * @param {boolean} options.visualizeCollision - Show collision shapes (default: false)
 * @param {boolean} options.randomRotationY - Apply random Y-axis rotation (default: true)
 * @param {number} options.maxAttempts - Maximum spawn attempts per item (default: 20)
 * @returns {Object[]} - Array of objects with model, body, and sync properties
 */ export function spawnPhysicsGroup(prefabs, tankBounds, world, rapier) {
    var options = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : {};
    if (!(prefabs === null || prefabs === void 0 ? void 0 : prefabs.length) || !tankBounds || !world || !rapier) return [];
    var _options_margin = options.margin, margin = _options_margin === void 0 ? 0.1 : _options_margin, _options_radius = options.radius, radius = _options_radius === void 0 ? 0.5 : _options_radius, _options_minSpacing = options.minSpacing, minSpacing = _options_minSpacing === void 0 ? 0.2 : _options_minSpacing, _options_collisionType = options.collisionType, collisionType = _options_collisionType === void 0 ? 'box' : _options_collisionType, _options_collisionScale = options.collisionScale, collisionScale = _options_collisionScale === void 0 ? 0.9 : _options_collisionScale, _options_mass = options.mass, mass = _options_mass === void 0 ? 1 : _options_mass, _options_friction = options.friction, friction = _options_friction === void 0 ? 0.3 : _options_friction, _options_restitution = options.restitution, restitution = _options_restitution === void 0 ? 0.2 : _options_restitution, _options_visualizeCollision = options.visualizeCollision, visualizeCollision = _options_visualizeCollision === void 0 ? false : _options_visualizeCollision, _options_randomRotationY = options.randomRotationY, randomRotationY = _options_randomRotationY === void 0 ? true : _options_randomRotationY, _options_maxAttempts = options.maxAttempts, maxAttempts = _options_maxAttempts === void 0 ? 20 : _options_maxAttempts;
    // Force visualization off, overriding any passed option
    var effectiveVisualizeCollision = false;
    // Find a suitable anchor point for the group
    var tankWidth = tankBounds.max.x - tankBounds.min.x;
    var tankDepth = tankBounds.max.z - tankBounds.min.z;
    var anchorX, anchorZ, anchorHit; // Changed from anchorSurface
    var anchorAttempts = 10;
    // Try to find a good anchor point with enough surrounding space
    while(anchorAttempts--){
        anchorX = THREE.MathUtils.randFloatSpread(tankWidth * (1 - margin * 2)) + (tankBounds.min.x + tankBounds.max.x) / 2;
        anchorZ = THREE.MathUtils.randFloatSpread(tankDepth * (1 - margin * 2)) + (tankBounds.min.z + tankBounds.max.z) / 2;
        anchorHit = getSurfacePoint(anchorX, anchorZ, world, rapier); // Find the hit point
        if (anchorHit) break;
    }
    if (!anchorHit) return []; // Couldn't find a suitable anchor point
    var physicsObjects = [];
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
        // Create the physics objects
        for(var _iterator = prefabs[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
            var _loop = function() {
                // Random position within cluster radius, weighted toward center
                var angle = Math.random() * Math.PI * 2;
                // Use sqrt for more natural distribution
                var distance = Math.sqrt(Math.random()) * radius;
                var x = anchorHit.x + Math.cos(angle) * distance; // Use anchorHit.x/z
                var z = anchorHit.z + Math.sin(angle) * distance;
                // Skip if too close to already placed objects
                if (isTooClose(x, z)) return "continue";
                var surfaceHit = getSurfacePoint(x, z, world, rapier); // Expect hit object
                if (!surfaceHit) return "continue";
                // --- Use placePrefabOnSurface for initial placement and rotation ---
                // Pass the randomRotationY option down
                var model = placePrefabOnSurface(prefab, surfaceHit, 0.02, randomRotationY);
                if (!model) return "continue" // Placement failed
                ;
                // Optional: Add extra small random tilt *after* alignment if desired
                // model.rotation.x += THREE.MathUtils.randFloatSpread(0.05);
                // model.rotation.z += THREE.MathUtils.randFloatSpread(0.05);
                // model.updateMatrix(); // Update matrix after rotation
                // Generate appropriate collision volume
                var collisionDesc = void 0;
                if (typeof collisionType === 'string') {
                    // Create a new collision descriptor based on the model
                    collisionDesc = createBoundingVolume(model, {
                        type: collisionType,
                        scale: collisionScale,
                        alignToBottom: true,
                        visualize: effectiveVisualizeCollision // Use the forced value
                    });
                } else if ((typeof collisionType === "undefined" ? "undefined" : _type_of(collisionType)) === 'object') {
                    // Use provided collision descriptor directly
                    collisionDesc = collisionType;
                }
                if (!collisionDesc) {
                    console.warn('Failed to create collision descriptor');
                    return "continue";
                }
                // Add the debug visualization to the model if requested and available
                if (effectiveVisualizeCollision && collisionDesc.debugMesh) {
                    model.add(collisionDesc.debugMesh);
                }
                // Create the rigid body description
                var bodyDesc = rapier.RigidBodyDesc.dynamic().setTranslation(model.position.x, model.position.y, model.position.z).setRotation(new rapier.Quaternion(model.quaternion.x, model.quaternion.y, model.quaternion.z, model.quaternion.w)).setLinearDamping(0.4).setAngularDamping(0.4);
                if (mass > 0) {
                    bodyDesc.setMass(mass);
                }
                // Create the actual body in the physics world
                var body = world.createRigidBody(bodyDesc);
                // Create the appropriate collider based on collision type
                var colliderDesc = void 0;
                switch(collisionDesc.type){
                    case 'box':
                        colliderDesc = rapier.ColliderDesc.cuboid(collisionDesc.halfExtents.x, collisionDesc.halfExtents.y, collisionDesc.halfExtents.z);
                        break;
                    case 'sphere':
                        colliderDesc = rapier.ColliderDesc.ball(collisionDesc.radius);
                        break;
                    case 'capsule':
                        colliderDesc = rapier.ColliderDesc.capsule(collisionDesc.height * 0.5 - collisionDesc.radius, collisionDesc.radius);
                        break;
                    case 'cylinder':
                        colliderDesc = rapier.ColliderDesc.cylinder(collisionDesc.height * 0.5, collisionDesc.radius);
                        break;
                    case 'convex':
                    case 'hull':
                        if (collisionDesc.vertices && collisionDesc.vertices.length >= 4) {
                            var flatVertices = new Float32Array(collisionDesc.vertices.length * 3);
                            collisionDesc.vertices.forEach(function(vertex, i) {
                                flatVertices[i * 3] = vertex.x;
                                flatVertices[i * 3 + 1] = vertex.y;
                                flatVertices[i * 3 + 2] = vertex.z;
                            });
                            colliderDesc = rapier.ColliderDesc.convexHull(flatVertices);
                        } else {
                            console.warn('Insufficient vertices for convex hull, falling back to box');
                            colliderDesc = rapier.ColliderDesc.cuboid(0.5, 0.5, 0.5);
                        }
                        break;
                    default:
                        console.warn("Unsupported collision type ".concat(collisionDesc.type, ", falling back to box"));
                        colliderDesc = rapier.ColliderDesc.cuboid(0.5, 0.5, 0.5);
                }
                // Set material properties
                colliderDesc.setFriction(friction);
                colliderDesc.setRestitution(restitution);
                // Apply offset if needed (relative to body)
                if (collisionDesc.position) {
                    var posOffset = new THREE.Vector3().copy(collisionDesc.position).sub(model.position); // Get offset relative to model origin
                    // Rotate offset into body's local frame
                    var invRot = new THREE.Quaternion().copy(model.quaternion).invert();
                    posOffset.applyQuaternion(invRot);
                    if (posOffset.length() > 0.001) {
                        colliderDesc.setTranslation(posOffset.x, posOffset.y, posOffset.z);
                    }
                }
                // Create the collider and attach it to the body
                var collider = world.createCollider(colliderDesc, body);
                // SAFE: Store IDs instead of direct references to avoid circular refs
                body.userData = {
                    type: 'physicsObject',
                    objectId: model.uuid,
                    colliderId: collider.handle
                };
                model.userData = model.userData || {};
                model.userData.physicsBodyId = body.handle;
                // Setup synchronization (will need to be called in an animation loop)
                var sync = function() {
                    if (!body.isValid()) return; // Don't sync static or invalid bodies
                    var position = body.translation();
                    var rotation = body.rotation();
                    model.position.set(position.x, position.y, position.z);
                    model.quaternion.set(rotation.x, rotation.y, rotation.z, rotation.w);
                };
                // Create a safe object lookup method using closures
                var getById = {
                    getBody: function() {
                        return body;
                    },
                    getModel: function() {
                        return model;
                    },
                    getCollider: function() {
                        return collider;
                    }
                };
                // Store the object data
                physicsObject = {
                    model: model,
                    body: body,
                    collider: collider,
                    sync: sync,
                    getById: getById
                };
                // Track position for spacing check
                occupiedPositions.push({
                    x: model.position.x,
                    z: model.position.z
                }); // Use final model pos
                physicsObjects.push(physicsObject);
            };
            var prefab = _step.value;
            var attempts = maxAttempts;
            var physicsObject = null;
            while(attempts-- && !physicsObject)_loop();
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
    return physicsObjects;
}
// Import the factory function instead of the prefab instance
// Import the factory function instead of the prefab instance
import { createSeaweed } from 'seaweedPrefab'; // Adjusted import path assuming flat structure
// --- Seaweed Spawning ---
/**
 * Spawns one seaweed stalk at a given position.
 * @param {THREE.Scene} scene
 * @param {THREE.Vector3 | {x: number, y: number, z: number}} position - The world position to place the seaweed base.
 * @param {object} [opts] – forwarded to createSeaweed()
 * @returns {THREE.Mesh} The created seaweed mesh.
 */ export function spawnSeaweed(scene, position) {
    var opts = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    var seaweed = createSeaweed(opts);
    // Use copy for Vector3, set for object literal
    if (_instanceof(position, THREE.Vector3)) {
        seaweed.position.copy(position);
    } else {
        seaweed.position.set(position.x, position.y, position.z);
    }
    // Add standard userData flag
    seaweed.userData.isSeaweed = true;
    scene.add(seaweed);
    return seaweed; // Return the created mesh
}
/* --------------------------------------------------------------------------
 * 🌐  Default export for legacy imports
 *   Older code still does:
 *       import spawnHelpers from './utilsSpawnHelpers.js';
 *   Provide an object map so those imports resolve until refactor.
 * ------------------------------------------------------------------------ */ var spawnHelpers = {
    // spawnFish, // Not defined in this file
    spawnSeaweed: spawnSeaweed,
    // spawnCoral, // Placeholder comment
    // spawnBubbles, // Placeholder comment
    placePrefabOnSurface: placePrefabOnSurface,
    getSurfacePoint: getSurfacePoint,
    spawnItem: spawnItem,
    spawnGrouped: spawnGrouped,
    createBoundingVolume: createBoundingVolume,
    spawnWithPhysics: spawnWithPhysics,
    spawnPhysicsGroup: spawnPhysicsGroup
};
/* --------------------------------------------------------------------------
 * THREE-only fallback for when Rapier has no colliders yet.
 * ------------------------------------------------------------------ */ /**
 * Ray-cast the entire THREE scene (no physics) to find the first mesh
 * under (x, z).  Returns { x,y,z, normal } like getSurfacePoint().
 * Pass `filterFn` to accept / reject meshes (e.g., sand mounds only).
 */ export function raycastSceneSurface(x, z, scene) {
    var filterFn = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : function() {
        return true;
    }, maxHeight = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : 100;
    var _hit_face;
    var raycaster = new Raycaster();
    raycaster.firstHitOnly = true; // need the nearest one
    raycaster.layers.set(0); // Target layer 0 (terrain & mounds)
    raycaster.set(new Vector3(x, maxHeight, z), new Vector3(0, -1, 0));
    // Collect visible meshes on layer 0 that pass the filter function
    var layer0Meshes = [];
    scene.traverse(function(obj) {
        // Check if the object is a mesh, is visible, is on layer 0, and passes the filterFn
        if (obj.isMesh && obj.visible && obj.layers.test(raycaster.layers) && filterFn(obj)) {
            layer0Meshes.push(obj);
        }
    });
    // Intersect ONLY the collected layer 0 meshes. No need for recursive check (false).
    var rawHits = raycaster.intersectObjects(layer0Meshes, false);
    // Filter out water explicitly via userData flag, seaweed, and apply custom filterFn
    var hits = rawHits.filter(function(h) {
        var obj = h.object;
        var isSeaweed = obj.userData.isSeaweed || obj.parent && obj.parent.userData.isSeaweed;
        // Explicitly check the isWater flag as requested
        var hitIsWater = obj.userData.isWater === true;
        // Apply the original filterFn passed to the function
        // filterFn was already applied when collecting meshes
        return !hitIsWater && !isSeaweed;
    });
    var hit = hits[0]; // Get the first valid hit
    if (!hit) return null;
    return {
        x: hit.point.x,
        y: hit.point.y,
        z: hit.point.z,
        normal: ((_hit_face = hit.face) === null || _hit_face === void 0 ? void 0 : _hit_face.normal) ? hit.face.normal.clone().applyMatrix3(new THREE.Matrix3().getNormalMatrix(hit.object.matrixWorld)).normalize() : new Vector3(0, 1, 0),
        object: hit.object
    };
}
// Also add the new function to the default export for legacy compatibility
spawnHelpers.raycastSceneSurface = raycastSceneSurface;
export default spawnHelpers;
