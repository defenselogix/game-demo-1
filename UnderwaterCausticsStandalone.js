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
import React, { useEffect, useRef, forwardRef } from 'react';
import * as THREE from 'three';
import { UnderwaterCaustics } from './UnderwaterCaustics.js';
/**
 * UnderwaterCausticsStandalone - A wrapper component that allows UnderwaterCaustics
 * to be used outside of a React Three Fiber Canvas context
 * 
 * This component handles the animation loop for the caustics effect without
 * requiring R3F hooks like useFrame.
 */ export var UnderwaterCausticsStandalone = /*#__PURE__*/ forwardRef(function(props, outerRef) {
    var causticsRef = useRef();
    // Connect the outer ref to our internal ref
    React.useImperativeHandle(outerRef, function() {
        return causticsRef.current;
    });
    // Set up an animation loop using requestAnimationFrame instead of useFrame
    useEffect(function() {
        var animationFrameId;
        var startTime = Date.now();
        var updateCaustics = function() {
            if (causticsRef.current) {
                var elapsedTime = (Date.now() - startTime) / 1000; // Convert to seconds
                causticsRef.current.update(elapsedTime);
            }
            animationFrameId = requestAnimationFrame(updateCaustics);
        };
        // Start the animation loop
        updateCaustics();
        // Clean up animation frame on unmount
        return function() {
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
        };
    }, []);
    // Pass all props to the UnderwaterCaustics component
    return /*#__PURE__*/ _jsxDEV(UnderwaterCaustics, _object_spread({
        ref: causticsRef
    }, props), void 0, false, {
        fileName: "UnderwaterCausticsStandalone.jsx",
        lineNumber: 42,
        columnNumber: 10
    }, _this);
});
