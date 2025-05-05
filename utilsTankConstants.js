import * as THREE from 'three';
// Define the physical boundaries of the fish tank
// Dimensions based on envMeshes.js: width: 14.4, height: 6.0, depth: 14.4
// Assuming the tank base center is at (0, 0, 0) for simplicity in bounds calculation.
// Adjust Y min/max based on where the actual floor and water surface are meant to be.
// The floor in envMeshes seems complex, but let's define a simplified bounding box.
var tankWidth = 14.4;
var tankHeight = 6.0; // Full height of the glass structure
var tankDepth = 14.4;
var wallThickness = 0.1;
// Calculate the inner bounds, considering wall thickness
var innerWidth = tankWidth - wallThickness * 2;
var innerDepth = tankDepth - wallThickness * 2;
// Define usable vertical range based on the tank's *new* raised position.
// Tank center Y is now at 4.0 (WATER_LEVEL=5.1 + RIM_CLEARANCE=1.9 - TANK_HEIGHT/2=3.0).
// Inner floor is approx. at Y = 4.0 - 3.0 + wallThickness = 1.0 + 0.1 = 1.1
// Inner top rim is approx. at Y = 4.0 + 3.0 = 7.0
var minY = 1.1 + 0.1; // Inner floor + buffer = 1.2
var maxY = 7.0 - 0.5; // Inner top rim - buffer = 6.5
export var tankBounds = {
    min: new THREE.Vector3(-innerWidth / 2, minY, -innerDepth / 2),
    max: new THREE.Vector3(innerWidth / 2, maxY, innerDepth / 2),
    size: new THREE.Vector3(innerWidth, maxY - minY, innerDepth),
    center: new THREE.Vector3(0, (minY + maxY) / 2, 0) // Center of the usable volume
};
/* legacy aliases ----------------------------------------------------------- */ //  Some older components still do:
//      import { tankMin, tankMax } from './utilsTankConstants.js';
//  Keep them working until all callers are migrated to `tankBounds`.
export var tankMin = tankBounds.min;
export var tankMax = tankBounds.max;
// Bounds define the usable inner volume for spawning
// Also export individual dimensions for convenience
export var TANK_DIMENSIONS = {
    width: tankWidth,
    height: tankHeight,
    depth: tankDepth,
    wallThickness: wallThickness,
    innerWidth: innerWidth,
    innerDepth: innerDepth,
    minY: minY,
    maxY: maxY
};
// 🔄 legacy aliases were already declared earlier – duplicate removed
/* --------------------------------------------------------------------------
 * 🌐  Default export for legacy imports
 *   Some older files still do:
 *       import tank from './utilsTankConstants.js';
 *   Provide an object so those imports succeed until refactor.
 * ------------------------------------------------------------------------ */ export default {
    tankBounds: tankBounds,
    tankMin: tankMin,
    tankMax: tankMax,
    TANK_DIMENSIONS: TANK_DIMENSIONS
};
