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
import { jsxDEV as _jsxDEV, Fragment as _Fragment } from "react/jsx-dev-runtime";
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
var fishColors = [
    '#FF6B6B',
    '#48DBFB',
    '#FFA502',
    '#1DD1A1',
    '#5352ED',
    '#FF9FF3',
    '#FECA57'
];
export function ColorfulFish(param) {
    var _param_position = param.position, position = _param_position === void 0 ? [
        0,
        0,
        0
    ] : _param_position, _param_color = param.color, color = _param_color === void 0 ? fishColors[Math.floor(Math.random() * fishColors.length)] : _param_color, _param_scale = param.scale, scale = _param_scale === void 0 ? [
        0.3,
        0.15,
        0.8
    ] : _param_scale, _param_speed = param.speed, speed = _param_speed === void 0 ? 0.5 + Math.random() * 0.5 : _param_speed, _param_rotationSpeed = param.rotationSpeed, rotationSpeed = _param_rotationSpeed === void 0 ? 0.5 + Math.random() * 1 : _param_rotationSpeed, _param_rotationFactor = param.rotationFactor, rotationFactor = _param_rotationFactor === void 0 ? 0.2 : _param_rotationFactor, tankMin = param.tankMin, tankMax // Added tankMax prop
     = param.tankMax;
    var fish = useRef();
    var velocity = useRef(new THREE.Vector3((Math.random() - 0.5) * speed, (Math.random() - 0.5) * speed * 0.5, (Math.random() - 0.5) * speed)); // Start with random velocity
    var target = useRef(new THREE.Vector3()); // Steering target
    var _React_useState = _sliced_to_array(React.useState(false), 2), isInitialized = _React_useState[0], setIsInitialized = _React_useState[1]; // Ensure initial setup
    var tailFin = useRef();
    var topFin = useRef();
    // Helper to get a random target within bounds
    var getRandomTarget = function() {
        if (!tankMin || !tankMax) return new THREE.Vector3(); // Safety check
        var rangeX = (tankMax.x - tankMin.x) * 0.8;
        var rangeY = (tankMax.y - tankMin.y) * 0.8;
        var rangeZ = (tankMax.z - tankMin.z) * 0.8;
        var centerX = (tankMax.x + tankMin.x) / 2;
        var centerY = (tankMax.y + tankMin.y) / 2;
        var centerZ = (tankMax.z + tankMin.z) / 2;
        return new THREE.Vector3(centerX + (Math.random() - 0.5) * rangeX, centerY + (Math.random() - 0.5) * rangeY, centerZ + (Math.random() - 0.5) * rangeZ);
    };
    useFrame(function(state, delta) {
        if (!fish.current || !tankMin || !tankMax) return; // Ensure fish and bounds exist
        var currentPos = fish.current.position;
        // Initialize target on first valid frame
        if (!isInitialized) {
            target.current.copy(getRandomTarget());
            setIsInitialized(true);
        }
        // --- Steering Towards Target ---
        var desiredVelocity = new THREE.Vector3().subVectors(target.current, currentPos).normalize().multiplyScalar(speed);
        var steeringForce = new THREE.Vector3().subVectors(desiredVelocity, velocity.current).clampLength(0, speed * 0.5); // Limit steering force
        velocity.current.add(steeringForce.multiplyScalar(delta)).clampLength(0, speed);
        // --- Boundary Avoidance ---
        var avoidanceForce = new THREE.Vector3();
        var boundaryMargin = 0.5; // How far from the wall to start turning
        if (currentPos.x < tankMin.x + boundaryMargin) avoidanceForce.x += tankMin.x + boundaryMargin - currentPos.x;
        if (currentPos.x > tankMax.x - boundaryMargin) avoidanceForce.x += tankMax.x - boundaryMargin - currentPos.x;
        if (currentPos.y < tankMin.y + boundaryMargin) avoidanceForce.y += tankMin.y + boundaryMargin - currentPos.y;
        if (currentPos.y > tankMax.y - boundaryMargin) avoidanceForce.y += tankMax.y - boundaryMargin - currentPos.y;
        if (currentPos.z < tankMin.z + boundaryMargin) avoidanceForce.z += tankMin.z + boundaryMargin - currentPos.z;
        if (currentPos.z > tankMax.z - boundaryMargin) avoidanceForce.z += tankMax.z - boundaryMargin - currentPos.z;
        // Apply avoidance force, stronger than regular steering
        velocity.current.add(avoidanceForce.multiplyScalar(speed * 1.5 * delta));
        // Clamp velocity if hitting boundary hard
        if (currentPos.x <= tankMin.x || currentPos.x >= tankMax.x) velocity.current.x *= -0.5;
        if (currentPos.y <= tankMin.y || currentPos.y >= tankMax.y) velocity.current.y *= -0.5;
        if (currentPos.z <= tankMin.z || currentPos.z >= tankMax.z) velocity.current.z *= -0.5;
        // Update position
        currentPos.add(velocity.current.clone().multiplyScalar(delta));
        // Clamp position firmly within bounds as a safety measure
        currentPos.clamp(tankMin, tankMax);
        // Check if target is reached or invalid
        if (currentPos.distanceTo(target.current) < 1.0) {
            target.current.copy(getRandomTarget());
        }
        // --- Rotation ---
        if (velocity.current.lengthSq() > 0.001) {
            // Smoothly rotate to face the velocity direction
            var targetQuaternion = new THREE.Quaternion();
            var lookDirection = velocity.current.clone().normalize();
            var up = new THREE.Vector3(0, 1, 0);
            // Simplified lookAt calculation using matrix
            var matrix = new THREE.Matrix4().lookAt(new THREE.Vector3(0, 0, 0), lookDirection, up // Up vector
            );
            targetQuaternion.setFromRotationMatrix(matrix);
            // Adjust rotation offset if the model's default orientation is not Z+ forward
            // Assuming ellipsoid points X+ by default: Rotate Y by -PI/2
            var offsetRotation = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), -Math.PI / 2);
            targetQuaternion.multiply(offsetRotation); // Apply offset
            fish.current.quaternion.slerp(targetQuaternion, delta * 5.0); // Faster rotation lerp
            // Tilt based on horizontal velocity change (banking) - simplified
            var bankFactor = velocity.current.x * 0.1; // Example banking factor
            fish.current.rotation.z = THREE.MathUtils.lerp(fish.current.rotation.z, -bankFactor, delta * 2.0);
        }
        // Animate tail fin based on overall speed
        if (tailFin.current) {
            var effectiveSpeed = velocity.current.length();
            tailFin.current.rotation.y = Math.sin(state.clock.elapsedTime * rotationSpeed * effectiveSpeed * 3) * 0.5;
        }
        // Animate top fin
        if (topFin.current) {
            topFin.current.rotation.z = Math.sin(state.clock.elapsedTime * rotationSpeed * 0.5) * 0.1 + 0.1;
        }
    }); // This is the correct end of useFrame
    // The duplicate code block from lines 122-131 is removed.
    return /*#__PURE__*/ _jsxDEV("group", {
        ref: fish,
        position: position,
        scale: scale,
        children: [
            /*#__PURE__*/ _jsxDEV("mesh", {
                castShadow: true,
                children: [
                    /*#__PURE__*/ _jsxDEV("sphereGeometry", {
                        args: [
                            0.5,
                            16,
                            8
                        ]
                    }, void 0, false, {
                        fileName: "componentsColorfulFish.jsx",
                        lineNumber: 127,
                        columnNumber: 9
                    }, this),
                    " ",
                    /*#__PURE__*/ _jsxDEV("meshStandardMaterial", {
                        color: color,
                        metalness: 0.2,
                        roughness: 0.8
                    }, void 0, false, {
                        fileName: "componentsColorfulFish.jsx",
                        lineNumber: 128,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "componentsColorfulFish.jsx",
                lineNumber: 126,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ _jsxDEV("mesh", {
                ref: tailFin,
                position: [
                    -1.0,
                    0,
                    0
                ],
                castShadow: true,
                children: [
                    /*#__PURE__*/ _jsxDEV("coneGeometry", {
                        args: [
                            0.6,
                            1,
                            2,
                            1,
                            false,
                            Math.PI / 2
                        ]
                    }, void 0, false, {
                        fileName: "componentsColorfulFish.jsx",
                        lineNumber: 133,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ _jsxDEV("meshStandardMaterial", {
                        color: color,
                        metalness: 0.2,
                        roughness: 0.8
                    }, void 0, false, {
                        fileName: "componentsColorfulFish.jsx",
                        lineNumber: 134,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "componentsColorfulFish.jsx",
                lineNumber: 132,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ _jsxDEV("mesh", {
                ref: topFin,
                position: [
                    0.1,
                    0.5,
                    0
                ],
                rotation: [
                    0,
                    0,
                    0.1
                ],
                castShadow: true,
                children: [
                    /*#__PURE__*/ _jsxDEV("coneGeometry", {
                        args: [
                            0.4,
                            0.8,
                            2,
                            1,
                            false
                        ]
                    }, void 0, false, {
                        fileName: "componentsColorfulFish.jsx",
                        lineNumber: 139,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ _jsxDEV("meshStandardMaterial", {
                        color: color,
                        metalness: 0.2,
                        roughness: 0.8
                    }, void 0, false, {
                        fileName: "componentsColorfulFish.jsx",
                        lineNumber: 140,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "componentsColorfulFish.jsx",
                lineNumber: 138,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ _jsxDEV("mesh", {
                position: [
                    0.8,
                    0.1,
                    0.25
                ],
                castShadow: true,
                children: [
                    /*#__PURE__*/ _jsxDEV("sphereGeometry", {
                        args: [
                            0.1,
                            8,
                            8
                        ]
                    }, void 0, false, {
                        fileName: "componentsColorfulFish.jsx",
                        lineNumber: 145,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ _jsxDEV("meshStandardMaterial", {
                        color: "white"
                    }, void 0, false, {
                        fileName: "componentsColorfulFish.jsx",
                        lineNumber: 146,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "componentsColorfulFish.jsx",
                lineNumber: 144,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ _jsxDEV("mesh", {
                position: [
                    0.8,
                    0.1,
                    -0.25
                ],
                castShadow: true,
                children: [
                    /*#__PURE__*/ _jsxDEV("sphereGeometry", {
                        args: [
                            0.1,
                            8,
                            8
                        ]
                    }, void 0, false, {
                        fileName: "componentsColorfulFish.jsx",
                        lineNumber: 149,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ _jsxDEV("meshStandardMaterial", {
                        color: "white"
                    }, void 0, false, {
                        fileName: "componentsColorfulFish.jsx",
                        lineNumber: 150,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "componentsColorfulFish.jsx",
                lineNumber: 148,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ _jsxDEV("mesh", {
                position: [
                    0.87,
                    0.1,
                    0.25
                ],
                castShadow: true,
                children: [
                    /*#__PURE__*/ _jsxDEV("sphereGeometry", {
                        args: [
                            0.05,
                            8,
                            8
                        ]
                    }, void 0, false, {
                        fileName: "componentsColorfulFish.jsx",
                        lineNumber: 155,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ _jsxDEV("meshStandardMaterial", {
                        color: "black"
                    }, void 0, false, {
                        fileName: "componentsColorfulFish.jsx",
                        lineNumber: 156,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "componentsColorfulFish.jsx",
                lineNumber: 154,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ _jsxDEV("mesh", {
                position: [
                    0.87,
                    0.1,
                    -0.25
                ],
                castShadow: true,
                children: [
                    /*#__PURE__*/ _jsxDEV("sphereGeometry", {
                        args: [
                            0.05,
                            8,
                            8
                        ]
                    }, void 0, false, {
                        fileName: "componentsColorfulFish.jsx",
                        lineNumber: 159,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ _jsxDEV("meshStandardMaterial", {
                        color: "black"
                    }, void 0, false, {
                        fileName: "componentsColorfulFish.jsx",
                        lineNumber: 160,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "componentsColorfulFish.jsx",
                lineNumber: 158,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "componentsColorfulFish.jsx",
        lineNumber: 124,
        columnNumber: 5
    }, this);
}
// School of fish component that creates multiple fish, respecting tank boundaries
export function FishSchool(param) {
    var _this = this;
    var _param_count = param.count, count = _param_count === void 0 ? 10 : _param_count, tankMin = param.tankMin, tankMax // Use tankMax prop
     = param.tankMax;
    var fishes = React.useMemo(function() {
        if (!tankMin || !tankMax) return []; // Don't spawn if bounds aren't ready
        var spawnedFishes = [];
        var rangeX = tankMax.x - tankMin.x;
        var rangeY = tankMax.y - tankMin.y;
        var rangeZ = tankMax.z - tankMin.z;
        for(var i = 0; i < count; i++){
            // Calculate random position within the provided tank bounds
            var x = tankMin.x + Math.random() * rangeX;
            var y = tankMin.y + Math.random() * rangeY;
            var z = tankMin.z + Math.random() * rangeZ;
            // Random size variations
            var size = 0.2 + Math.random() * 0.2;
            var scaleX = size * (0.8 + Math.random() * 0.4);
            var scaleY = size * (0.4 + Math.random() * 0.2);
            var scaleZ = size * (0.8 + Math.random() * 0.4);
            spawnedFishes.push(/*#__PURE__*/ _jsxDEV(ColorfulFish, {
                position: [
                    x,
                    y,
                    z
                ],
                scale: [
                    scaleX,
                    scaleY,
                    scaleZ
                ],
                color: fishColors[Math.floor(Math.random() * fishColors.length)],
                // Pass tank boundaries down to individual fish
                tankMin: tankMin,
                tankMax: tankMax
            }, i, false, {
                fileName: "componentsColorfulFish.jsx",
                lineNumber: 189,
                columnNumber: 17
            }, _this));
        }
        return spawnedFishes;
    }, [
        count,
        tankMin,
        tankMax
    ]); // Re-create fish only if bounds or count change
    return /*#__PURE__*/ _jsxDEV(_Fragment, {
        children: fishes
    }, void 0, false);
}
