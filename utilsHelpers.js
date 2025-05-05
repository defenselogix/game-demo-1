/**
 * Shift any mesh/group or Rapier RigidBody so its lowest point rests exactly on `floorY`.
 * Works regardless of pivot or geometry centring.
 */ export function placeOnFloor(obj3D, floorY) {
    // Check if it's a Rapier RigidBody (duck typing based on expected methods)
    if (typeof (obj3D === null || obj3D === void 0 ? void 0 : obj3D.numColliders) === 'function' && typeof (obj3D === null || obj3D === void 0 ? void 0 : obj3D.translation) === 'function' && typeof (obj3D === null || obj3D === void 0 ? void 0 : obj3D.setTranslation) === 'function') {
        var pos = obj3D.translation(); // Current world position of the body's origin
        var overallAABB = new THREE.Box3(); // Use THREE.Box3 for convenience
        overallAABB.makeEmpty();
        // Iterate through colliders to compute the combined world AABB
        var numColliders = obj3D.numColliders();
        for(var i = 0; i < numColliders; i++){
            var collider = obj3D.collider(i);
            var colliderAABB = collider.computeAabb(); // This AABB is already in world coordinates
            // Expand the overall AABB using THREE.Vector3 instances
            overallAABB.expandByPoint(new THREE.Vector3(colliderAABB.min.x, colliderAABB.min.y, colliderAABB.min.z));
            overallAABB.expandByPoint(new THREE.Vector3(colliderAABB.max.x, colliderAABB.max.y, colliderAABB.max.z));
        }
        if (!overallAABB.isEmpty()) {
            var currentMinY = overallAABB.min.y;
            var delta = floorY - currentMinY;
            // Apply adjustment relative to current position
            obj3D.setTranslation({
                x: pos.x,
                y: pos.y + delta,
                z: pos.z
            }, true);
        } else {
            // Handle case with no colliders or empty AABB? Place origin at floorY.
            obj3D.setTranslation({
                x: pos.x,
                y: floorY,
                z: pos.z
            }, true);
            console.warn("placeOnFloor used on RigidBody with no colliders or empty AABB.");
        }
    } else if (obj3D === null || obj3D === void 0 ? void 0 : obj3D.isObject3D) {
        // Ensure matrixWorld is up-to-date before calculating the bounding box.
        if (obj3D.parent) {
            obj3D.parent.updateMatrixWorld(true); // Update from parent if available
        } else {
            obj3D.updateMatrixWorld(true); // Update object itself if no parent
        }
        var box = new THREE.Box3().setFromObject(obj3D); // Calculates AABB in world space
        if (!box.isEmpty()) {
            var delta1 = floorY - box.min.y; // how far to move down/up
            obj3D.position.y += delta1;
            // Update the matrix world again after changing position for consistency
            if (obj3D.parent) {
                obj3D.parent.updateMatrixWorld(true);
            } else {
                obj3D.updateMatrixWorld(true);
            }
        } else {
            // Handle empty bounding box for Three.js object (e.g., empty group)
            obj3D.position.y = floorY; // Place origin at floorY as fallback
            console.warn("placeOnFloor used on Object3D with empty bounding box.");
        }
    } else {
        console.warn("placeOnFloor called with an unsupported object type:", obj3D);
    }
}
// Placeholder for other helper functions
export var helperFunction = function() {
// Example helper
};
/* --------------------------------------------------------------------------
 * 🌐  Default export for legacy imports
 *   Some older code still does:
 *       import helpers from './utilsHelpers.js';
 *   Provide an object mapping to the named utilities so those imports succeed
 *   until everything is refactored to named imports.
 * ------------------------------------------------------------------------ */ var helpersDefault = {
    placeOnFloor: placeOnFloor,
    // randomFloat, // Add these back if/when they are defined in this file
    // clamp,       // Add these back if/when they are defined in this file
    helperFunction: helperFunction
};
export default helpersDefault;
