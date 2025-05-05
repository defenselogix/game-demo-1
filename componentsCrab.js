var _this = this;
import { jsxDEV as _jsxDEV } from "react/jsx-dev-runtime";
import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { RigidBody, useRapier } from '@react-three/rapier'; // Import useRapier
import { useFrame } from '@react-three/fiber';
var CRAB_COLOR = '#ff6347'; // Tomato red
var BODY_RADIUS = 0.25; // Main body size
var CLAW_OFFSET = 0.2;
var CLAW_SIZE = 0.1;
// Function to create crab geometry
var createCrabGeometry = function() {
    var geometry = new THREE.BufferGeometry();
    // Simple body (flattened sphere/ellipsoid) + two claws
    var vertices = new Float32Array([
        // Body center
        0,
        0,
        0,
        // Body front/back/left/right (flattened)
        0,
        0.05,
        BODY_RADIUS * 0.8,
        0,
        0.05,
        -BODY_RADIUS,
        BODY_RADIUS,
        0.05,
        0,
        -BODY_RADIUS,
        0.05,
        0,
        // Bottom equivalent of points 1-4
        0,
        -0.05,
        BODY_RADIUS * 0.8,
        0,
        -0.05,
        -BODY_RADIUS,
        BODY_RADIUS,
        -0.05,
        0,
        -BODY_RADIUS,
        -0.05,
        0,
        // Right Claw (simple box shape) - Front Top Left
        BODY_RADIUS + CLAW_OFFSET,
        CLAW_SIZE * 0.5,
        CLAW_OFFSET * 0.5,
        // FTR 10
        BODY_RADIUS + CLAW_OFFSET + CLAW_SIZE,
        CLAW_SIZE * 0.5,
        CLAW_OFFSET * 0.5,
        // FBR 11
        BODY_RADIUS + CLAW_OFFSET + CLAW_SIZE,
        -CLAW_SIZE * 0.5,
        CLAW_OFFSET * 0.5,
        // FBL 12
        BODY_RADIUS + CLAW_OFFSET,
        -CLAW_SIZE * 0.5,
        CLAW_OFFSET * 0.5,
        // BTL 13
        BODY_RADIUS + CLAW_OFFSET,
        CLAW_SIZE * 0.5,
        CLAW_OFFSET * 0.5 - CLAW_SIZE,
        // BTR 14
        BODY_RADIUS + CLAW_OFFSET + CLAW_SIZE,
        CLAW_SIZE * 0.5,
        CLAW_OFFSET * 0.5 - CLAW_SIZE,
        // BBR 15
        BODY_RADIUS + CLAW_OFFSET + CLAW_SIZE,
        -CLAW_SIZE * 0.5,
        CLAW_OFFSET * 0.5 - CLAW_SIZE,
        // BBL 16
        BODY_RADIUS + CLAW_OFFSET,
        -CLAW_SIZE * 0.5,
        CLAW_OFFSET * 0.5 - CLAW_SIZE,
        // Left Claw - mirroring Right Claw X values
        -(BODY_RADIUS + CLAW_OFFSET),
        CLAW_SIZE * 0.5,
        CLAW_OFFSET * 0.5,
        -(BODY_RADIUS + CLAW_OFFSET + CLAW_SIZE),
        CLAW_SIZE * 0.5,
        CLAW_OFFSET * 0.5,
        -(BODY_RADIUS + CLAW_OFFSET + CLAW_SIZE),
        -CLAW_SIZE * 0.5,
        CLAW_OFFSET * 0.5,
        -(BODY_RADIUS + CLAW_OFFSET),
        -CLAW_SIZE * 0.5,
        CLAW_OFFSET * 0.5,
        -(BODY_RADIUS + CLAW_OFFSET),
        CLAW_SIZE * 0.5,
        CLAW_OFFSET * 0.5 - CLAW_SIZE,
        -(BODY_RADIUS + CLAW_OFFSET + CLAW_SIZE),
        CLAW_SIZE * 0.5,
        CLAW_OFFSET * 0.5 - CLAW_SIZE,
        -(BODY_RADIUS + CLAW_OFFSET + CLAW_SIZE),
        -CLAW_SIZE * 0.5,
        CLAW_OFFSET * 0.5 - CLAW_SIZE,
        -(BODY_RADIUS + CLAW_OFFSET),
        -CLAW_SIZE * 0.5,
        CLAW_OFFSET * 0.5 - CLAW_SIZE
    ]);
    var indices = new Uint16Array([
        // Body Top Cap
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
        // Body Bottom Cap (using points 5-8) - careful with winding order for normals
        0,
        7,
        5,
        0,
        6,
        7,
        0,
        8,
        6,
        0,
        5,
        8,
        // Body Sides (connecting top 1-4 and bottom 5-8)
        1,
        5,
        7,
        1,
        7,
        3,
        3,
        7,
        6,
        3,
        6,
        2,
        2,
        6,
        8,
        2,
        8,
        4,
        4,
        8,
        5,
        4,
        5,
        1,
        // Right Claw Faces (indices 9-16)
        9,
        10,
        11,
        9,
        11,
        12,
        14,
        13,
        16,
        14,
        16,
        15,
        10,
        14,
        15,
        10,
        15,
        11,
        13,
        9,
        12,
        13,
        12,
        16,
        13,
        14,
        10,
        13,
        10,
        9,
        11,
        15,
        16,
        11,
        16,
        12,
        // Left Claw Faces (indices 17-24) - careful with winding order
        17,
        19,
        18,
        17,
        20,
        19,
        22,
        23,
        21,
        22,
        24,
        23,
        18,
        23,
        22,
        18,
        19,
        23,
        21,
        20,
        17,
        21,
        17,
        24,
        21,
        22,
        18,
        21,
        18,
        17,
        19,
        20,
        24,
        19,
        24,
        23
    ]);
    geometry.setIndex(new THREE.BufferAttribute(indices, 1));
    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    geometry.computeVertexNormals(); // Calculate normals for lighting
    return geometry;
};
export var Crab = function(param) {
    var _param_position = param.position, position = _param_position === void 0 ? [
        0,
        0.5,
        0
    ] : _param_position;
    var rigidBodyRef = useRef();
    var meshRef = useRef(); // Ref for the visual mesh group
    var crabGeometry = useMemo(createCrabGeometry, []); // Create geometry once
    var _useRapier = useRapier(), rapier = _useRapier.rapier, world = _useRapier.world; // Get physics world access
    // Define the collider shape slightly larger than the visual body radius
    var colliderArgs = [
        BODY_RADIUS * 1.1,
        0.1,
        BODY_RADIUS * 1.1
    ]; // Width, Height, Depth for cuboid
    var IDLE_VELOCITY_THRESHOLD = 0.1; // Max speed to be considered idle
    var BOB_FREQUENCY = 2; // How fast the bob is
    var BOB_AMPLITUDE = 0.02; // How high the bob is
    // Skittering constants
    var SKITTER_INTERVAL_MIN = 2.0; // Min seconds between skitters
    var SKITTER_INTERVAL_MAX = 5.0; // Max seconds between skitters
    var SKITTER_FORCE = 0.8; // Magnitude of the skitter impulse
    var nextSkitterTime = useRef(Math.random() * (SKITTER_INTERVAL_MAX - SKITTER_INTERVAL_MIN) + SKITTER_INTERVAL_MIN);
    // Ground alignment variables
    var rayOriginOffset = new THREE.Vector3(0, 0.2, 0); // Start ray slightly above center
    var rayDir = new THREE.Vector3(0, -1, 0); // Ray points down
    var rayLength = 0.5; // How far down to check
    var groundOffset = 0.05; // How high above the ground to hover visually
    var surfaceNormal = useRef(new THREE.Vector3(0, 1, 0)); // Current ground normal
    var targetQuat = useRef(new THREE.Quaternion()); // Target orientation quaternion
    useFrame(function(param, delta) {
        var clock = param.clock;
        if (!rigidBodyRef.current || !meshRef.current) return;
        var rbPosition = rigidBodyRef.current.translation();
        var currentPos = new THREE.Vector3(rbPosition.x, rbPosition.y, rbPosition.z);
        // --- Ground Detection & Alignment ---
        var rayOrigin = currentPos.clone().add(rayOriginOffset);
        var ray = new rapier.Ray(rayOrigin, rayDir);
        var hit = world.castRay(ray, rayLength, true, undefined, undefined, rigidBodyRef.current);
        var targetY = currentPos.y; // Default to current Y if no ground detected
        if (hit) {
            var hitPoint = ray.pointAt(hit.toi);
            targetY = hitPoint.y + groundOffset; // Set target Y slightly above hit point
            // Get the normal from the collider hit (needs Rapier build with normal support)
            // For now, we'll assume a simple upward normal if hit, but ideally get it from hit.normal
            // Let's try getting normal if available (might need latest Rapier version/build)
            // Ensure we use getCollider and handle potential null collider
            var collider = world.getCollider(hit.colliderHandle);
            var hitNormal = null;
            if (collider) {
                // Attempt to get the normal only if the collider exists
                try {
                    hitNormal = collider.normalAt(hitPoint.x, hitPoint.y, hitPoint.z);
                } catch (e) {
                    console.warn("Failed to get normal from collider:", e);
                }
            }
            if (hitNormal) {
                surfaceNormal.current.set(hitNormal.x, hitNormal.y, hitNormal.z).normalize();
            } else {
                surfaceNormal.current.set(0, 1, 0); // Fallback to up if normal isn't available or fails
            }
        } else {
            surfaceNormal.current.set(0, 1, 0); // No ground hit, assume flat orientation
        }
        // Smoothly interpolate the RigidBody's Y position towards the target Y
        // This is a visual adjustment, doesn't fight physics forces directly too much
        var lerpedY = THREE.MathUtils.lerp(currentPos.y, targetY, delta * 10.0);
        rigidBodyRef.current.setTranslation({
            x: currentPos.x,
            y: lerpedY,
            z: currentPos.z
        }, true);
        // Calculate target rotation based on surface normal
        var up = new THREE.Vector3(0, 1, 0);
        targetQuat.current.setFromUnitVectors(up, surfaceNormal.current);
        // Smoothly interpolate the mesh group's rotation
        meshRef.current.quaternion.slerp(targetQuat.current, delta * 8.0);
        // --- Idle Bobbing (applied relative to mesh group's current orientation) ---
        var linvel = rigidBodyRef.current.linvel();
        var speed = Math.sqrt(Math.pow(linvel.x, 2) + Math.pow(linvel.y, 2) + Math.pow(linvel.z, 2));
        var bobOffset = 0;
        if (speed < IDLE_VELOCITY_THRESHOLD) {
            bobOffset = Math.sin(clock.elapsedTime * BOB_FREQUENCY) * BOB_AMPLITUDE;
        }
        // Apply bobbing to the mesh inside the group, not the group itself
        meshRef.current.children[0].position.y = bobOffset;
        // --- Skittering ---
        nextSkitterTime.current -= delta;
        if (nextSkitterTime.current <= 0) {
            // Time to skitter!
            var angle = Math.random() * Math.PI * 2; // Random horizontal direction
            var forceDirection = new THREE.Vector3(Math.cos(angle), 0, Math.sin(angle));
            // Project force onto the current ground plane (optional, but more realistic)
            forceDirection.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(up, surfaceNormal.current));
            var force = forceDirection.multiplyScalar(SKITTER_FORCE);
            force.y += 0.2; // Add a consistent upward nudge to help unstick
            rigidBodyRef.current.applyImpulse(force, true);
            nextSkitterTime.current = Math.random() * (SKITTER_INTERVAL_MAX - SKITTER_INTERVAL_MIN) + SKITTER_INTERVAL_MIN;
        }
    });
    return /*#__PURE__*/ _jsxDEV(RigidBody, {
        ref: rigidBodyRef,
        colliders: "cuboid",
        args: colliderArgs,
        position: position,
        restitution: 0.2,
        friction: 0.7,
        linearDamping: 0.95,
        angularDamping: 0.95,
        type: "dynamic" // Affected by gravity and forces
        ,
        children: /*#__PURE__*/ _jsxDEV("group", {
            ref: meshRef,
            children: /*#__PURE__*/ _jsxDEV("mesh", {
                geometry: crabGeometry,
                castShadow: true,
                receiveShadow: true,
                position: [
                    0,
                    0,
                    0
                ],
                children: /*#__PURE__*/ _jsxDEV("meshStandardMaterial", {
                    color: "#e05030" // Slightly less vibrant red
                    ,
                    roughness: 0.75,
                    metalness: 0.05,
                    side: THREE.DoubleSide
                }, void 0, false, {
                    fileName: "componentsCrab.jsx",
                    lineNumber: 187,
                    columnNumber: 15
                }, _this)
            }, void 0, false, {
                fileName: "componentsCrab.jsx",
                lineNumber: 185,
                columnNumber: 11
            }, _this)
        }, void 0, false, {
            fileName: "componentsCrab.jsx",
            lineNumber: 183,
            columnNumber: 7
        }, _this)
    }, void 0, false, {
        fileName: "componentsCrab.jsx",
        lineNumber: 171,
        columnNumber: 5
    }, _this);
};
