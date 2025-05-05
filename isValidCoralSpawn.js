function _instanceof(left, right) {
    if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) {
        return !!right[Symbol.hasInstance](left);
    } else {
        return left instanceof right;
    }
}
import * as THREE from 'three';
import { getMoundSurfaceHeight } from 'getMoundSurfaceHeight'; // Import the height function
/**
 * Checks if a potential spawn position is valid based on surface height and proximity.
 * 1. Checks if the (x, z) point hits a valid surface above the water floor.
 * 2. Checks if the potential position is too close to existing positions.
 *
 * @param {THREE.Vector3} potentialPosition - The potential 3D position to check (Y value might be preliminary).
 * @param {Array<THREE.Vector3>} existingPositions - Array of already placed final positions.
 * @param {number} clearance - The minimum allowed distance between final positions.
 * @param {Array<THREE.Object3D>} intersectableObjects - Objects to raycast against for surface check (e.g., mounds, floor).
 * @param {number} waterFloorY - The minimum Y level considered valid (e.g., tank floor height).
 * @returns {boolean} - True if the position is valid, false otherwise.
 */ export var isValidCoralSpawn = function(potentialPosition, existingPositions, clearance, intersectableObjects, waterFloorY) {
    // Check 1: Was a valid position object even passed? (i.e., did getMoundSurfaceHeight return a valid Y?)
    if (!potentialPosition || !_instanceof(potentialPosition, THREE.Vector3)) {
        // console.log("isValidCoralSpawn: Failed - No valid potentialPosition provided.");
        return false;
    }
    // Check 2: Is the potential position's Y value valid (above the floor)?
    // This check might seem redundant if getMoundSurfaceHeight already respects an offset,
    // but it's good to be explicit, especially comparing against waterFloorY.
    if (potentialPosition.y < waterFloorY) {
        // console.log(`isValidCoralSpawn: Failed - potential Y ${potentialPosition.y.toFixed(3)} is below floor Y ${waterFloorY.toFixed(3)}.`);
        return false;
    }
    // Check 3: Is the potential position too close to existing ones?
    var tooClose = existingPositions.some(function(existingPos) {
        return potentialPosition.distanceTo(existingPos) < clearance;
    });
    if (tooClose) {
        // console.log(`isValidCoralSpawn: Failed - Proximity check failed for (${potentialPosition.x.toFixed(2)}, Y: ${potentialPosition.y.toFixed(2)}, Z: ${potentialPosition.z.toFixed(2)})`);
        return false; // Failed proximity check
    }
    // If all checks pass, the position is considered valid for spawning.
    // console.log(`isValidCoralSpawn: Success for (${potentialPosition.x.toFixed(2)}, Y: ${potentialPosition.y.toFixed(2)}, Z: ${potentialPosition.z.toFixed(2)})`);
    return true;
};
