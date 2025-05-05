import * as THREE from 'three';
// Helper function to recursively collect intersectable meshes (excluding specific types)
var getIntersectableMeshes = function(object) {
    var excludeNames = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : [];
    var meshes = [];
    if (object.isMesh && !excludeNames.some(function(name) {
        var _object_name;
        return (_object_name = object.name) === null || _object_name === void 0 ? void 0 : _object_name.toLowerCase().includes(name.toLowerCase());
    })) {
        meshes.push(object);
    }
    object.children.forEach(function(child) {
        meshes = meshes.concat(getIntersectableMeshes(child, excludeNames));
    });
    return meshes;
};
/**
 * Performs a raycast from a starting point in a given direction to find the
 * intersection point and normal on the first hit mesh in the scene.
 *
 * @param {THREE.Object3D} scene - The scene object containing meshes to intersect.
 * @param {THREE.Vector3} startPosition - The starting point of the ray.
 * @param {THREE.Vector3} direction - The direction vector of the ray.
 * @param {number} [maxDistance=Infinity] - Maximum distance the ray should check for intersections.
 * @param {string[]} [excludeNames=[]] - Array of names (case-insensitive partial match) to exclude from intersection checks (e.g., 'water', 'wall').
 * @returns { { point: THREE.Vector3, normal: THREE.Vector3, distance: number, object: THREE.Object3D } | null } - The intersection data or null if no hit.
 */ export function getSurfacePoint(scene, startPosition, direction) {
    var maxDistance = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : Infinity, excludeNames = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : [
        'water',
        'wall',
        'plant',
        'fish'
    ];
    var raycaster = new THREE.Raycaster(startPosition, direction.normalize(), 0, maxDistance);
    var intersectableObjects = getIntersectableMeshes(scene, excludeNames);
    if (intersectableObjects.length === 0) {
        // console.warn("getSurfacePoint: No intersectable objects found in the scene.");
        return null;
    }
    var intersects = raycaster.intersectObjects(intersectableObjects, false); // `false` for non-recursive check as we collected meshes manually
    if (intersects.length > 0) {
        var hit = intersects[0];
        // Ensure the face and normal data are available
        if (hit.face && hit.face.normal) {
            // The normal is in local space of the object, transform it to world space
            var worldNormal = hit.face.normal.clone();
            worldNormal.transformDirection(hit.object.matrixWorld);
            worldNormal.normalize();
            return {
                point: hit.point,
                normal: worldNormal,
                distance: hit.distance,
                object: hit.object
            };
        } else {
            // Fallback if face/normal info is missing (e.g., points geometry)
            // console.warn("getSurfacePoint: Hit object lacks face normal data. Using default up normal.");
            return {
                point: hit.point,
                normal: new THREE.Vector3(0, 1, 0),
                distance: hit.distance,
                object: hit.object
            };
        }
    }
    return null; // No intersection found
}
