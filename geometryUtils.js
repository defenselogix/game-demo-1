import * as THREE from 'three';
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
    var boundaryType = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : 'tankBoundary';
    if (!world || !rapier) return null;
    // Start ray from top of tank (using a high Y value)
    var rayOrigin = new THREE.Vector3(x, 10, z);
    var rayDir = new THREE.Vector3(0, -1, 0);
    var ray = new rapier.Ray(rayOrigin, rayDir);
    var maxToi = 20.0; // Max distance for ray
    // Support for multiple boundary types (string or array)
    var boundaryTypes = Array.isArray(boundaryType) ? boundaryType : [
        boundaryType
    ];
    // Cast ray, looking for hits with boundary colliders
    var hit = world.castRay(ray, maxToi, true, undefined, undefined, undefined, undefined, function(collider) {
        var _parentBody_userData;
        var parentBody = collider.parent();
        if (!parentBody || !((_parentBody_userData = parentBody.userData) === null || _parentBody_userData === void 0 ? void 0 : _parentBody_userData.type)) return false;
        // Check if the collider's type matches any of our acceptable types
        return boundaryTypes.includes(parentBody.userData.type);
    });
    if (hit) {
        var hitPoint = rayOrigin.clone().addScaledVector(rayDir, hit.toi);
        // Return hit info including the type if available
        return {
            x: hitPoint.x,
            y: hitPoint.y,
            z: hitPoint.z,
            collider: hit.collider,
            normal: hit.normal,
            toi: hit.toi
        };
    }
    return null;
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
 */ export function extractVertices(object) {
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
