function _array_like_to_array(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}
function _array_with_holes(arr) {
    if (Array.isArray(arr)) return arr;
}
function _iterable_to_array_limit(arr, i) {
    var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];
    if (_i == null) return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _s, _e;
    try {
        for(_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true){
            _arr.push(_s.value);
            if (i && _arr.length === i) break;
        }
    } catch (err) {
        _d = true;
        _e = err;
    } finally{
        try {
            if (!_n && _i["return"] != null) _i["return"]();
        } finally{
            if (_d) throw _e;
        }
    }
    return _arr;
}
function _non_iterable_rest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _sliced_to_array(arr, i) {
    return _array_with_holes(arr) || _iterable_to_array_limit(arr, i) || _unsupported_iterable_to_array(arr, i) || _non_iterable_rest();
}
function _unsupported_iterable_to_array(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _array_like_to_array(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(n);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _array_like_to_array(o, minLen);
}
import { jsxDEV as _jsxDEV } from "react/jsx-dev-runtime";
import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useThree } from '@react-three/fiber';
import CoralCluster from './CoralCluster.js';
import { TANK_DIMENSIONS } from './utilsTankConstants.js';
import { getMoundSurfaceHeight } from 'getMoundSurfaceHeight'; // Assume this exists and works
import { isValidCoralSpawn } from './isValidCoralSpawn.js';
// Constants for spawning
var DEFAULT_CORAL_COUNT = 25;
var CORAL_CLEARANCE = 0.6; // Min distance between coral clusters
var MAX_SPAWN_ATTEMPTS_PER_CORAL = 50;
var CORAL_BASE_Y_OFFSET = 0.05; // Slightly lift coral base off the surface
// Helper to find potential surfaces (mounds and floor)
// Updated to find both 'sandmound' prefixed meshes and a potential 'AquariumFloor'
// Ensure the original findIntersectableSurfaces structure is correct
var findIntersectableSurfaces = function(scene) {
    var surfaces = [];
    console.log("--- CoralField: Scanning for intersectable surfaces ---"); // Restore logging start
    scene.traverse(function(child) {
        if (child.isMesh) {
            var _child_name;
            var nameLower = ((_child_name = child.name) === null || _child_name === void 0 ? void 0 : _child_name.toLowerCase()) || '[unnamed]';
            console.log("  Found mesh: '".concat(child.name, "' (lower: '").concat(nameLower, "')")); // Restore mesh logging
            // Add sand mounds
            if (nameLower.startsWith('sandmound')) {
                console.log("    -> Adding '".concat(child.name, "' as sand mound surface."));
                surfaces.push(child);
            } else if (nameLower === 'aquariumfloor' || nameLower === 'tankfloor') {
                console.log("    -> Adding '".concat(child.name, "' as floor surface."));
                surfaces.push(child);
            }
        }
    }); // Restore traversal end
    // Enhanced logging within findIntersectableSurfaces
    // Removed misplaced imports from inside the function
    // Removed duplicated constants and function definition below
    // The nested function definition from line 22 to 50 below is removed entirely.
    // The outer function definition (lines 17-50 in the *previous* state,
    // now just lines 17-18 because the inner part is gone) should correctly close
    // before the export default.
    // Let's fix the outer function closing brace. It should be after the return statement.
    // ... (inner logic of the *original* findIntersectableSurfaces remains here) ...
    console.log("--- Scan complete ---");
    if (surfaces.length === 0) {
        console.warn("CoralField: Could not find any 'sandmound', 'aquariumfloor', or 'tankfloor' meshes to use as spawning surfaces.");
    } else {
        console.log("CoralField: Added ".concat(surfaces.length, " surfaces to the intersection list."));
    }
    return surfaces;
}; // This closing brace now correctly ends the *outer* findIntersectableSurfaces function.
export default function CoralField(param) {
    var _this = this;
    var _param_count = param.count, count = _param_count === void 0 ? DEFAULT_CORAL_COUNT : _param_count, _param_clearance = param.clearance, clearance = _param_clearance === void 0 ? CORAL_CLEARANCE : _param_clearance;
    var scene = useThree().scene;
    var _useState = _sliced_to_array(useState([]), 2), coralPositions = _useState[0], setCoralPositions = _useState[1];
    var intersectableSurfacesRef = useRef([]); // Store found surfaces
    useEffect(function() {
        if (!scene || !TANK_DIMENSIONS.innerBoundsBox) {
            console.log("CoralField: Waiting for scene and tank dimensions...");
            return;
        }
        // Find potential surfaces once
        intersectableSurfacesRef.current = findIntersectableSurfaces(scene);
        if (intersectableSurfacesRef.current.length === 0) {
            console.warn("CoralField: No suitable surfaces found for spawning coral. Aborting.");
            setCoralPositions([]); // Clear positions if no surfaces found
            return;
        }
        var positions = [];
        var bounds = TANK_DIMENSIONS.innerBoundsBox;
        var waterFloorY = TANK_DIMENSIONS.origin.y; // Use tank origin Y as floor level
        var maxTotalAttempts = count * MAX_SPAWN_ATTEMPTS_PER_CORAL;
        var attempts = 0;
        var tempPos = new THREE.Vector3(); // Reusable vector
        console.log("CoralField: Attempting to spawn ".concat(count, " corals. Water floor: ").concat(waterFloorY.toFixed(3)));
        while(positions.length < count && attempts < maxTotalAttempts){
            attempts++;
            // Generate a random X, Z within the tank bounds
            var x = THREE.MathUtils.lerp(bounds.min.x, bounds.max.x, Math.random());
            var z = THREE.MathUtils.lerp(bounds.min.z, bounds.max.z, Math.random());
            // Use a high Y for the initial check, assuming getMoundSurfaceHeight raycasts downwards
            tempPos.set(x, bounds.max.y + 1, z); // Start raycast check from above bounds max y
            // Check if this potential (x, z) is valid before calculating exact Y
            // Pass the found surfaces to isValidCoralSpawn
            var preliminaryValid = isValidCoralSpawn(tempPos, positions, clearance, intersectableSurfacesRef.current, waterFloorY);
            // Log the attempt *before* validation
            var surfaceY = getMoundSurfaceHeight(x, z, intersectableSurfacesRef.current, CORAL_BASE_Y_OFFSET);
            // Log the result of getMoundSurfaceHeight for every attempt
            console.log("  Attempt ".concat(attempts, ": Target (X: ").concat(x.toFixed(2), ", Z: ").concat(z.toFixed(2), "). Surface check returned Y: ").concat(surfaceY !== null ? surfaceY.toFixed(3) : 'null'));
            // Use isValidCoralSpawn for the preliminary check now that we have surfaceY (or null)
            var potentialPos = surfaceY !== null ? new THREE.Vector3(x, surfaceY, z) : null;
            // isValidCoralSpawn now handles the surfaceY check internally (based on its code)
            // We just need to pass it the potential position (or null if no surface hit)
            preliminaryValid = isValidCoralSpawn(potentialPos, positions, clearance, intersectableSurfacesRef.current, waterFloorY);
            if (preliminaryValid && potentialPos) {
                // The proximity check is already done within isValidCoralSpawn now based on its logic.
                // If it returned true, we can add the position.
                positions.push(potentialPos); // Use the validated potentialPos directly
                console.log("    -> SUCCESS: Added coral #".concat(positions.length, " at (X: ").concat(potentialPos.x.toFixed(2), ", Y: ").concat(potentialPos.y.toFixed(2), ", Z: ").concat(potentialPos.z.toFixed(2), ")"));
            } else if (!preliminaryValid) {
                // Log why it might have failed (based on isValidCoralSpawn logic)
                if (surfaceY === null) {
                    console.log("    -> FAILED: No valid surface hit at this X/Z.");
                } else if (surfaceY < waterFloorY) {
                    console.log("    -> FAILED: Surface hit at Y ".concat(surfaceY.toFixed(3), " is below water floor Y ").concat(waterFloorY.toFixed(3), "."));
                } else {
                    console.log("    -> FAILED: Proximity check failed."); // Assuming proximity is the other reason
                }
            }
        }
        if (positions.length < count) {
            console.warn("CoralField: Only managed to spawn ".concat(positions.length, "/").concat(count, " corals after ").concat(attempts, " attempts."));
        } else {
            console.log("CoralField: Successfully spawned ".concat(positions.length, " corals."));
        }
        setCoralPositions(positions);
    }, [
        scene,
        count,
        clearance
    ]); // Re-run if scene, count, or clearance changes
    // Only render if positions have been calculated
    if (coralPositions.length === 0) {
        return null;
    }
    return /*#__PURE__*/ _jsxDEV("group", {
        name: "CoralFieldGroup",
        children: coralPositions.map(function(pos, index) {
            return /*#__PURE__*/ _jsxDEV(CoralCluster, {
                position: pos
            }, "coral-".concat(index), false, {
                fileName: "CoralField.js",
                lineNumber: 153,
                columnNumber: 17
            }, _this);
        })
    }, void 0, false, {
        fileName: "CoralField.js",
        lineNumber: 151,
        columnNumber: 9
    }, this);
}
