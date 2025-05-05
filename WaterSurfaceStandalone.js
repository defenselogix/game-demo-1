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
var _this = this;
import { jsxDEV as _jsxDEV } from "react/jsx-dev-runtime";
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { WaterSurfaceFallback } from './WaterSurfaceFallback.js';
/**
 * WaterSurfaceStandalone - A wrapper component that allows WaterSurfaceFallback
 * to be used outside of a React Three Fiber Canvas context
 * 
 * This component handles the animation loop for the water surface without
 * requiring R3F hooks like useFrame.
 */ export var WaterSurfaceStandalone = function(props) {
    var waterSurfaceRef = useRef();
    // Set up an animation loop using requestAnimationFrame instead of useFrame
    useEffect(function() {
        var animationFrameId;
        var startTime = Date.now();
        var updateWaterSurface = function() {
            if (waterSurfaceRef.current) {
                var elapsedTime = (Date.now() - startTime) / 1000; // Convert to seconds
                if (waterSurfaceRef.current.update) {
                    waterSurfaceRef.current.update(elapsedTime);
                }
            }
            animationFrameId = requestAnimationFrame(updateWaterSurface);
        };
        // Start the animation loop
        updateWaterSurface();
        // Clean up animation frame on unmount
        return function() {
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
        };
    }, []);
    // Pass all props to the WaterSurfaceFallback component
    return /*#__PURE__*/ _jsxDEV(WaterSurfaceFallback, _object_spread({
        ref: waterSurfaceRef
    }, props), void 0, false, {
        fileName: "WaterSurfaceStandalone.jsx",
        lineNumber: 42,
        columnNumber: 10
    }, _this);
};
