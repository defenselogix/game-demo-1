function _array_like_to_array(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}
function _array_with_holes(arr) {
    if (Array.isArray(arr)) return arr;
}
function _instanceof(left, right) {
    if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) {
        return !!right[Symbol.hasInstance](left);
    } else {
        return left instanceof right;
    }
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
var _this = this;
import { jsxDEV as _jsxDEV } from "react/jsx-dev-runtime";
import React, { useRef, useMemo, useState, forwardRef, useImperativeHandle } from 'react'; // Import useImperativeHandle
import * as THREE from 'three'; // Import THREE
import { useFrame } from '@react-three/fiber';
import { RigidBody, useRapier } from '@react-three/rapier'; // Import RigidBody and useRapier
import useAudioManager from './hooksUseAudioManager.js';
// Tank boundary constants are now passed as props
// Constants for steering behavior
var MAX_SPEED = 2.5;
var STEERING_FORCE = 0.5; // How quickly the fish can turn
var WANDER_RADIUS = 5; // Reduced wander radius for smaller tank
var TARGET_REACH_THRESHOLD = 0.5; // How close to get before picking new target
// Changed to named export and use forwardRef
export var Fish = /*#__PURE__*/ forwardRef(function(param, fRef) {
    var _param_speed = param.speed, speed = _param_speed === void 0 ? 1 : _param_speed, _param_position = param.position, position = _param_position === void 0 ? [
        0,
        2.5,
        -2.5
    ] : _param_position, tankMin = param.tankMin, tankMax // Accept tankMax prop
     = param.tankMax;
    // Internal refs
    var rigidBodyRef = useRef(); // Internal ref for the RigidBody
    var meshRef = useRef(); // Ref for the visual mesh for rotation
    var audio = useAudioManager();
    var _useRapier = useRapier(), rapier = _useRapier.rapier, world = _useRapier.world; // Get physics world access
    // State for steering behavior
    var velocity = useRef(new THREE.Vector3());
    var target = useRef(new THREE.Vector3());
    var _useState = _sliced_to_array(useState(false), 2), isInitialized = _useState[0], setIsInitialized = _useState[1]; // Ensure initial setup
    var externalTarget = useRef(null); // Store externally set target
    var externalTargetTimeout = useRef(null); // Timeout handle for resuming wander
    // Helper to get a new random target within bounds
    var getRandomTarget = function() {
        var center = new THREE.Vector3(position[0], position[1], position[2]); // Base wandering around initial pos
        var randomPoint = new THREE.Vector3((Math.random() - 0.5) * 2 * WANDER_RADIUS, (Math.random() - 0.5) * 2 * (tankMax.y - tankMin.y) * 0.4, (Math.random() - 0.5) * 2 * WANDER_RADIUS);
        var newTarget = center.add(randomPoint);
        newTarget.clamp(tankMin, tankMax); // Ensure target is within bounds
        return newTarget;
    };
    // Track last position for rotation calculation
    var lastPos = useRef(new THREE.Vector3().fromArray(position));
    var desiredRot = useRef(new THREE.Quaternion()); // Target rotation
    // --- Procedural Geometry ---
    var fishGeometry = useMemo(function() {
        var geometry = new THREE.BufferGeometry();
        // Simple elongated ellipsoid shape vertices
        var vertices = new Float32Array([
            // Body Front (Tip)
            0.3,
            0,
            0,
            // Body Mid Top/Bottom/Left/Right
            0,
            0.1,
            0,
            0,
            -0.1,
            0,
            0,
            0,
            0.1,
            0,
            0,
            -0.1,
            // Body Back Mid
            -0.3,
            0,
            0,
            // Tail Top/Bottom
            -0.4,
            0.15,
            0,
            -0.4,
            -0.15,
            0
        ]);
        // Simple faces (triangles)
        var indices = new Uint16Array([
            // Front cone
            0,
            1,
            3,
            0,
            3,
            2,
            0,
            2,
            4,
            0,
            4,
            1,
            // Mid section Top -> Back -> Side(R) -> Top
            1,
            5,
            3,
            // Mid section Bottom -> Back -> Side(R) -> Bottom
            2,
            5,
            3,
            // Mid section Bottom -> Back -> Side(L) -> Bottom
            2,
            5,
            4,
            // Mid section Top -> Back -> Side(L) -> Top
            1,
            5,
            4,
            // Tail Top -> Back -> Tail Bottom -> Top
            6,
            5,
            7
        ]);
        geometry.setIndex(new THREE.BufferAttribute(indices, 1));
        geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
        geometry.computeVertexNormals(); // Calculate normals for lighting
        return geometry;
    }, []);
    // --- End Procedural Geometry ---
    // --- Imperative Handle ---
    useImperativeHandle(fRef, function() {
        return {
            getRigidBodyRef: function() {
                return rigidBodyRef.current;
            },
            setTargetPosition: function(newTarget) {
                if (_instanceof(newTarget, THREE.Vector3)) {
                    externalTarget.current = newTarget.clone();
                    target.current.copy(externalTarget.current); // Immediately set current target
                    // Optional: Clear previous timeout if a new target is set quickly
                    if (externalTargetTimeout.current) {
                        clearTimeout(externalTargetTimeout.current);
                    }
                    // Set a timeout to resume wandering after a while
                    externalTargetTimeout.current = setTimeout(function() {
                        externalTarget.current = null; // Clear external target
                        target.current.copy(getRandomTarget()); // Get a new random target
                    }, 5000); // Resume wandering after 5 seconds
                } else {
                    console.warn("Fish.setTargetPosition: Invalid target provided.");
                }
            }
        };
    }, [
        getRandomTarget,
        tankMin,
        tankMax
    ]); // Add tank boundaries to dependencies
    useFrame(function(_, delta) {
        if (!rigidBodyRef.current || !meshRef.current || !tankMin || !tankMax) return; // Check if props are available
        // Get translation as an object {x, y, z}
        var currentTranslation = rigidBodyRef.current.translation();
        // Create a THREE.Vector3 from the translation for calculations
        var currentPos = new THREE.Vector3(currentTranslation.x, currentTranslation.y, currentTranslation.z);
        // Initialize target on first frame
        if (!isInitialized) {
            target.current.copy(getRandomTarget());
            setIsInitialized(true);
        }
        // Check if target is reached OR if we have an external target override
        var distanceToTarget = currentPos.distanceTo(target.current);
        if (!externalTarget.current && distanceToTarget < TARGET_REACH_THRESHOLD) {
            target.current.copy(getRandomTarget()); // Get new random target if wandering
        } else if (externalTarget.current && distanceToTarget < TARGET_REACH_THRESHOLD * 0.5) {
            // If we reached an external target, start wandering again immediately
            externalTarget.current = null;
            if (externalTargetTimeout.current) clearTimeout(externalTargetTimeout.current);
            target.current.copy(getRandomTarget());
        }
        // --- Steering Calculation ---
        // 1. Desired Velocity (vector towards current target, scaled by max speed)
        var desiredVelocity = new THREE.Vector3().subVectors(target.current, currentPos).normalize().multiplyScalar(MAX_SPEED * speed); // Apply speed multiplier
        // 2. Steering Force (Desired - Current)
        var steeringForce = new THREE.Vector3().subVectors(desiredVelocity, velocity.current).clampLength(0, STEERING_FORCE); // Limit the force
        // --- Obstacle Avoidance ---
        var avoidanceForce = new THREE.Vector3();
        var rayOrigin = currentPos;
        var baseDirection = velocity.current.clone().normalize(); // Direction of movement
        var rayLength = 1.8; // Keep lookahead distance
        var avoidanceWeight = STEERING_FORCE * 2.0; // Keep avoidance strength
        if (baseDirection.lengthSq() > 0.01) {
            var horizontalAngle = Math.PI / 6; // Wider horizontal feelers (30 degrees)
            var verticalAngle = Math.PI / 10; // Vertical feelers (18 degrees)
            // Get local UP and RIGHT based on current fish orientation (use meshRef)
            var fishUp = new THREE.Vector3(0, 1, 0).applyQuaternion(meshRef.current.quaternion);
            var fishRight = new THREE.Vector3(1, 0, 0).applyQuaternion(meshRef.current.quaternion);
            var directions = [
                baseDirection,
                new THREE.Vector3().copy(baseDirection).applyAxisAngle(fishUp, horizontalAngle),
                new THREE.Vector3().copy(baseDirection).applyAxisAngle(fishUp, -horizontalAngle),
                new THREE.Vector3().copy(baseDirection).applyAxisAngle(fishRight, verticalAngle),
                new THREE.Vector3().copy(baseDirection).applyAxisAngle(fishRight, -verticalAngle)
            ];
            var strongestAvoidance = new THREE.Vector3();
            var minHitTime = rayLength; // Track the closest hit
            var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
            try {
                for(var _iterator = directions[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                    var dir = _step.value;
                    var ray = new rapier.Ray(rayOrigin, dir);
                    // Use castRayAndGetNormal for potentially more accurate normals if available/needed
                    var hit = world.castRayAndGetNormal(ray, rayLength, true, undefined, undefined, rigidBodyRef.current);
                    if (hit) {
                        var _parentBody_userData, _parentBody_userData1;
                        var hitCollider = world.getCollider(hit.colliderHandle);
                        var parentBody = hitCollider === null || hitCollider === void 0 ? void 0 : hitCollider.parent();
                        // Check if it hit an obstacle OR the tank boundary
                        if (parentBody && (((_parentBody_userData = parentBody.userData) === null || _parentBody_userData === void 0 ? void 0 : _parentBody_userData.type) === 'obstacle' || ((_parentBody_userData1 = parentBody.userData) === null || _parentBody_userData1 === void 0 ? void 0 : _parentBody_userData1.type) === 'tankBoundary')) {
                            if (hit.toi < minHitTime) {
                                minHitTime = hit.toi;
                                // Use the normal returned by castRayAndGetNormal
                                var hitNormal = new THREE.Vector3(hit.normal.x, hit.normal.y, hit.normal.z);
                                // Force should push away from the normal
                                strongestAvoidance.copy(hitNormal);
                            }
                        }
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
            if (strongestAvoidance.lengthSq() > 0) {
                // Scale force based on how close the obstacle is (stronger for closer hits)
                var closenessFactor = 1.0 - minHitTime / rayLength; // 0 (far) to 1 (close)
                avoidanceForce.copy(strongestAvoidance).multiplyScalar(avoidanceWeight * (1 + closenessFactor));
            }
        }
        // Combine steering and avoidance forces
        var totalSteeringForce = new THREE.Vector3().addVectors(steeringForce, avoidanceForce);
        // 3. Update Velocity (Apply combined steering force)
        velocity.current.add(totalSteeringForce.multiplyScalar(delta)).clampLength(0, MAX_SPEED * speed);
        // 4. Update Position (Kinematic translation)
        var nextPos = new THREE.Vector3().addVectors(currentPos, velocity.current.clone().multiplyScalar(delta));
        // Boundary check - if trying to move outside, pick a new random target inside
        var nextPosCheck = nextPos.clone(); // Check potential next position
        if (nextPosCheck.x < tankMin.x || nextPosCheck.x > tankMax.x || nextPosCheck.y < tankMin.y || nextPosCheck.y > tankMax.y || nextPosCheck.z < tankMin.z || nextPosCheck.z > tankMax.z) {
            // If next position is out of bounds and not externally targeted, pick a new target
            if (!externalTarget.current) {
                target.current.copy(getRandomTarget());
            }
            // Clamp the actual next position to stay within bounds regardless
            nextPos.clamp(tankMin, tankMax);
        }
        rigidBodyRef.current.setNextKinematicTranslation(nextPos);
        // --- Rotation ---
        if (velocity.current.lengthSq() > 0.01) {
            // Use velocity direction for rotation
            var lookDirection = velocity.current.clone().normalize();
            // Calculate target rotation to look in the movement direction
            var targetQuaternion = new THREE.Quaternion();
            var up = new THREE.Vector3(0, 1, 0);
            // Use lookAt matrix to get the rotation quaternion
            // Need a "dummy" object's matrix or calculate manually
            // Manual calculation using vector cross product
            var right = new THREE.Vector3().crossVectors(up, lookDirection).normalize();
            var newUp = new THREE.Vector3().crossVectors(lookDirection, right).normalize();
            var matrix = new THREE.Matrix4().makeBasis(right, newUp, lookDirection);
            targetQuaternion.setFromRotationMatrix(matrix);
            // Adjust rotation offset if the model's default orientation is not Z+ forward
            // Assuming fish model points X+ by default: Rotate Y by -PI/2
            var offsetRotation = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), -Math.PI / 2);
            desiredRot.current.multiplyQuaternions(targetQuaternion, offsetRotation);
            // Smoothly interpolate rotation (slerp)
            meshRef.current.quaternion.slerp(desiredRot.current, delta * 4.0); // Slower rotation lerp
        }
    // Update last position used for implicit velocity next frame if needed (not strictly needed now with explicit velocity)
    // lastPos.current.copy(currentPos); // Can be removed if velocity tracking is sufficient
    });
    // Play sound on click - requires 'blop' sound to be loaded
    var handleClick = function() {
        if (audio) {
        // TODO: Re-enable sound playback when assets are added
        // audio.play('blop', { volume: 0.8 });
        } else {
            console.warn("AudioManager not ready to play 'blop'");
        }
    };
    return /*#__PURE__*/ _jsxDEV(RigidBody, {
        ref: rigidBodyRef,
        position: position,
        type: "kinematicPosition" // Kinematic allows controlled movement + collision
        ,
        colliders: "ball" // Simple spherical collider - adjust size/shape if needed
        ,
        children: /*#__PURE__*/ _jsxDEV("group", {
            ref: meshRef,
            children: /*#__PURE__*/ _jsxDEV("mesh", {
                geometry: fishGeometry,
                onClick: handleClick,
                castShadow: true,
                receiveShadow: true,
                children: /*#__PURE__*/ _jsxDEV("meshStandardMaterial", {
                    color: "#3aa0e0" // Slightly darker/richer blue
                    ,
                    roughness: 0.6,
                    metalness: 0.05,
                    side: THREE.DoubleSide
                }, void 0, false, {
                    fileName: "componentsFish.jsx",
                    lineNumber: 257,
                    columnNumber: 11
                }, _this)
            }, void 0, false, {
                fileName: "componentsFish.jsx",
                lineNumber: 250,
                columnNumber: 9
            }, _this)
        }, void 0, false, {
            fileName: "componentsFish.jsx",
            lineNumber: 249,
            columnNumber: 7
        }, _this)
    }, void 0, false, {
        fileName: "componentsFish.jsx",
        lineNumber: 241,
        columnNumber: 5
    }, _this);
}); // Close forwardRef
