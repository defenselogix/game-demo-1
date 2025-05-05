// FishTank.jsx – thin R3F wrapper around legacy envMeshes.js + Physics Sensors
function _array_like_to_array(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}
function _array_with_holes(arr) {
    if (Array.isArray(arr)) return arr;
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
function _object_spread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = arguments[i] != null ? arguments[i] : {};
        var ownKeys = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === "function") {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
        }
        ownKeys.forEach(function(key) {
            _define_property(target, key, source[key]);
        });
    }
    return target;
}
function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        if (enumerableOnly) {
            symbols = symbols.filter(function(sym) {
                return Object.getOwnPropertyDescriptor(object, sym).enumerable;
            });
        }
        keys.push.apply(keys, symbols);
    }
    return keys;
}
function _object_spread_props(target, source) {
    source = source != null ? source : {};
    if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
        ownKeys(Object(source)).forEach(function(key) {
            Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
    }
    return target;
}
function _object_without_properties(source, excluded) {
    if (source == null) return {};
    var target = _object_without_properties_loose(source, excluded);
    var key, i;
    if (Object.getOwnPropertySymbols) {
        var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
        for(i = 0; i < sourceSymbolKeys.length; i++){
            key = sourceSymbolKeys[i];
            if (excluded.indexOf(key) >= 0) continue;
            if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
            target[key] = source[key];
        }
    }
    return target;
}
function _object_without_properties_loose(source, excluded) {
    if (source == null) return {};
    var target = {};
    var sourceKeys = Object.keys(source);
    var key, i;
    for(i = 0; i < sourceKeys.length; i++){
        key = sourceKeys[i];
        if (excluded.indexOf(key) >= 0) continue;
        target[key] = source[key];
    }
    return target;
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
import React, { useMemo, useState, useEffect } from 'react'; // Import useEffect
import * as THREE from 'three'; // Import THREE
import { useFrame } from '@react-three/fiber';
import { RigidBody, CuboidCollider, BallCollider } from '@react-three/rapier';
// Pull in the procedural builders from the legacy folder
import { TankGroup } from './envMeshes.js'; // Still used for glass walls/rocks
import { createSandGroup } from './legacyVisualSandTerrain.js'; // Import the sand generator
// Tank dimensions matching visual tank size
var tankSize = {
    width: 14.4,
    height: 6.0,
    depth: 14.4
}; // Updated height to 6.0
var wallThickness = 0.1;
/**
 * Declarative Fish-Tank environment with visual mesh and physics sensors.
 * Usage: <FishTank position={[0,0,0]} scale={1} />
 */ export default function FishTank(_param) {
    var _this = this;
    var _param_position = _param.position, position = _param_position === void 0 ? [
        0,
        0,
        0
    ] : _param_position, props = _object_without_properties(_param, [
        "position"
    ]);
    // State to hold mound data for colliders
    var _useState = _sliced_to_array(useState([]), 2), moundData = _useState[0], setMoundData = _useState[1];
    // Build the visual Three.Group once and extract mound data
    var tankVisuals = useMemo(function() {
        // Create the glass walls and existing rocks from TankGroup
        var baseTank = TankGroup();
        baseTank.name = 'FishTankVisuals_Base';
        // Find and remove the old flat sand floor from the base tank group
        var oldFloor = baseTank.getObjectByName('SandFloor');
        if (oldFloor) {
            oldFloor.geometry.dispose();
            oldFloor.material.dispose();
            baseTank.remove(oldFloor);
        }
        // Create the procedural sand floor and dunes
        var sandGroup = createSandGroup({
            tankWidth: tankSize.width,
            tankDepth: tankSize.depth,
            tankHeight: tankSize.height
        });
        sandGroup.name = 'FishTankVisuals_Sand';
        // Extract mound positions and radii for physics colliders
        var mounds = [];
        sandGroup.children.forEach(function(child) {
            if (child.name.startsWith('SandMound_')) {
                // The SphereGeometry radius is stored before scaling.
                // We get the horizontal radius (original radius) and vertical scale factor.
                var radius = child.geometry.parameters.radius;
                var verticalScale = 0.35; // Same as in createSandGroup
                // Position is relative to the sandGroup origin (center bottom of tank)
                mounds.push({
                    key: child.uuid,
                    position: [
                        child.position.x,
                        child.position.y,
                        child.position.z
                    ],
                    radius: radius,
                    verticalScale: verticalScale // Store the vertical scale for the collider
                });
            }
        });
        // Set the mound data in state so it triggers a re-render for colliders
        // Use a timeout to avoid state update during render phase if useMemo runs sync
        setTimeout(function() {
            return setMoundData(mounds);
        }, 0);
        // Add the new sand group to the base tank group
        baseTank.add(sandGroup);
        return baseTank; // Return the combined group
    }, []); // Dependency array is empty, runs once
    // Make glass transparent after visuals are loaded
    useEffect(function() {
        if (tankVisuals) {
            tankVisuals.traverse(function(child) {
                // Assuming the glass mesh is named 'GlassWalls' in envMeshes.js
                // Or check if (child.isMesh && child.material.name === 'GlassMaterialName')
                if (child.isMesh && child.name === 'GlassWalls') {
                    var material = child.material;
                    material.transparent = true;
                    material.opacity = 0.15; // Adjust opacity as needed
                    material.depthWrite = false; // Important for rendering transparency correctly
                    material.side = THREE.DoubleSide; // Render both sides
                    material.needsUpdate = true; // Ensure material changes are applied
                }
            });
        }
    }, [
        tankVisuals
    ]); // Rerun effect if tankVisuals object changes
    // Optional subtle glass wobble for life (applied to the parent group)
    // useFrame(({ clock }) => {
    //   if (tankVisuals) {
    //      tankVisuals.rotation.y = Math.sin(clock.elapsedTime * 0.05) * 0.05;
    //   }
    // });
    // Tank Boundary UserData for collision identification
    var boundaryUserData = {
        type: 'tankBoundary'
    };
    return /*#__PURE__*/ _jsxDEV("group", _object_spread_props(_object_spread({
        position: position
    }, props), {
        children: [
            /*#__PURE__*/ _jsxDEV("primitive", {
                object: tankVisuals
            }, void 0, false, {
                fileName: "componentsFishTank.jsx",
                lineNumber: 92,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ _jsxDEV(RigidBody, {
                type: "fixed",
                colliders: false,
                userData: boundaryUserData,
                children: [
                    /*#__PURE__*/ _jsxDEV(CuboidCollider, {
                        args: [
                            tankSize.width / 2,
                            wallThickness / 2,
                            tankSize.depth / 2
                        ],
                        position: [
                            0,
                            -tankSize.height / 2 + wallThickness / 2,
                            0
                        ],
                        friction: 0.8,
                        restitution: 0.1
                    }, void 0, false, {
                        fileName: "componentsFishTank.jsx",
                        lineNumber: 96,
                        columnNumber: 9
                    }, this),
                    moundData.map(function(mound) {
                        return /*#__PURE__*/ _jsxDEV(BallCollider, {
                            args: [
                                mound.radius
                            ],
                            position: mound.position,
                            friction: 0.8,
                            restitution: 0.1,
                            scale: [
                                1,
                                mound.verticalScale,
                                1
                            ]
                        }, mound.key, false, {
                            fileName: "componentsFishTank.jsx",
                            lineNumber: 104,
                            columnNumber: 13
                        }, _this);
                    }),
                    /*#__PURE__*/ _jsxDEV(CuboidCollider, {
                        args: [
                            tankSize.width / 2,
                            (tankSize.height - wallThickness) / 2,
                            wallThickness / 2
                        ],
                        position: [
                            0,
                            wallThickness / 2,
                            tankSize.depth / 2 - wallThickness / 2
                        ],
                        restitution: 0.1
                    }, void 0, false, {
                        fileName: "componentsFishTank.jsx",
                        lineNumber: 114,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ _jsxDEV(CuboidCollider, {
                        args: [
                            tankSize.width / 2,
                            (tankSize.height - wallThickness) / 2,
                            wallThickness / 2
                        ],
                        position: [
                            0,
                            wallThickness / 2,
                            -tankSize.depth / 2 + wallThickness / 2
                        ],
                        restitution: 0.1
                    }, void 0, false, {
                        fileName: "componentsFishTank.jsx",
                        lineNumber: 120,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ _jsxDEV(CuboidCollider, {
                        args: [
                            wallThickness / 2,
                            (tankSize.height - wallThickness) / 2,
                            (tankSize.depth - wallThickness * 2) / 2
                        ],
                        position: [
                            -tankSize.width / 2 + wallThickness / 2,
                            wallThickness / 2,
                            0
                        ],
                        restitution: 0.1
                    }, void 0, false, {
                        fileName: "componentsFishTank.jsx",
                        lineNumber: 126,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ _jsxDEV(CuboidCollider, {
                        args: [
                            wallThickness / 2,
                            (tankSize.height - wallThickness) / 2,
                            (tankSize.depth - wallThickness * 2) / 2
                        ],
                        position: [
                            tankSize.width / 2 - wallThickness / 2,
                            wallThickness / 2,
                            0
                        ],
                        restitution: 0.1
                    }, void 0, false, {
                        fileName: "componentsFishTank.jsx",
                        lineNumber: 132,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ _jsxDEV(BallCollider, {
                        args: [
                            0.3
                        ],
                        position: [
                            tankSize.width * -0.2,
                            -tankSize.height / 2 + wallThickness + 0.15,
                            tankSize.depth * -0.15 // Z: -2.16 (Matches envMeshes)
                        ],
                        sensor: true
                    }, void 0, false, {
                        fileName: "componentsFishTank.jsx",
                        lineNumber: 138,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ _jsxDEV(BallCollider, {
                        args: [
                            0.5
                        ],
                        position: [
                            0,
                            -tankSize.height / 2 + wallThickness + 0.25,
                            0 // Z: 0 (Matches envMeshes)
                        ],
                        sensor: true
                    }, void 0, false, {
                        fileName: "componentsFishTank.jsx",
                        lineNumber: 148,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ _jsxDEV(BallCollider, {
                        args: [
                            0.2
                        ],
                        position: [
                            tankSize.width * 0.1,
                            -tankSize.height / 2 + wallThickness + 0.1,
                            tankSize.depth * 0.1 // Z: 1.44 (Matches envMeshes)
                        ],
                        sensor: true
                    }, void 0, false, {
                        fileName: "componentsFishTank.jsx",
                        lineNumber: 158,
                        columnNumber: 10
                    }, this)
                ]
            }, void 0, true, {
                fileName: "componentsFishTank.jsx",
                lineNumber: 94,
                columnNumber: 7
            }, this)
        ]
    }), void 0, true, {
        fileName: "componentsFishTank.jsx",
        lineNumber: 90,
        columnNumber: 5
    }, this);
}
