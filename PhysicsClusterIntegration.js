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
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stats } from '@react-three/drei';
import { Physics, useRapier } from '@react-three/rapier';
// Removed PhysicsClusterDemo import
import { AppErrorBoundary } from './AppErrorBoundary.js';
// import { ErrorTestingPage } from 'ErrorTestingPage'; // Temporarily commented out
/**
 * The physics world provider component that directly passes Rapier world and instance
 * to the PhysicsClusterDemo component
 */ function PhysicsWrapper(param) {
    var children = param.children;
    var _useRapier = useRapier(), rapier = _useRapier.rapier, world = _useRapier.world;
    // Only render children when both rapier and world are available
    if (!rapier || !world) {
        return null;
    }
    return children({
        rapier: rapier,
        world: world
    });
}
/**
 * Ground plane for objects to rest on
 */ function Ground() {
    return /*#__PURE__*/ _jsxDEV("mesh", {
        rotation: [
            -Math.PI / 2,
            0,
            0
        ],
        position: [
            0,
            0,
            0
        ],
        receiveShadow: true,
        children: [
            /*#__PURE__*/ _jsxDEV("planeGeometry", {
                args: [
                    30,
                    30
                ]
            }, void 0, false, {
                fileName: "PhysicsClusterIntegration.jsx",
                lineNumber: 29,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ _jsxDEV("meshStandardMaterial", {
                color: "#444444"
            }, void 0, false, {
                fileName: "PhysicsClusterIntegration.jsx",
                lineNumber: 30,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "PhysicsClusterIntegration.jsx",
        lineNumber: 28,
        columnNumber: 5
    }, this);
}
/**
 * Integration component that demonstrates PhysicsClusterDemo within a Three.js scene
 * 
 * @param {Object} props - Component properties
 * @param {boolean} props.enabled - Whether physics simulation is enabled
 */ export function PhysicsClusterIntegration(param) {
    var _param_enabled = param.enabled, enabled = _param_enabled === void 0 ? true : _param_enabled;
    var _useState = _sliced_to_array(useState(enabled), 2), physicsEnabled = _useState[0], setPhysicsEnabled = _useState[1];
    var _useState1 = _sliced_to_array(useState(function() {
        // Disable error testing but keep error handling
        localStorage.setItem('showErrorTesting', 'false');
        localStorage.removeItem('errorTestingTimestamp');
        return false;
    }), 2), showErrorTesting = _useState1[0], setShowErrorTesting = _useState1[1];
    // Update internal state when enabled prop changes
    useEffect(function() {
        setPhysicsEnabled(enabled);
    }, [
        enabled
    ]);
    // Handle keyboard controls
    useEffect(function() {
        var handleKeyDown = function(e) {
            if (e.code === 'Space') {
                setPhysicsEnabled(function(prev) {
                    return !prev;
                });
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return function() {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);
    return /*#__PURE__*/ _jsxDEV("div", {
        style: {
            position: 'relative',
            width: '100%',
            height: '100%'
        },
        children: [
            /*#__PURE__*/ _jsxDEV("div", {
                style: {
                    position: 'absolute',
                    top: 10,
                    left: 10,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    color: 'white',
                    padding: '10px',
                    borderRadius: '5px',
                    zIndex: 100,
                    fontSize: '14px'
                },
                children: [
                    /*#__PURE__*/ _jsxDEV("h3", {
                        style: {
                            margin: '0 0 5px 0'
                        },
                        children: "Physics Cluster Demo"
                    }, void 0, false, {
                        fileName: "PhysicsClusterIntegration.jsx",
                        lineNumber: 83,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ _jsxDEV("p", {
                        style: {
                            margin: '0 0 5px 0'
                        },
                        children: [
                            "Click on scene to apply explosion forces",
                            /*#__PURE__*/ _jsxDEV("br", {}, void 0, false, {
                                fileName: "PhysicsClusterIntegration.jsx",
                                lineNumber: 85,
                                columnNumber: 51
                            }, this),
                            "Press SPACE to ",
                            physicsEnabled ? 'pause' : 'resume',
                            " physics",
                            /*#__PURE__*/ _jsxDEV("br", {}, void 0, false, {
                                fileName: "PhysicsClusterIntegration.jsx",
                                lineNumber: 86,
                                columnNumber: 71
                            }, this),
                            "Drag to rotate | Scroll to zoom"
                        ]
                    }, void 0, true, {
                        fileName: "PhysicsClusterIntegration.jsx",
                        lineNumber: 84,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ _jsxDEV("div", {
                        style: {
                            display: 'flex',
                            alignItems: 'center'
                        },
                        children: [
                            /*#__PURE__*/ _jsxDEV("span", {
                                children: "Physics: "
                            }, void 0, false, {
                                fileName: "PhysicsClusterIntegration.jsx",
                                lineNumber: 93,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ _jsxDEV("span", {
                                style: {
                                    marginLeft: '5px',
                                    color: physicsEnabled ? '#4CAF50' : '#F44336',
                                    fontWeight: 'bold'
                                },
                                children: physicsEnabled ? 'ENABLED' : 'PAUSED'
                            }, void 0, false, {
                                fileName: "PhysicsClusterIntegration.jsx",
                                lineNumber: 94,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "PhysicsClusterIntegration.jsx",
                        lineNumber: 89,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "PhysicsClusterIntegration.jsx",
                lineNumber: 72,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ _jsxDEV("div", {
                style: {
                    position: 'absolute',
                    top: 10,
                    right: 10,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    color: 'white',
                    padding: '10px',
                    borderRadius: '5px',
                    zIndex: 100,
                    fontSize: '14px'
                },
                children: /*#__PURE__*/ _jsxDEV("label", {
                    style: {
                        display: 'flex',
                        alignItems: 'center',
                        cursor: 'pointer'
                    },
                    children: [
                        /*#__PURE__*/ _jsxDEV("input", {
                            type: "checkbox",
                            checked: showErrorTesting,
                            onChange: function() {
                                setShowErrorTesting(function(prev) {
                                    var newState = !prev;
                                    // Save to localStorage whenever state changes
                                    localStorage.setItem('showErrorTesting', JSON.stringify(newState));
                                    // Save timestamp when enabling error testing
                                    if (newState) {
                                        localStorage.setItem('errorTestingTimestamp', Date.now().toString());
                                    } else {
                                        // Clear timestamp when disabling
                                        localStorage.removeItem('errorTestingTimestamp');
                                    }
                                    return newState;
                                });
                            },
                            style: {
                                marginRight: '8px'
                            }
                        }, void 0, false, {
                            fileName: "PhysicsClusterIntegration.jsx",
                            lineNumber: 117,
                            columnNumber: 11
                        }, this),
                        "Show Error Testing Page"
                    ]
                }, void 0, true, {
                    fileName: "PhysicsClusterIntegration.jsx",
                    lineNumber: 116,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "PhysicsClusterIntegration.jsx",
                lineNumber: 105,
                columnNumber: 7
            }, this),
            showErrorTesting ? /*#__PURE__*/ _jsxDEV("div", {
                children: "Error Testing Page is currently disabled."
            }, void 0, false, {
                fileName: "PhysicsClusterIntegration.jsx",
                lineNumber: 145,
                columnNumber: 9
            }, this) // Placeholder instead of ErrorTestingPage
             : /* 3D Canvas */ /*#__PURE__*/ _jsxDEV(Canvas, {
                shadows: true,
                camera: {
                    position: [
                        0,
                        10,
                        15
                    ],
                    fov: 60
                },
                children: /*#__PURE__*/ _jsxDEV(AppErrorBoundary, {
                    onError: function(error) {
                        return console.error('Physics Cluster Error:', error);
                    },
                    children: [
                        /*#__PURE__*/ _jsxDEV("color", {
                            attach: "background",
                            args: [
                                '#111'
                            ]
                        }, void 0, false, {
                            fileName: "PhysicsClusterIntegration.jsx",
                            lineNumber: 150,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ _jsxDEV(Stats, {}, void 0, false, {
                            fileName: "PhysicsClusterIntegration.jsx",
                            lineNumber: 153,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ _jsxDEV(OrbitControls, {
                            makeDefault: true,
                            minDistance: 5,
                            maxDistance: 30,
                            maxPolarAngle: Math.PI / 2 - 0.1
                        }, void 0, false, {
                            fileName: "PhysicsClusterIntegration.jsx",
                            lineNumber: 156,
                            columnNumber: 9
                        }, this),
                        /*#__PURE__*/ _jsxDEV("ambientLight", {
                            intensity: 0.4
                        }, void 0, false, {
                            fileName: "PhysicsClusterIntegration.jsx",
                            lineNumber: 164,
                            columnNumber: 9
                        }, this),
                        /*#__PURE__*/ _jsxDEV("directionalLight", {
                            position: [
                                10,
                                10,
                                5
                            ],
                            intensity: 0.8,
                            castShadow: true,
                            "shadow-mapSize": [
                                2048,
                                2048
                            ],
                            "shadow-camera-left": -15,
                            "shadow-camera-right": 15,
                            "shadow-camera-top": 15,
                            "shadow-camera-bottom": -15
                        }, void 0, false, {
                            fileName: "PhysicsClusterIntegration.jsx",
                            lineNumber: 165,
                            columnNumber: 9
                        }, this),
                        /*#__PURE__*/ _jsxDEV(Physics, {
                            gravity: [
                                0,
                                -9.81,
                                0
                            ],
                            timeStep: 1 / 60,
                            interpolate: true,
                            debug: false,
                            children: [
                                /*#__PURE__*/ _jsxDEV(Ground, {}, void 0, false, {
                                    fileName: "PhysicsClusterIntegration.jsx",
                                    lineNumber: 184,
                                    columnNumber: 11
                                }, this),
                                /*#__PURE__*/ _jsxDEV(PhysicsWrapper, {
                                    children: function(param) {
                                        var rapier = param.rapier, world = param.world;
                                        return(// PhysicsClusterDemo component removed here
                                        null // Placeholder, or add alternative content if needed
                                        );
                                    }
                                }, void 0, false, {
                                    fileName: "PhysicsClusterIntegration.jsx",
                                    lineNumber: 187,
                                    columnNumber: 11
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "PhysicsClusterIntegration.jsx",
                            lineNumber: 177,
                            columnNumber: 9
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "PhysicsClusterIntegration.jsx",
                    lineNumber: 149,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "PhysicsClusterIntegration.jsx",
                lineNumber: 148,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "PhysicsClusterIntegration.jsx",
        lineNumber: 70,
        columnNumber: 5
    }, this);
}
