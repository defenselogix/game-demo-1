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
import { BubbleParticlesFallback } from './BubbleParticlesFallback.js';
/**
 * BubbleParticlesStandalone - A wrapper component that allows BubbleParticles
 * to be used outside of a React Three Fiber Canvas context
 * 
 * This component provides a simplified fallback for bubble particles that
 * works without requiring R3F hooks like useFrame.
 */ export var BubbleParticlesStandalone = /*#__PURE__*/ React.forwardRef(function(props, ref) {
    // Since we can't access the BubbleParticles component directly (it's hidden),
    // we'll use the fallback version which doesn't rely on R3F hooks
    // Forward any ref passed to this component
    var localRef = useRef();
    // Set up an animation loop using requestAnimationFrame
    useEffect(function() {
        var animationFrameId;
        var startTime = Date.now();
        var updateBubbles = function() {
            if (localRef.current) {
                var elapsedTime = (Date.now() - startTime) / 1000; // Convert to seconds
                // We can't directly update the fallback as it doesn't expose an update method
                // But we can rotate or animate the group if needed
                if (localRef.current.rotation) {
                    localRef.current.rotation.y = Math.sin(elapsedTime * 0.2) * 0.1;
                }
            }
            animationFrameId = requestAnimationFrame(updateBubbles);
        };
        // Start the animation loop
        updateBubbles();
        // Clean up animation frame on unmount
        return function() {
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
        };
    }, []);
    // Expose a simpler bubble pool interface for parent components
    React.useImperativeHandle(ref, function() {
        return {
            bubblePool: {
                // Simplified API that matches what parent components expect
                getActiveCount: function() {
                    return 3;
                },
                getPoolSize: function() {
                    return 10;
                },
                getEmissionRate: function() {
                    return 1 // Mock value
                    ;
                }
            }
        };
    });
    // Use the BubbleParticlesFallback component which doesn't use R3F hooks
    return /*#__PURE__*/ _jsxDEV(BubbleParticlesFallback, _object_spread({
        ref: localRef
    }, props), void 0, false, {
        fileName: "BubbleParticlesStandalone.jsx",
        lineNumber: 58,
        columnNumber: 10
    }, _this);
});
