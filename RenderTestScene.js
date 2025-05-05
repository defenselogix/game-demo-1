import { jsxDEV as _jsxDEV } from "react/jsx-dev-runtime";
import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
function RotatingCube() {
    var meshRef = useRef();
    useFrame(function(state, delta) {
        meshRef.current.rotation.x += delta * 0.5;
        meshRef.current.rotation.y += delta * 0.3;
    });
    return /*#__PURE__*/ _jsxDEV("mesh", {
        ref: meshRef,
        castShadow: true,
        receiveShadow: true,
        children: [
            /*#__PURE__*/ _jsxDEV("boxGeometry", {
                args: [
                    1,
                    1,
                    1
                ]
            }, void 0, false, {
                fileName: "RenderTestScene.jsx",
                lineNumber: 15,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ _jsxDEV("meshStandardMaterial", {
                color: "#FF8C00",
                roughness: 0.5,
                metalness: 0.2
            }, void 0, false, {
                fileName: "RenderTestScene.jsx",
                lineNumber: 16,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "RenderTestScene.jsx",
        lineNumber: 14,
        columnNumber: 5
    }, this);
}
export default function RenderTestScene() {
    return /*#__PURE__*/ _jsxDEV(Canvas, {
        shadows: true,
        camera: {
            position: [
                0,
                0,
                5
            ],
            fov: 45
        },
        children: [
            /*#__PURE__*/ _jsxDEV("color", {
                attach: "background",
                args: [
                    '#111827'
                ]
            }, void 0, false, {
                fileName: "RenderTestScene.jsx",
                lineNumber: 24,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ _jsxDEV("ambientLight", {
                intensity: 0.5
            }, void 0, false, {
                fileName: "RenderTestScene.jsx",
                lineNumber: 27,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ _jsxDEV("directionalLight", {
                position: [
                    5,
                    10,
                    5
                ],
                intensity: 1,
                castShadow: true,
                "shadow-mapSize": [
                    1024,
                    1024
                ]
            }, void 0, false, {
                fileName: "RenderTestScene.jsx",
                lineNumber: 28,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ _jsxDEV("mesh", {
                rotation: [
                    -Math.PI / 2,
                    0,
                    0
                ],
                position: [
                    0,
                    -1,
                    0
                ],
                receiveShadow: true,
                children: [
                    /*#__PURE__*/ _jsxDEV("planeGeometry", {
                        args: [
                            10,
                            10
                        ]
                    }, void 0, false, {
                        fileName: "RenderTestScene.jsx",
                        lineNumber: 37,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ _jsxDEV("meshStandardMaterial", {
                        color: "#2a3a4a",
                        roughness: 0.8
                    }, void 0, false, {
                        fileName: "RenderTestScene.jsx",
                        lineNumber: 38,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "RenderTestScene.jsx",
                lineNumber: 36,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ _jsxDEV(OrbitControls, {
                enableZoom: true,
                enablePan: true
            }, void 0, false, {
                fileName: "RenderTestScene.jsx",
                lineNumber: 45,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ _jsxDEV("mesh", {
                position: [
                    2,
                    2,
                    0
                ],
                children: [
                    /*#__PURE__*/ _jsxDEV("sphereGeometry", {
                        args: [
                            0.2,
                            16,
                            16
                        ]
                    }, void 0, false, {
                        fileName: "RenderTestScene.jsx",
                        lineNumber: 49,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ _jsxDEV("meshStandardMaterial", {
                        color: "#4ade80",
                        emissive: "#4ade80",
                        emissiveIntensity: 0.5
                    }, void 0, false, {
                        fileName: "RenderTestScene.jsx",
                        lineNumber: 50,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "RenderTestScene.jsx",
                lineNumber: 48,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "RenderTestScene.jsx",
        lineNumber: 23,
        columnNumber: 5
    }, this);
}
