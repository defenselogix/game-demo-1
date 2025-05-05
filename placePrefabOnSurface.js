import * as THREE from 'three';
/**
 * Seats `prefab` so its lowest vertex *along the surface normal* touches `surfacePoint`.
 * Works on slopes because we project every corner of the world-space AABB onto the normal.
 */ export function placePrefabOnSurface(prefab, surfacePoint, normal) {
    // (1) Orient the prefab so local +Y follows the normal
    var up = new THREE.Vector3(0, 1, 0);
    prefab.quaternion.setFromUnitVectors(up, normal);
    // (2) Rough-place, then compute the world-space AABB
    prefab.position.copy(surfacePoint);
    prefab.updateMatrixWorld(true);
    var box = new THREE.Box3().setFromObject(prefab);
    // (3) Build the 8 corner points of the AABB
    var corners = [
        new THREE.Vector3(box.min.x, box.min.y, box.min.z),
        new THREE.Vector3(box.min.x, box.min.y, box.max.z),
        new THREE.Vector3(box.min.x, box.max.y, box.min.z),
        new THREE.Vector3(box.min.x, box.max.y, box.max.z),
        new THREE.Vector3(box.max.x, box.min.y, box.min.z),
        new THREE.Vector3(box.max.x, box.min.y, box.max.z),
        new THREE.Vector3(box.max.x, box.max.y, box.min.z),
        new THREE.Vector3(box.max.x, box.max.y, box.max.z)
    ];
    // (4) Find the corner with the smallest projection on the normal
    var minProj = Infinity;
    corners.forEach(function(p) {
        var proj = normal.dot(p);
        if (proj < minProj) minProj = proj;
    });
    // (5) Bring that lowest point up to the surfacePoint (plus a 2 mm inset)
    var surfaceProj = normal.dot(surfacePoint);
    var delta = surfaceProj - minProj + 0.002; // ε = 2 mm
    prefab.position.addScaledVector(normal, delta);
}
