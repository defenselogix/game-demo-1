function _array_like_to_array(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}
function _array_without_holes(arr) {
    if (Array.isArray(arr)) return _array_like_to_array(arr);
}
function _construct(Parent, args, Class) {
    if (_is_native_reflect_construct()) {
        _construct = Reflect.construct;
    } else {
        _construct = function construct(Parent, args, Class) {
            var a = [
                null
            ];
            a.push.apply(a, args);
            var Constructor = Function.bind.apply(Parent, a);
            var instance = new Constructor();
            if (Class) _set_prototype_of(instance, Class.prototype);
            return instance;
        };
    }
    return _construct.apply(null, arguments);
}
function _define_property(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function _instanceof(left, right) {
    if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) {
        return !!right[Symbol.hasInstance](left);
    } else {
        return left instanceof right;
    }
}
function _iterable_to_array(iter) {
    if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}
function _non_iterable_spread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _set_prototype_of(o, p) {
    _set_prototype_of = Object.setPrototypeOf || function setPrototypeOf(o, p) {
        o.__proto__ = p;
        return o;
    };
    return _set_prototype_of(o, p);
}
function _to_consumable_array(arr) {
    return _array_without_holes(arr) || _iterable_to_array(arr) || _unsupported_iterable_to_array(arr) || _non_iterable_spread();
}
function _unsupported_iterable_to_array(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _array_like_to_array(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(n);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _array_like_to_array(o, minLen);
}
function _is_native_reflect_construct() {
    try {
        var result = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}));
    } catch (_) {}
    return (_is_native_reflect_construct = function() {
        return !!result;
    })();
}
import { jsxDEV as _jsxDEV } from "react/jsx-dev-runtime";
import React, { useMemo, useRef, useEffect } from 'react'; // Import useEffect
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { SeaweedMaterial } from './SeaweedShaderMaterial.js'; // Import the shader material
import { TANK_DIMENSIONS } from './utilsTankConstants.js';
// --- Configuration ---
var STRAND_COUNT = 5; // How many main "plants" per cluster
var STRAND_HEIGHT_BASE = 2.8; // Increased base height significantly
var STRAND_HEIGHT_VAR = 1.2; // Increased variation for more length difference
// STALK_SEGMENTS, STALK_SEGMENT_HEIGHT, STALK_WIDTH are no longer used for tube geometry
// const STALK_SEGMENT_HEIGHT = 0.3;
// const STALK_WIDTH = 0.08;
var LEAF_COUNT_PER_SEGMENT = 2; // Number of leaves branching from each segment joint (except base)
// LEAF_WIDTH, LEAF_LENGTH, LEAF_THICKNESS are no longer used for the old leaf style
// const LEAF_LENGTH = 0.6;
// const LEAF_THICKNESS = 0.01;
var CLUSTER_RADIUS = 0.3; // How spread out the strands are at the base
var FRINGE_LENGTH = 0.15; // Max length of the fringe leaves
var FRINGE_WIDTH = 0.06; // Slightly reduced max width of the fringe leaves
var FRINGE_DENSITY = 0.6; // Slightly reduced chance (0-1) of a fringe appearing
var SWAY_SPEED = 0.3; // Slightly slower sway
var SWAY_AMOUNT = 0.15; // Slightly more sway
// --- Components ---
function SeaweedStrand(param) {
    var initialOffset = param.initialOffset, heightScale = param.heightScale, material = param.material;
    var meshRef = useRef();
    // Calculate total height based on base, variation, and scale
    var totalHeight = useMemo(function() {
        return (STRAND_HEIGHT_BASE + (Math.random() * 2 - 1) * STRAND_HEIGHT_VAR) * heightScale;
    }, [
        heightScale
    ]);
    var geometry = useMemo(function() {
        var _geom_boundingBox_min, _geom_boundingBox;
        var geom = new THREE.BufferGeometry();
        var vertices = [];
        var uvs = [];
        var indices = [];
        var vertexIndex = 0;
        var tempVec = new THREE.Vector3(); // For calculations
        var tempNorm = new THREE.Vector3(); // For normal calculations
        // Geometry constants
        var segments = 25; // More segments for longer strands
        var radialSegments = 10; // Slightly more sides for thicker tube
        var baseRadius = 0.18; // Increased base radius for thickness
        var waveFrequency = 1.8; // Lower frequency for broader waves on longer strands
        var waveAmplitude = 0.1; // Increased amplitude for more pronounced wave
        // Helper to add a quad (for fringe)
        var addFringeQuad = function(p1, p2, p3, p4) {
            var baseIndex = vertexIndex;
            vertices.push(p1.x, p1.y, p1.z, p2.x, p2.y, p2.z, p3.x, p3.y, p3.z, p4.x, p4.y, p4.z);
            // Simple UVs for the fringe (can be refined)
            uvs.push(0, 0, 1, 0, 1, 1, 0, 1);
            indices.push(baseIndex, baseIndex + 1, baseIndex + 2);
            indices.push(baseIndex, baseIndex + 2, baseIndex + 3);
            vertexIndex += 4;
        };
        for(var i = 0; i <= segments; i++){
            var v = i / segments; // Vertical UV coordinate
            var y = v * totalHeight;
            // Calculate wave offset for this height
            var angle = v * Math.PI * waveFrequency;
            var waveX = Math.sin(angle) * waveAmplitude * (1 + v); // Amplitude increases with height
            var waveZ = Math.cos(angle * 0.7) * waveAmplitude * (1 + v * 0.5); // Slightly different wave profile for Z, less amplitude increase
            // Calculate radius taper (stronger taper)
            var currentRadius = baseRadius * Math.pow(1.0 - v, 1.5); // Stronger taper towards the tip
            for(var j = 0; j <= radialSegments; j++){
                var u = j / radialSegments; // Horizontal UV coordinate
                var theta = u * Math.PI * 2;
                // Vertex position
                var x = Math.cos(theta) * currentRadius + waveX;
                var z = Math.sin(theta) * currentRadius + waveZ;
                var currentVertexIndex = vertexIndex; // Store index before pushing
                vertices.push(x, y, z);
                uvs.push(u, v);
                vertexIndex++; // Increment vertex index *after* pushing vertex data
                // Add tube indices for faces
                if (i < segments && j < radialSegments) {
                    var a = currentVertexIndex; // Use stored index for current bottom-left
                    var b = currentVertexIndex + 1; // current bottom-right
                    var c = currentVertexIndex + radialSegments + 1; // corresponding top-left
                    var d = currentVertexIndex + radialSegments + 2; // corresponding top-right
                    // Ensure indices don't wrap around incorrectly if 'd' goes beyond the last vertex of the next row
                    var nextRowLastIndex = (i + 1) * (radialSegments + 1) + radialSegments;
                    var corrected_d = d > nextRowLastIndex ? c - radialSegments : d; // Wrap 'd' if needed
                    var corrected_b = b > i * (radialSegments + 1) + radialSegments ? a - radialSegments : b; // Wrap 'b' if needed
                    indices.push(a, c, corrected_b); // Triangle 1
                    indices.push(corrected_b, c, corrected_d); // Triangle 2
                }
                // Add Leafy Fringe (only on vertical edges, not top/bottom caps, and randomly)
                if (i > 0 && i < segments && j < radialSegments && Math.random() < FRINGE_DENSITY) {
                    // Base position for the fringe is the current vertex
                    var basePos = tempVec.set(x, y, z);
                    // Calculate outward normal direction (approximated)
                    var normalDir = tempNorm.set(Math.cos(theta), 0, Math.sin(theta)).normalize();
                    // Calculate a direction roughly perpendicular to the strand's main axis (tangent)
                    // Approximate tangent by looking at the previous vertex in the segment
                    var tangentDir = new THREE.Vector3();
                    if (i > 0) {
                        var prevVertexIndex = (i - 1) * (radialSegments + 1) + j;
                        tangentDir.set(x - vertices[prevVertexIndex * 3], y - vertices[prevVertexIndex * 3 + 1], z - vertices[prevVertexIndex * 3 + 2]).normalize();
                    } else {
                        tangentDir.set(0, 1, 0); // Default upwards for the first segment
                    }
                    // Calculate the bi-normal (perpendicular to both normal and tangent) - this is the leaf's width direction
                    var binormalDir = new THREE.Vector3().crossVectors(tangentDir, normalDir).normalize();
                    // Randomize leaf dimensions slightly
                    var leafLength = FRINGE_LENGTH * (0.7 + Math.random() * 0.6);
                    var leafWidth = FRINGE_WIDTH * (0.7 + Math.random() * 0.6);
                    // Calculate leaf corner points
                    var halfW = leafWidth / 2;
                    var p1 = basePos.clone().addScaledVector(binormalDir, -halfW); // Base left
                    var p2 = basePos.clone().addScaledVector(binormalDir, halfW); // Base right
                    // Tip points extend outwards along the normalDir and more up along tangentDir for a softer curve
                    var tipOffset = normalDir.clone().multiplyScalar(leafLength * 0.6).addScaledVector(tangentDir, leafLength * 0.4); // Changed balance
                    var tipCenter = basePos.clone().add(tipOffset); // Calculate the center of the tip edge
                    // Make the tip wider again, but still tapered
                    var tipWidthFactor = 0.7; // Tip is 70% of the base width (was 0.3)
                    var tipHalfW = leafWidth * tipWidthFactor / 2;
                    var p3 = tipCenter.clone().addScaledVector(binormalDir, tipHalfW); // Tip right (narrowed)
                    var p4 = tipCenter.clone().addScaledVector(binormalDir, -tipHalfW); // Tip left (narrowed)
                    // Add the quad - vertexIndex is automatically managed by addFringeQuad
                    addFringeQuad(p1, p2, p3, p4);
                }
            }
        }
        geom.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        geom.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
        geom.setIndex(indices);
        geom.computeVertexNormals(); // Recompute normals AFTER adding fringe
        // --- Geometry Pivot Adjustment ---
        // Move geometry so its lowest point is y = 0
        geom.computeBoundingBox();
        var _geom_boundingBox_min_y;
        var minY = (_geom_boundingBox_min_y = (_geom_boundingBox = geom.boundingBox) === null || _geom_boundingBox === void 0 ? void 0 : (_geom_boundingBox_min = _geom_boundingBox.min) === null || _geom_boundingBox_min === void 0 ? void 0 : _geom_boundingBox_min.y) !== null && _geom_boundingBox_min_y !== void 0 ? _geom_boundingBox_min_y : 0; // Handle potential null bounding box
        geom.translate(0, -minY, 0); // Shift geometry up
        return geom;
    }, [
        totalHeight
    ]); // Recalculate geometry if totalHeight changes
    // Add random initial tilt rotation
    var initialRotation = useMemo(function() {
        var randomAngle = Math.random() * Math.PI * 2; // Random direction
        var tiltAmount = Math.random() * Math.PI * 0.15; // Tilt up to ~27 degrees
        var axis = new THREE.Vector3(Math.cos(randomAngle), 0, Math.sin(randomAngle));
        return new THREE.Quaternion().setFromAxisAngle(axis, tiltAmount);
    }, []); // Calculate only once on mount
    // Log initial matrix update status (can keep this)
    useEffect(function() {
        if (meshRef.current) {
            console.log("SeaweedStrand initial matrixWorldNeedsUpdate: ".concat(meshRef.current.matrixWorldNeedsUpdate));
        }
    }, []);
    // Log initial Y position (can keep this)
    useEffect(function() {
        if (meshRef.current) {
            var initialY = meshRef.current.position.y;
            console.log("[SeaweedStrand Mount] Initial Base Y: ".concat(initialY.toFixed(4), " (from mesh position)"));
        }
    }, []);
    // Apply sway animation on top of the initial rotation
    useFrame(function(param) {
        var clock = param.clock;
        if (meshRef.current) {
            var time = clock.elapsedTime * SWAY_SPEED + initialOffset * 10; // Offset animation per strand
            // Calculate sway quaternion
            var swayX = Math.cos(time * 0.7) * SWAY_AMOUNT * 0.5;
            var swayZ = Math.sin(time) * SWAY_AMOUNT;
            var swayQuat = new THREE.Quaternion().setFromEuler(new THREE.Euler(swayX, 0, swayZ));
            // Combine initial rotation and sway rotation
            meshRef.current.quaternion.copy(initialRotation).multiply(swayQuat);
        }
    });
    var _obj;
    return /*#__PURE__*/ _jsxDEV("mesh", (_obj = {
        ref: meshRef,
        geometry: geometry
    }, // Position is set by the parent group in SeaweedField based on calculated positions
    _define_property(_obj, "geometry", geometry), _define_property(_obj, // Position is handled by parent group
    // Apply initial rotation directly here as well, simplifies frame updates
    // quaternion={initialRotation} // Let useFrame handle combined rotation
    "castShadow", true), _define_property(_obj, "receiveShadow", true), _define_property(_obj, "children", /*#__PURE__*/ _jsxDEV("primitive", {
        object: material,
        attach: "material",
        side: THREE.DoubleSide
    }, void 0, false, {
        fileName: "PlantLife.js",
        lineNumber: 182,
        columnNumber: 8
    }, this)), _obj), void 0, false, {
        fileName: "PlantLife.js",
        lineNumber: 170,
        columnNumber: 5
    }, this);
}
/**
 * Represents a cluster of seaweed anchored to the tank floor.
 */ export default function PlantLife(param) {
    var _this = this;
    var _param_position = param.position, position = _param_position === void 0 ? [
        0,
        0,
        0
    ] : _param_position, material = param.material, _param_heightScale = param.heightScale, heightScale = _param_heightScale === void 0 ? 1 : _param_heightScale;
    var grpRef = useRef();
    // If caller supplies a position (Vector3 or [x,y,z]), use it;
    // otherwise fall back to the original back-left corner default.
    var clusterPosition = useMemo(function() {
        if (Array.isArray(position)) return _construct(THREE.Vector3, _to_consumable_array(position));
        if (_instanceof(position, THREE.Vector3)) return position.clone();
        // The default [0,0,0] from props likely makes this fallback unreachable,
        // but keeping it doesn't hurt. Adjust if needed based on usage.
        return new THREE.Vector3(-TANK_DIMENSIONS.innerWidth / 2 + 0.7, TANK_DIMENSIONS.minY, -TANK_DIMENSIONS.innerDepth / 2 + 0.7);
    }, [
        position
    ]);
    // Removed internal heightScale calculation based on variant
    // Generate strands with potentially varying height scales if desired (currently uniform)
    var strands = useMemo(function() {
        return Array.from({
            length: STRAND_COUNT
        }).map(function(_, i) {
            return(// Pass a unique offset, heightScale, and material to each strand
            /*#__PURE__*/ _jsxDEV(SeaweedStrand, {
                initialOffset: i / STRAND_COUNT,
                heightScale: heightScale,
                material: material
            }, i, false, {
                fileName: "PlantLife.js",
                lineNumber: 211,
                columnNumber: 7
            }, _this));
        });
    }, [
        heightScale,
        material
    ]); // Recreate strands if heightScale or material changes
    // Log position details on mount
    useEffect(function() {
        if (grpRef.current) {
            var propPos = position; // The raw prop
            var clusterPosInternal = clusterPosition; // The derived internal state
            var groupActualPos = grpRef.current.position; // The actual rendered position
            console.log("--- PlantLife Mount Log ---");
            console.log("  Props position:    ", propPos);
            console.log("  ClusterPosition (internal):", clusterPosInternal);
            console.log("  Group Actual Pos:  ", groupActualPos);
            // Simple comparison (might need tolerance for floating point issues)
            var mismatch = !groupActualPos.equals(clusterPosInternal);
            if (mismatch) {
                console.warn("  ** POSITION MISMATCH DETECTED **: Group actual position differs from calculated clusterPosition.");
            } else {
                console.log("  Positions match.");
            }
            console.log("---------------------------");
        }
    }, [
        position,
        clusterPosition
    ]); // Rerun if the source prop or derived position changes
    return /*#__PURE__*/ _jsxDEV("group", {
        ref: grpRef,
        name: "plant-life-cluster",
        position: clusterPosition,
        children: strands
    }, void 0, false, {
        fileName: "PlantLife.js",
        lineNumber: 234,
        columnNumber: 5
    }, this);
} // ─── ensure plant pivot is at the base ─────────────────────────────────────────
