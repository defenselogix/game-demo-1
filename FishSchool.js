import { jsxDEV as _jsxDEV } from "react/jsx-dev-runtime";
import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
/**
 * Represents a school of fish within the tank.
 * For now, it's just a single placeholder sphere.
 * @param {object} props - Component props.
 * @param {object} props.bounds - The inner dimensions {width, height, depth} of the tank.
 */ export default function FishSchool(param) {
    var bounds = param.bounds;
    var groupRef = useRef();
    var fishRef = useRef();
    // Simple animation for the placeholder fish
    useFrame(function(state, delta) {
        if (fishRef.current) {
            // Basic back and forth movement
            fishRef.current.position.x = Math.sin(state.clock.elapsedTime * 0.5) * (bounds.width / 3);
            fishRef.current.position.z = Math.cos(state.clock.elapsedTime * 0.3) * (bounds.depth / 3);
        }
    });
    // Calculate a starting Y position within the bounds
    var startY = bounds.height / 2 - bounds.height * 0.2; // Slightly above center
    return /*#__PURE__*/ _jsxDEV("group", {
        ref: groupRef,
        name: "fish-school",
        children: /*#__PURE__*/ _jsxDEV("mesh", {
            ref: fishRef,
            position: [
                0,
                startY,
                0
            ],
            scale: 0.1,
            children: [
                /*#__PURE__*/ _jsxDEV("sphereGeometry", {
                    args: [
                        1,
                        16,
                        16
                    ]
                }, void 0, false, {
                    fileName: "FishSchool.js",
                    lineNumber: 31,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ _jsxDEV("meshStandardMaterial", {
                    color: "blue"
                }, void 0, false, {
                    fileName: "FishSchool.js",
                    lineNumber: 32,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "FishSchool.js",
            lineNumber: 30,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "FishSchool.js",
        lineNumber: 28,
        columnNumber: 5
    }, this);
}
