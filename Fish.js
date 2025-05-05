import { jsxDEV as _jsxDEV } from "react/jsx-dev-runtime";
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
var FISH_COLOR = '#ff69b4'; // Keep the distinct color
/**
 * A simple Fish component with a more elongated shape.
 * @param {Object} props - Component props.
 * @param {THREE.Vector3 | [number, number, number]} props.position - Initial position.
 * @param {number} [props.scale=0.2] - Overall scale of the fish model.
 */ export default function Fish(param) {
    var _param_position = param.position, position = _param_position === void 0 ? [
        0,
        0,
        0
    ] : _param_position, _param_scale = param.scale, scale = _param_scale === void 0 ? 0.2 : _param_scale;
    var meshRef = useRef();
    // Basic animation placeholder (gentle bobbing)
    useFrame(function(state, delta) {
        if (meshRef.current) {
            meshRef.current.position.y += Math.sin(state.clock.elapsedTime * 2) * delta * 0.2;
            // Optional: add slight rotation wobble
            meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 1.5) * 0.1;
        }
    });
    return /*#__PURE__*/ _jsxDEV("mesh", {
        ref: meshRef,
        position: position,
        scale: scale,
        castShadow: true,
        receiveShadow: true,
        children: /*#__PURE__*/ _jsxDEV("mesh", {
            scale: [
                1.8,
                1,
                1
            ],
            rotation: [
                0,
                Math.PI / 2,
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
                    fileName: "Fish.jsx",
                    lineNumber: 30,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ _jsxDEV("meshStandardMaterial", {
                    color: FISH_COLOR,
                    roughness: 0.4,
                    metalness: 0.1
                }, void 0, false, {
                    fileName: "Fish.jsx",
                    lineNumber: 31,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "Fish.jsx",
            lineNumber: 29,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "Fish.jsx",
        lineNumber: 26,
        columnNumber: 5
    }, this);
}
