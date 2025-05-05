function _array_like_to_array(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}
function _array_with_holes(arr) {
    if (Array.isArray(arr)) return arr;
}
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
        var info = gen[key](arg);
        var value = info.value;
    } catch (error) {
        reject(error);
        return;
    }
    if (info.done) {
        resolve(value);
    } else {
        Promise.resolve(value).then(_next, _throw);
    }
}
function _async_to_generator(fn) {
    return function() {
        var self = this, args = arguments;
        return new Promise(function(resolve, reject) {
            var gen = fn.apply(self, args);
            function _next(value) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
            }
            function _throw(err) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
            }
            _next(undefined);
        });
    };
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
function _ts_generator(thisArg, body) {
    var f, y, t, g, _ = {
        label: 0,
        sent: function() {
            if (t[0] & 1) throw t[1];
            return t[1];
        },
        trys: [],
        ops: []
    };
    return g = {
        next: verb(0),
        "throw": verb(1),
        "return": verb(2)
    }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
        return this;
    }), g;
    function verb(n) {
        return function(v) {
            return step([
                n,
                v
            ]);
        };
    }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while(_)try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [
                op[0] & 2,
                t.value
            ];
            switch(op[0]){
                case 0:
                case 1:
                    t = op;
                    break;
                case 4:
                    _.label++;
                    return {
                        value: op[1],
                        done: false
                    };
                case 5:
                    _.label++;
                    y = op[1];
                    op = [
                        0
                    ];
                    continue;
                case 7:
                    op = _.ops.pop();
                    _.trys.pop();
                    continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                        _ = 0;
                        continue;
                    }
                    if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                        _.label = op[1];
                        break;
                    }
                    if (op[0] === 6 && _.label < t[1]) {
                        _.label = t[1];
                        t = op;
                        break;
                    }
                    if (t && _.label < t[2]) {
                        _.label = t[2];
                        _.ops.push(op);
                        break;
                    }
                    if (t[2]) _.ops.pop();
                    _.trys.pop();
                    continue;
            }
            op = body.call(thisArg, _);
        } catch (e) {
            op = [
                6,
                e
            ];
            y = 0;
        } finally{
            f = t = 0;
        }
        if (op[0] & 5) throw op[1];
        return {
            value: op[0] ? op[1] : void 0,
            done: true
        };
    }
}
var _this = this;
import { jsxDEV as _jsxDEV } from "react/jsx-dev-runtime";
import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { createPhysicsDemo } from 'physicsScene';
/**
 * A React component that renders an interactive physics demonstration
 * using the physicsScene implementation
 */ export var PhysicsDemo = function() {
    var containerRef = useRef(null);
    var physicsSceneRef = useRef(null);
    var _useState = _sliced_to_array(useState(true), 2), isLoading = _useState[0], setIsLoading = _useState[1];
    var _useState1 = _sliced_to_array(useState(null), 2), error = _useState1[0], setError = _useState1[1];
    // Initialize the physics scene when component mounts
    useEffect(function() {
        var isMounted = true;
        var initPhysics = /*#__PURE__*/ function() {
            var _ref = _async_to_generator(function() {
                var physicsScene, err;
                return _ts_generator(this, function(_state) {
                    switch(_state.label){
                        case 0:
                            _state.trys.push([
                                0,
                                3,
                                ,
                                4
                            ]);
                            if (!(containerRef.current && isMounted)) return [
                                3,
                                2
                            ];
                            setIsLoading(true);
                            return [
                                4,
                                createPhysicsDemo(containerRef.current)
                            ];
                        case 1:
                            physicsScene = _state.sent();
                            if (physicsScene && isMounted) {
                                physicsSceneRef.current = physicsScene;
                                setIsLoading(false);
                            }
                            _state.label = 2;
                        case 2:
                            return [
                                3,
                                4
                            ];
                        case 3:
                            err = _state.sent();
                            console.error('Failed to initialize physics:', err);
                            if (isMounted) {
                                setError('Failed to initialize physics engine. Please try again later.');
                                setIsLoading(false);
                            }
                            return [
                                3,
                                4
                            ];
                        case 4:
                            return [
                                2
                            ];
                    }
                });
            });
            return function initPhysics() {
                return _ref.apply(this, arguments);
            };
        }();
        initPhysics();
        // Clean up when component unmounts
        return function() {
            isMounted = false;
            if (physicsSceneRef.current) {
                physicsSceneRef.current.dispose();
                physicsSceneRef.current = null;
            }
        };
    }, []);
    // Handle spawning new objects on button click
    var handleSpawnObject = function(type) {
        if (physicsSceneRef.current) {
            var scene = physicsSceneRef.current;
            // Generate a random position above the center of the scene
            var position = new THREE.Vector3(THREE.MathUtils.randFloatSpread(3), 5 + Math.random() * 2, THREE.MathUtils.randFloatSpread(3));
            scene.spawnObject(type, position);
        }
    };
    // Add multiple random objects
    var handleAddMultiple = function() {
        if (physicsSceneRef.current) {
            physicsSceneRef.current.spawnRandomObjects(5);
        }
    };
    return /*#__PURE__*/ _jsxDEV("div", {
        className: "physics-demo",
        children: [
            /*#__PURE__*/ _jsxDEV("div", {
                className: "scene-container",
                ref: containerRef,
                style: {
                    width: '100%',
                    height: '500px',
                    position: 'relative'
                },
                children: [
                    isLoading && /*#__PURE__*/ _jsxDEV("div", {
                        className: "loading-overlay",
                        children: [
                            /*#__PURE__*/ _jsxDEV("div", {
                                className: "loading-spinner"
                            }, void 0, false, {
                                fileName: "PhysicsDemo.jsx",
                                lineNumber: 83,
                                columnNumber: 13
                            }, _this),
                            /*#__PURE__*/ _jsxDEV("p", {
                                children: "Loading Physics Demo..."
                            }, void 0, false, {
                                fileName: "PhysicsDemo.jsx",
                                lineNumber: 84,
                                columnNumber: 13
                            }, _this)
                        ]
                    }, void 0, true, {
                        fileName: "PhysicsDemo.jsx",
                        lineNumber: 82,
                        columnNumber: 11
                    }, _this),
                    error && /*#__PURE__*/ _jsxDEV("div", {
                        className: "error-message",
                        children: /*#__PURE__*/ _jsxDEV("p", {
                            children: error
                        }, void 0, false, {
                            fileName: "PhysicsDemo.jsx",
                            lineNumber: 90,
                            columnNumber: 13
                        }, _this)
                    }, void 0, false, {
                        fileName: "PhysicsDemo.jsx",
                        lineNumber: 89,
                        columnNumber: 11
                    }, _this)
                ]
            }, void 0, true, {
                fileName: "PhysicsDemo.jsx",
                lineNumber: 78,
                columnNumber: 7
            }, _this),
            /*#__PURE__*/ _jsxDEV("div", {
                className: "controls",
                children: [
                    /*#__PURE__*/ _jsxDEV("button", {
                        onClick: function() {
                            return handleSpawnObject('box');
                        },
                        disabled: isLoading || error,
                        children: "Add Box"
                    }, void 0, false, {
                        fileName: "PhysicsDemo.jsx",
                        lineNumber: 96,
                        columnNumber: 9
                    }, _this),
                    /*#__PURE__*/ _jsxDEV("button", {
                        onClick: function() {
                            return handleSpawnObject('sphere');
                        },
                        disabled: isLoading || error,
                        children: "Add Sphere"
                    }, void 0, false, {
                        fileName: "PhysicsDemo.jsx",
                        lineNumber: 99,
                        columnNumber: 9
                    }, _this),
                    /*#__PURE__*/ _jsxDEV("button", {
                        onClick: function() {
                            return handleSpawnObject('cylinder');
                        },
                        disabled: isLoading || error,
                        children: "Add Cylinder"
                    }, void 0, false, {
                        fileName: "PhysicsDemo.jsx",
                        lineNumber: 102,
                        columnNumber: 9
                    }, _this),
                    /*#__PURE__*/ _jsxDEV("button", {
                        onClick: handleAddMultiple,
                        disabled: isLoading || error,
                        children: "Add 5 Random Objects"
                    }, void 0, false, {
                        fileName: "PhysicsDemo.jsx",
                        lineNumber: 105,
                        columnNumber: 9
                    }, _this)
                ]
            }, void 0, true, {
                fileName: "PhysicsDemo.jsx",
                lineNumber: 95,
                columnNumber: 7
            }, _this),
            /*#__PURE__*/ _jsxDEV("div", {
                className: "instructions",
                children: [
                    /*#__PURE__*/ _jsxDEV("h3", {
                        children: "Instructions:"
                    }, void 0, false, {
                        fileName: "PhysicsDemo.jsx",
                        lineNumber: 111,
                        columnNumber: 9
                    }, _this),
                    /*#__PURE__*/ _jsxDEV("p", {
                        children: "Click on any button to add objects to the physics scene."
                    }, void 0, false, {
                        fileName: "PhysicsDemo.jsx",
                        lineNumber: 112,
                        columnNumber: 9
                    }, _this),
                    /*#__PURE__*/ _jsxDEV("p", {
                        children: "Click anywhere in the scene to throw an object in that direction."
                    }, void 0, false, {
                        fileName: "PhysicsDemo.jsx",
                        lineNumber: 113,
                        columnNumber: 9
                    }, _this)
                ]
            }, void 0, true, {
                fileName: "PhysicsDemo.jsx",
                lineNumber: 110,
                columnNumber: 7
            }, _this),
            /*#__PURE__*/ _jsxDEV("style", {
                jsx: true,
                children: "\n        .physics-demo {\n          font-family: Arial, sans-serif;\n          max-width: 1200px;\n          margin: 0 auto;\n          padding: 20px;\n        }\n        \n        .scene-container {\n          background-color: #f0f0f0;\n          border-radius: 8px;\n          overflow: hidden;\n          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);\n        }\n        \n        .controls {\n          display: flex;\n          flex-wrap: wrap;\n          gap: 10px;\n          margin-top: 20px;\n          justify-content: center;\n        }\n        \n        button {\n          background-color: #4CAF50;\n          color: white;\n          border: none;\n          padding: 10px 15px;\n          border-radius: 4px;\n          cursor: pointer;\n          font-size: 16px;\n          transition: background-color 0.3s;\n        }\n        \n        button:hover {\n          background-color: #45a049;\n        }\n        \n        button:disabled {\n          background-color: #cccccc;\n          cursor: not-allowed;\n        }\n        \n        .loading-overlay {\n          position: absolute;\n          top: 0;\n          left: 0;\n          width: 100%;\n          height: 100%;\n          display: flex;\n          flex-direction: column;\n          justify-content: center;\n          align-items: center;\n          background-color: rgba(255, 255, 255, 0.8);\n          z-index: 10;\n        }\n        \n        .loading-spinner {\n          border: 5px solid #f3f3f3;\n          border-top: 5px solid #3498db;\n          border-radius: 50%;\n          width: 50px;\n          height: 50px;\n          animation: spin 1s linear infinite;\n          margin-bottom: 20px;\n        }\n        \n        @keyframes spin {\n          0% { transform: rotate(0deg); }\n          100% { transform: rotate(360deg); }\n        }\n        \n        .error-message {\n          position: absolute;\n          top: 0;\n          left: 0;\n          width: 100%;\n          height: 100%;\n          display: flex;\n          justify-content: center;\n          align-items: center;\n          background-color: rgba(255, 0, 0, 0.1);\n          color: #d32f2f;\n          text-align: center;\n          padding: 20px;\n        }\n        \n        .instructions {\n          margin-top: 20px;\n          padding: 15px;\n          background-color: #f8f8f8;\n          border-radius: 8px;\n          border-left: 4px solid #4CAF50;\n        }\n        \n        /* Responsive styles */\n        @media (max-width: 768px) {\n          .scene-container {\n            height: 350px;\n          }\n          \n          button {\n            padding: 8px 12px;\n            font-size: 14px;\n          }\n          \n          .instructions {\n            font-size: 14px;\n          }\n        }\n      "
            }, void 0, false, {
                fileName: "PhysicsDemo.jsx",
                lineNumber: 116,
                columnNumber: 7
            }, _this)
        ]
    }, void 0, true, {
        fileName: "PhysicsDemo.jsx",
        lineNumber: 77,
        columnNumber: 5
    }, _this);
};
