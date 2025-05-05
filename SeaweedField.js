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
import React, { useState, useEffect, Fragment, useRef } from 'react'; // Added useRef
import * as THREE from 'three'; // Keep existing THREE import
import { Raycaster, Vector3, Box3 } from 'three'; // Add specific imports
import { useThree, useFrame } from '@react-three/fiber'; // Import useFrame
// Removed createKelpGeometry import, will use PlantLife component
import { SeaweedMaterial } from './SeaweedShaderMaterial.js'; // Import shader material
import { KELP_BASE_HEIGHT, HEIGHT_VARIATION } from './spawnSeaweedCluster.js'; // Keep height constants for now
import PlantLife from './PlantLife.js'; // Import the PlantLife component (which contains SeaweedStrand)
import { TANK_DIMENSIONS } from './utilsTankConstants.js';
// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------
// Minimum gap (world-units) allowed between two spawned seaweed blades.
// Fixes: “ReferenceError: CLEARANCE is not defined” thrown inside
// `calculateSeaweedPositions`.
export var CLEARANCE = 0.25;
// Function to recursively find potential target meshes within a given object
var findIntersectable = function(obj) {
    var _obj_geometry, _obj_name, _obj_name1;
    var objects = [];
    // Check if the object itself is intersectable
    var isWall = ((_obj_geometry = obj.geometry) === null || _obj_geometry === void 0 ? void 0 : _obj_geometry.type) === 'BoxGeometry' && ((_obj_name = obj.name) === null || _obj_name === void 0 ? void 0 : _obj_name.includes('Wall')); // More specific wall check
    var isFloorPlaceholder = obj.name === 'AquariumFloor'; // Hypothetical floor name check
    var isWater = obj.name === 'WaterVolume'; // Exclude water volume
    var isPlant = (_obj_name1 = obj.name) === null || _obj_name1 === void 0 ? void 0 : _obj_name1.startsWith('plant-life'); // Exclude existing plants
    if (obj.isMesh && !isWall && !isFloorPlaceholder && !isWater && !isPlant) {
        objects.push(obj);
    }
    // Recursively check children
    obj.children.forEach(function(child) {
        objects = objects.concat(findIntersectable(child));
    });
    return objects;
};
// Extracted logic for calculating seaweed positions using THREE.js raycasting
// Now takes scene, tank dimensions, cluster count, and spread as arguments
/**
 * Generate spawn points. If `moundMeshes` is omitted the sampler falls back to
 * a simple world-bounds strategy so the function never returns `undefined`.
 */ export var calculateSeaweedPositions = function(param) {
    var bounds = param.bounds, _param_moundMeshes = param.moundMeshes, moundMeshes = _param_moundMeshes === void 0 ? [] : _param_moundMeshes, count = param.count, _param_maxAttempts = param.maxAttempts, maxAttempts = _param_maxAttempts === void 0 ? 25 : _param_maxAttempts, _param_clearance = param.clearance, clearance = _param_clearance === void 0 ? CLEARANCE : _param_clearance;
    // Always return an array – prevents “positions is undefined” runtime.
    var positions = [];
    var normals = []; // Add array to store normals
    // Guard: if both strategies have no data we can’t sample → return empty.
    if (!bounds && moundMeshes.length === 0) return positions; // no data
    // ───────── mound-constrained strategy ─────────
    if (moundMeshes.length) {
        var _loop = function() {
            var box = moundBoxes[Math.floor(Math.random() * moundBoxes.length)];
            tmp.copy(pickRandomPointInBox(box));
            raycaster.set(tmp, up);
            var hit = raycaster.intersectObjects(moundMeshes, false)[0];
            if (hit) {
                // Nudge each strand’s base 2 cm along the surface normal to prevent
                // clipping and store that normal for future tilt-alignment.
                var point = hit.point, face = hit.face;
                var nudged = face === null || face === void 0 ? void 0 : face.normal.clone().multiplyScalar(0.02); // 2 cm clearance
                var base = point.clone().add(nudged); // lifted above mesh
                var tooClose = positions.some(function(p) {
                    return p.distanceTo(base) < clearance;
                });
                if (!tooClose && (face === null || face === void 0 ? void 0 : face.normal)) {
                    positions.push(base);
                    normals.push(face.normal.clone()); // save for tilt
                }
            }
            tries++;
        };
        console.log("calculateSeaweedPositions: Using mound-constrained strategy with ".concat(moundMeshes.length, " mounds."));
        var raycaster = new THREE.Raycaster(); // Needs raycaster here
        var up = new Vector3(0, -1, 0); // Use THREE namespace
        var moundBoxes = moundMeshes.map(function(m) {
            return new THREE.Box3().setFromObject(m);
        }); // Use THREE namespace
        var pickRandomPointInBox = function(box) {
            return new THREE.Vector3(THREE.MathUtils.lerp(box.min.x, box.max.x, Math.random()), box.max.y + 0.2, THREE.MathUtils.lerp(box.min.z, box.max.z, Math.random()));
        };
        var tries = 0;
        var moundMaxAttempts = count * maxAttempts; // Consistent naming
        var tmp = new THREE.Vector3(); // Use THREE namespace
        while(positions.length < count && tries < moundMaxAttempts)_loop();
        if (positions.length < count) {
            console.warn("calculateSeaweedPositions (Mound): Only generated ".concat(positions.length, "/").concat(count, " positions after ").concat(tries, " attempts."));
        } else {
            console.info("calculateSeaweedPositions (Mound): Successfully generated ".concat(positions.length, " positions on SandMounds."));
        }
        // if nothing landed on mounds, fall back to world-bounds sampling
        if (positions.length) return {
            positions: positions,
            normals: normals
        }; // Return normals too
        console.warn("calculateSeaweedPositions: No hits on mounds, falling back to bounds sampling.");
    }
    // ───────── legacy world-box fallback ─────────
    if (bounds) {
        // Note: tmp is already initialized if mound strategy ran, but ensure it exists if only bounds are provided.
        var tmp1 = new Vector3(); // Use THREE namespace (Assuming Vector3 is imported or THREE is)
        var fallbackTries = 0;
        var fallbackMaxAttempts = count * maxAttempts;
        // Corrected loop condition: compare fallbackTries to fallbackMaxAttempts
        while(positions.length < count && fallbackTries < fallbackMaxAttempts){
            tmp1.set(THREE.MathUtils.lerp(bounds.min.x, bounds.max.x, Math.random()), bounds.max.y + 0.2, THREE.MathUtils.lerp(bounds.min.z, bounds.max.z, Math.random()));
            var tooClose = positions.some(function(p) {
                return p.distanceTo(tmp1) < clearance;
            });
            if (!tooClose) {
                positions.push(tmp1.clone());
            }
            fallbackTries++;
        }
        if (positions.length < count) {
            console.warn("calculateSeaweedPositions (Fallback): Only generated ".concat(positions.length, "/").concat(count, " positions after ").concat(fallbackTries, " attempts."));
        } else {
            console.info("calculateSeaweedPositions (Fallback): Generated ".concat(positions.length, " positions using bounds."));
        }
        // For fallback, add default up-normals
        var fallbackNormals = positions.map(function() {
            return new Vector3(0, 1, 0);
        });
        return {
            positions: positions,
            normals: fallbackNormals
        }; // Return default normals
    }
    return {
        positions: positions,
        normals: []
    }; // Return empty arrays if no strategy worked
};
// --- SeaweedField Component ---
/** Spawns multiple PlantLife clusters that hug the terrain surface (mounds included). */ // Number of individual strands per cluster point
var STRANDS_PER_CLUSTER = 4; // Increased from 3 to 4 for slightly denser clusters
var CLUSTER_SPREAD_RADIUS = 0.15; // How far strands spread within a cluster
export default function SeaweedField(param) {
    var _this = this;
    var _param_clusters = param.clusters, clusters = _param_clusters === void 0 ? 35 : _param_clusters, _param_spread = param.spread, spread = _param_spread === void 0 ? 0.6 : _param_spread;
    var scene = useThree().scene;
    var _useState = _sliced_to_array(useState({
        positions: [],
        normals: []
    }), 2), positionData = _useState[0], setPositionData = _useState[1]; // Store positions and normals
    // Removed kelpGeometries ref - no longer caching custom geometry
    var sharedMaterial = useRef(new SeaweedMaterial()); // Create and store shared material instance
    // Removed getKelpGeometry function
    // always work with an array—even if some async path passes `undefined`
    var safePositions = Array.isArray(positionData.positions) ? positionData.positions : [];
    var safeNormals = Array.isArray(positionData.normals) ? positionData.normals : [];
    var clusterRefs = useRef([]); // Ref to hold refs of the first 20 *cluster groups*
    var auditLogged = useRef(false); // Flag to ensure audit logs only once
    // Effect to calculate positions once the scene is ready
    useEffect(function() {
        if (!scene) {
            console.log("SeaweedField: Waiting for scene context...");
            return;
        }
        // Extract mound meshes from the scene graph, checking name prefix case-insensitively
        var moundMeshes = findIntersectable(scene).filter(function(obj) {
            var _obj_name;
            return (_obj_name = obj.name) === null || _obj_name === void 0 ? void 0 : _obj_name.toLowerCase().startsWith('sandmound') // More flexible check
            ;
        });
        console.log("SeaweedField: Found ".concat(moundMeshes.length, " objects starting with 'SandMound' for positioning."));
        // Calculate positions using the updated function
        var calculatedPositions = calculateSeaweedPositions({
            bounds: TANK_DIMENSIONS.innerBoundsBox,
            moundMeshes: moundMeshes,
            count: clusters,
            clearance: CLEARANCE // Use the defined constant
        });
        // Ensure we always set an object with arrays, even if calculation fails
        var resultData = calculatedPositions && Array.isArray(calculatedPositions.positions) && Array.isArray(calculatedPositions.normals) ? calculatedPositions : {
            positions: [],
            normals: []
        };
        setPositionData(resultData);
        auditLogged.current = false; // Reset audit flag when positions regenerate
        clusterRefs.current = []; // Clear previous refs for clusters
        // Cleanup function (optional, but good practice)
        return function() {
            // console.log("SeaweedField: Cleaning up effect.");
            setPositionData({
                positions: [],
                normals: []
            }); // Clear data on unmount or re-run
        };
    }, [
        clusters,
        spread,
        scene
    ]); // Dependencies remain the same
    // Update shader time uniform on each frame
    useFrame(function(state) {
        if (sharedMaterial.current) {
            sharedMaterial.current.uniforms.time.value = state.clock.elapsedTime;
        }
    });
    // Effect to perform the audit log after positions are set and components likely rendered
    useEffect(function() {
        // Audit the *cluster group* positions now
        if (safePositions.length > 0 && !auditLogged.current && clusterRefs.current.length > 0) {
            var auditData = [];
            var tempVec = new THREE.Vector3(); // Reuse vector object
            var auditLimit = Math.min(20, safePositions.length, clusterRefs.current.length); // Ensure we don't exceed available refs
            var timer = setTimeout(function() {
                console.log("--- Seaweed Cluster Position Audit (First ".concat(auditLimit, " Groups) ---"));
                for(var i = 0; i < auditLimit; i++){
                    var _clusterRefs_current_i;
                    var group = (_clusterRefs_current_i = clusterRefs.current[i]) === null || _clusterRefs_current_i === void 0 ? void 0 : _clusterRefs_current_i.current; // Get the cluster group ref
                    if (group && safePositions[i]) {
                        group.getWorldPosition(tempVec);
                        var calculatedY = safePositions[i].y; // Access y component of Vector3
                        var actualWorldY = tempVec.y;
                        var delta = Math.abs(actualWorldY - calculatedY);
                        var highlight = delta > 0.02 ? ' *****' : ''; // Highlight large deltas
                        auditData.push({
                            index: i,
                            calcY: calculatedY.toFixed(4),
                            actualY: actualWorldY.toFixed(4),
                            delta: delta.toFixed(4) + highlight
                        });
                        // Detailed warning log remains similar, just note it's the group position
                        if (delta > 0.02) {
                            var path = '';
                            var currentObj = group;
                            var localY = group.position.y.toFixed(4);
                            while(currentObj && currentObj !== scene){
                                path = "".concat(currentObj.name || '[unnamed]').concat(path ? ' > ' + path : '');
                                currentObj = currentObj.parent;
                            }
                            console.warn("[CLUSTER AUDIT DETAIL #".concat(i, "] Large Delta Detected!"), "\n  - Index: ".concat(i), "\n  - Calculated Group Y: ".concat(calculatedY.toFixed(4)), "\n  - Actual Group World Y: ".concat(actualWorldY.toFixed(4)), "\n  - Delta: ".concat(delta.toFixed(4)), "\n  - Group Local Y: ".concat(localY), "\n  - Object Path: Scene > ".concat(path));
                        }
                    } else {
                        var _safePositions_i_y, _safePositions_i;
                        var _safePositions_i_y_toFixed;
                        auditData.push({
                            index: i,
                            calcY: (_safePositions_i_y_toFixed = (_safePositions_i = safePositions[i]) === null || _safePositions_i === void 0 ? void 0 : (_safePositions_i_y = _safePositions_i.y) === null || _safePositions_i_y === void 0 ? void 0 : _safePositions_i_y.toFixed(4)) !== null && _safePositions_i_y_toFixed !== void 0 ? _safePositions_i_y_toFixed : 'N/A',
                            actualY: 'N/A (group ref/pos missing)',
                            delta: 'N/A'
                        });
                    }
                }
                if (auditData.length > 0) {
                    console.table(auditData);
                } else {
                    console.log("Seaweed Cluster Position Audit: No data to display (check refs and positions).");
                }
                auditLogged.current = true; // Mark audit as completed
            }, 100);
            return function() {
                return clearTimeout(timer);
            }; // Cleanup the timeout
        }
    }, [
        positionData,
        scene
    ]); // Rerun audit check if positionData or scene change
    // Render logic needs to use the stored normals too
    if (safePositions.length === 0) {
        return null;
    }
    return /*#__PURE__*/ _jsxDEV(Fragment, {
        children: safePositions.map(function(p, i) {
            // Get the ref for the cluster group (for audit logging)
            if (i < 20) {
                if (!clusterRefs.current[i]) {
                    clusterRefs.current[i] = /*#__PURE__*/ React.createRef();
                }
            }
            var clusterGroupRef = i < 20 ? clusterRefs.current[i] : undefined;
            var normal = safeNormals[i] || new Vector3(0, 1, 0); // Fallback normal if missing
            // Calculate base rotation for the cluster group to align with the surface normal
            var defaultUp = new THREE.Vector3(0, 1, 0);
            var groupRotationQuaternion = new THREE.Quaternion();
            if (normal && Math.abs(normal.dot(defaultUp)) < 0.999) {
                groupRotationQuaternion.setFromUnitVectors(defaultUp, normal);
            }
            return /*#__PURE__*/ _jsxDEV("group", {
                ref: clusterGroupRef,
                position: p,
                children: /*#__PURE__*/ _jsxDEV(PlantLife, {
                    position: [
                        0,
                        0,
                        0
                    ],
                    material: sharedMaterial.current
                }, "plant-".concat(i), false, {
                    fileName: "SeaweedField.js",
                    lineNumber: 267,
                    columnNumber: 13
                }, _this)
            }, "kelp-cluster-".concat(i), false, {
                fileName: "SeaweedField.js",
                lineNumber: 256,
                columnNumber: 11
            }, _this);
        })
    }, void 0, false, {
        fileName: "SeaweedField.js",
        lineNumber: 239,
        columnNumber: 5
    }, this);
}
