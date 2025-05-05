var _this = this;
import { jsxDEV as _jsxDEV, Fragment as _Fragment } from "react/jsx-dev-runtime";
import React, { useEffect } from 'react';
import * as THREE from 'three';
import { useThree } from '@react-three/fiber';
import { Dodecahedron } from '@react-three/drei';
var ROCK_COLOR = '#606060';
var ROCK_ROUGHNESS = 0.9;
var ROCK_METALNESS = 0.1;
var FOG_COLOR = '#304555'; // Change to a muted blue-grey for underwater haze
var FOG_NEAR = 10;
var FOG_FAR = 40; // Increase distance for less intense fog close up
/**
 * Environment Component
 * Adds fog and static rock meshes to the scene.
 */ export var Environment = function() {
    var scene = useThree().scene;
    // Add fog to the scene on mount
    useEffect(function() {
        scene.fog = new THREE.Fog(FOG_COLOR, FOG_NEAR, FOG_FAR);
        // Cleanup fog on unmount
        return function() {
            scene.fog = null;
        };
    }, [
        scene
    ]); // Re-run if scene changes (shouldn't typically happen)
    return /*#__PURE__*/ _jsxDEV(_Fragment, {
        children: [
            /*#__PURE__*/ _jsxDEV(Dodecahedron, {
                args: [
                    0.5
                ],
                position: [
                    -4,
                    0.25,
                    -5
                ],
                rotation: [
                    0.1,
                    0.5,
                    0.2
                ],
                castShadow: true,
                receiveShadow: true,
                children: /*#__PURE__*/ _jsxDEV("meshStandardMaterial", {
                    color: ROCK_COLOR,
                    roughness: ROCK_ROUGHNESS,
                    metalness: ROCK_METALNESS
                }, void 0, false, {
                    fileName: "Environment.jsx",
                    lineNumber: 30,
                    columnNumber: 9
                }, _this)
            }, void 0, false, {
                fileName: "Environment.jsx",
                lineNumber: 29,
                columnNumber: 7
            }, _this),
            /*#__PURE__*/ _jsxDEV(Dodecahedron, {
                args: [
                    0.8
                ],
                position: [
                    5,
                    0.4,
                    -6
                ],
                rotation: [
                    -0.2,
                    -0.3,
                    0.4
                ],
                castShadow: true,
                receiveShadow: true,
                children: /*#__PURE__*/ _jsxDEV("meshStandardMaterial", {
                    color: ROCK_COLOR,
                    roughness: ROCK_ROUGHNESS,
                    metalness: ROCK_METALNESS
                }, void 0, false, {
                    fileName: "Environment.jsx",
                    lineNumber: 38,
                    columnNumber: 10
                }, _this)
            }, void 0, false, {
                fileName: "Environment.jsx",
                lineNumber: 37,
                columnNumber: 7
            }, _this),
            /*#__PURE__*/ _jsxDEV(Dodecahedron, {
                args: [
                    0.4
                ],
                position: [
                    -3,
                    0.2,
                    2
                ],
                rotation: [
                    0.5,
                    0.1,
                    -0.1
                ],
                castShadow: true,
                receiveShadow: true,
                children: /*#__PURE__*/ _jsxDEV("meshStandardMaterial", {
                    color: ROCK_COLOR,
                    roughness: ROCK_ROUGHNESS,
                    metalness: ROCK_METALNESS
                }, void 0, false, {
                    fileName: "Environment.jsx",
                    lineNumber: 46,
                    columnNumber: 10
                }, _this)
            }, void 0, false, {
                fileName: "Environment.jsx",
                lineNumber: 45,
                columnNumber: 7
            }, _this),
            /*#__PURE__*/ _jsxDEV(Dodecahedron, {
                args: [
                    0.3
                ],
                position: [
                    -3.5,
                    0.15,
                    1.8
                ],
                rotation: [
                    -0.1,
                    0.8,
                    0.1
                ],
                castShadow: true,
                receiveShadow: true,
                children: /*#__PURE__*/ _jsxDEV("meshStandardMaterial", {
                    color: ROCK_COLOR,
                    roughness: ROCK_ROUGHNESS,
                    metalness: ROCK_METALNESS
                }, void 0, false, {
                    fileName: "Environment.jsx",
                    lineNumber: 53,
                    columnNumber: 10
                }, _this)
            }, void 0, false, {
                fileName: "Environment.jsx",
                lineNumber: 52,
                columnNumber: 8
            }, _this)
        ]
    }, void 0, true);
};
