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
var _this = this;
import { jsxDEV as _jsxDEV } from "react/jsx-dev-runtime";
import React, { useRef, useState, useCallback, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import GameSceneCore from './GameSceneCore.js';
import { GameScene } from './GameScene.js';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { ErrorBoundary } from './ErrorBoundary.js';
import { FallbackErrorUI } from './FallbackErrorUI.js';
import { OrbitControls } from '@react-three/drei';
import { useUI } from './UIContext.js';
import { PerformanceAdaptiveRenderer } from './PerformanceAdaptiveRenderer.js';
// For client-side only code
var isDevelopment = false; // Replace process.env check with a constant
// Simple loading fallback component for Suspense
var LoadingFallback = function() {
    return /*#__PURE__*/ _jsxDEV("mesh", {
        position: [
            0,
            0,
            0
        ],
        children: [
            /*#__PURE__*/ _jsxDEV("sphereGeometry", {
                args: [
                    1,
                    16,
                    16
                ]
            }, void 0, false, {
                fileName: "GameCanvas.js",
                lineNumber: 17,
                columnNumber: 7
            }, _this),
            /*#__PURE__*/ _jsxDEV("meshStandardMaterial", {
                color: "#4080ff",
                wireframe: true
            }, void 0, false, {
                fileName: "GameCanvas.js",
                lineNumber: 18,
                columnNumber: 7
            }, _this)
        ]
    }, void 0, true, {
        fileName: "GameCanvas.js",
        lineNumber: 16,
        columnNumber: 5
    }, _this);
};
// Scene wrapper with inner error boundary
var SceneWrapper = function(param) {
    var children = param.children, emitter = param.emitter, showPhysicsDemo = param.showPhysicsDemo, physicsEnabled = param.physicsEnabled, onSceneLoaded = param.onSceneLoaded;
    var _useState = _sliced_to_array(useState(false), 2), isSceneLoaded = _useState[0], setIsSceneLoaded = _useState[1];
    var handleSceneLoaded = useCallback(function() {
        setIsSceneLoaded(true);
        if (typeof onSceneLoaded === 'function') {
            onSceneLoaded();
        }
    }, [
        onSceneLoaded
    ]);
    return /*#__PURE__*/ _jsxDEV(ErrorBoundary, {
        fallback: /*#__PURE__*/ _jsxDEV("mesh", {
            position: [
                0,
                0,
                0
            ],
            children: [
                /*#__PURE__*/ _jsxDEV("boxGeometry", {
                    args: [
                        1,
                        1,
                        1
                    ]
                }, void 0, false, {
                    fileName: "GameCanvas.js",
                    lineNumber: 35,
                    columnNumber: 9
                }, void 0),
                /*#__PURE__*/ _jsxDEV("meshStandardMaterial", {
                    color: "#ff4040"
                }, void 0, false, {
                    fileName: "GameCanvas.js",
                    lineNumber: 36,
                    columnNumber: 9
                }, void 0)
            ]
        }, void 0, true, {
            fileName: "GameCanvas.js",
            lineNumber: 34,
            columnNumber: 7
        }, void 0),
        children: /*#__PURE__*/ _jsxDEV(Suspense, {
            fallback: /*#__PURE__*/ _jsxDEV(LoadingFallback, {}, void 0, false, {
                fileName: "GameCanvas.js",
                lineNumber: 39,
                columnNumber: 27
            }, void 0),
            children: [
                /*#__PURE__*/ _jsxDEV(GameScene, {
                    onLoaded: handleSceneLoaded,
                    showPhysicsDemo: showPhysicsDemo,
                    physicsEnabled: physicsEnabled
                }, void 0, false, {
                    fileName: "GameCanvas.js",
                    lineNumber: 40,
                    columnNumber: 9
                }, _this),
                emitter && isSceneLoaded && /*#__PURE__*/ _jsxDEV(EffectComposer, {
                    children: /*#__PURE__*/ _jsxDEV(Bloom, {
                        luminanceThreshold: 0.2,
                        luminanceSmoothing: 0.9,
                        intensity: 0.3
                    }, void 0, false, {
                        fileName: "GameCanvas.js",
                        lineNumber: 49,
                        columnNumber: 13
                    }, _this)
                }, void 0, false, {
                    fileName: "GameCanvas.js",
                    lineNumber: 48,
                    columnNumber: 11
                }, _this),
                children
            ]
        }, void 0, true, {
            fileName: "GameCanvas.js",
            lineNumber: 39,
            columnNumber: 7
        }, _this)
    }, void 0, false, {
        fileName: "GameCanvas.js",
        lineNumber: 33,
        columnNumber: 5
    }, _this);
};
export var GameCanvas = function(param) {
    var _param_showPhysicsDemo = param.showPhysicsDemo, showPhysicsDemo = _param_showPhysicsDemo === void 0 ? false : _param_showPhysicsDemo, _param_physicsEnabled = param.physicsEnabled, physicsEnabled = _param_physicsEnabled === void 0 ? true : _param_physicsEnabled, children = param.children, onBubblePoolReady = param.onBubblePoolReady;
    var _useState = _sliced_to_array(useState(null), 2), emitter = _useState[0], setEmitter = _useState[1];
    var _useState1 = _sliced_to_array(useState(null), 2), bubblePool = _useState1[0], setBubblePool = _useState1[1];
    var _useState2 = _sliced_to_array(useState(false), 2), isSceneReady = _useState2[0], setIsSceneReady = _useState2[1];
    var canvasRef = useRef();
    var causticsIntensity = useUI().causticsIntensity;
    var handleEmitterReady = function(emitterRef) {
        setEmitter(emitterRef);
    };
    var handleBubblePoolReady = useCallback(function(pool) {
        setBubblePool(pool);
        // Pass the bubble pool up to the parent App component
        if (typeof onBubblePoolReady === 'function') {
            onBubblePoolReady(pool);
        }
    }, [
        onBubblePoolReady
    ]);
    var handleSceneLoaded = useCallback(function() {
        setIsSceneReady(true);
    }, []);
    return /*#__PURE__*/ _jsxDEV(ErrorBoundary, {
        fallback: /*#__PURE__*/ _jsxDEV(FallbackErrorUI, {}, void 0, false, {
            fileName: "GameCanvas.js",
            lineNumber: 86,
            columnNumber: 30
        }, void 0),
        children: /*#__PURE__*/ _jsxDEV("div", {
            style: {
                width: '100%',
                height: '100%',
                position: 'relative'
            },
            children: /*#__PURE__*/ _jsxDEV(Canvas, {
                ref: canvasRef,
                shadows: true,
                camera: {
                    position: [
                        0,
                        3,
                        6
                    ],
                    fov: 60
                },
                dpr: [
                    1,
                    2
                ],
                style: {
                    background: '#001020'
                },
                children: /*#__PURE__*/ _jsxDEV(PerformanceAdaptiveRenderer, {
                    children: [
                        /*#__PURE__*/ _jsxDEV(OrbitControls, {
                            enablePan: true,
                            enableZoom: true,
                            enableRotate: true,
                            target: [
                                0,
                                2.55,
                                -2.5
                            ],
                            minDistance: 2,
                            maxDistance: 20,
                            minPolarAngle: 0,
                            maxPolarAngle: Math.PI / 1.5
                        }, void 0, false, {
                            fileName: "GameCanvas.js",
                            lineNumber: 96,
                            columnNumber: 13
                        }, _this),
                        /*#__PURE__*/ _jsxDEV(SceneWrapper, {
                            emitter: emitter,
                            showPhysicsDemo: showPhysicsDemo,
                            physicsEnabled: physicsEnabled,
                            onSceneLoaded: handleSceneLoaded,
                            children: children
                        }, void 0, false, {
                            fileName: "GameCanvas.js",
                            lineNumber: 107,
                            columnNumber: 13
                        }, _this)
                    ]
                }, void 0, true, {
                    fileName: "GameCanvas.js",
                    lineNumber: 95,
                    columnNumber: 11
                }, _this)
            }, void 0, false, {
                fileName: "GameCanvas.js",
                lineNumber: 88,
                columnNumber: 9
            }, _this)
        }, void 0, false, {
            fileName: "GameCanvas.js",
            lineNumber: 87,
            columnNumber: 7
        }, _this)
    }, void 0, false, {
        fileName: "GameCanvas.js",
        lineNumber: 86,
        columnNumber: 5
    }, _this);
};
