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
var _this = this;
import { jsxDEV as _jsxDEV, Fragment as _Fragment } from "react/jsx-dev-runtime";
import React, { useEffect, useState, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Environment } from './Environment.js';
import { FishSchool } from './componentsColorfulFish.js';
import { useUI } from './UIContext.js';
/**
 * GameSceneRender component
 * Handles the rendering part of the GameScene while delegating core logic to GameSceneCore
 */ var GameSceneRender = function(_param) {
    var core = _param.core, _param_causticsIntensity = _param.causticsIntensity, causticsIntensity = _param_causticsIntensity === void 0 ? 0.5 : _param_causticsIntensity, onEmitterReady = _param.onEmitterReady, onBubblePoolReady = _param.onBubblePoolReady, _param_showPhysicsDemo = _param.showPhysicsDemo, showPhysicsDemo = _param_showPhysicsDemo === void 0 ? false : _param_showPhysicsDemo, _param_physicsEnabled = _param.physicsEnabled, physicsEnabled = _param_physicsEnabled === void 0 ? true : _param_physicsEnabled, _param_removeLegacySandMounds = _param.removeLegacySandMounds, removeLegacySandMounds = _param_removeLegacySandMounds === void 0 ? true : _param_removeLegacySandMounds, onError = _param.onError, props = _object_without_properties(_param, [
        "core",
        "causticsIntensity",
        "onEmitterReady",
        "onBubblePoolReady",
        "showPhysicsDemo",
        "physicsEnabled",
        "removeLegacySandMounds",
        "onError"
    ]);
    var scene = useThree().scene;
    var _useState = _sliced_to_array(useState(false), 2), isInitialized = _useState[0], setIsInitialized = _useState[1];
    var gameCore = useRef(null);
    var waterColor = useUI().waterColor;
    // Initialize the game core
    useEffect(function() {
        try {
            if (!gameCore.current && core) {
                gameCore.current = new core({
                    scene: scene,
                    causticsIntensity: causticsIntensity,
                    waterColor: waterColor,
                    removeLegacySandMounds: removeLegacySandMounds
                });
                // Setup callbacks
                if (onEmitterReady && gameCore.current.bubbleEmitter) {
                    onEmitterReady(gameCore.current.bubbleEmitter);
                }
                if (onBubblePoolReady && gameCore.current.bubblePool) {
                    onBubblePoolReady(gameCore.current.bubblePool);
                }
                setIsInitialized(true);
            }
        } catch (error) {
            console.error("Error initializing GameSceneCore:", error);
            if (onError) onError(error);
        }
        // Cleanup function
        return function() {
            if (gameCore.current && gameCore.current.dispose) {
                gameCore.current.dispose();
            }
        };
    }, [
        scene,
        core,
        causticsIntensity,
        waterColor,
        onEmitterReady,
        onBubblePoolReady,
        onError,
        removeLegacySandMounds
    ]);
    // Update game core on each frame
    useFrame(function(state, delta) {
        if (gameCore.current && gameCore.current.update) {
            gameCore.current.update(state, delta);
        }
    });
    return /*#__PURE__*/ _jsxDEV(_Fragment, {
        children: [
            /*#__PURE__*/ _jsxDEV(Environment, {}, void 0, false, {
                fileName: "GameSceneRender.jsx",
                lineNumber: 72,
                columnNumber: 7
            }, _this),
            /*#__PURE__*/ _jsxDEV(FishSchool, {
                count: 15,
                bounds: [
                    5,
                    3,
                    5
                ],
                centerPosition: [
                    0,
                    3,
                    -2.5
                ]
            }, void 0, false, {
                fileName: "GameSceneRender.jsx",
                lineNumber: 75,
                columnNumber: 7
            }, _this),
            /*#__PURE__*/ _jsxDEV("ambientLight", {
                intensity: 0.3
            }, void 0, false, {
                fileName: "GameSceneRender.jsx",
                lineNumber: 78,
                columnNumber: 7
            }, _this),
            /*#__PURE__*/ _jsxDEV("directionalLight", {
                position: [
                    5,
                    10,
                    2
                ],
                intensity: 1.5,
                castShadow: true,
                "shadow-mapSize-width": 1024,
                "shadow-mapSize-height": 1024
            }, void 0, false, {
                fileName: "GameSceneRender.jsx",
                lineNumber: 79,
                columnNumber: 7
            }, _this)
        ]
    }, void 0, true);
};
export { GameSceneRender };
