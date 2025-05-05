import { jsxDEV as _jsxDEV } from "react/jsx-dev-runtime";
import React, { Suspense, useEffect, useRef } from 'react'; // Import Suspense, useEffect, useRef
import { Canvas, useThree } from '@react-three/fiber'; // Import useThree
import { OrbitControls } from '@react-three/drei'; // Add OrbitControls import
import { Html } from '@react-three/drei';
import { Physics } from '@react-three/rapier'; // Import Physics
import { PhysicsClusterIntegration } from './PhysicsClusterIntegration.js';
// import { initCameraControls } from 'cameraControls'; // Temporarily comment out due to import issues
import GameSceneCore from './GameSceneCore.js';
// import { ErrorBoundary } from './ErrorBoundary.js'; // Remove ErrorBoundary import
// Removed WaterSurface import
// Import tankSize for shadow camera setup
import { TANK_DIMENSIONS } from './utilsTankConstants.js';
var tankSize = {
    width: TANK_DIMENSIONS.width,
    depth: TANK_DIMENSIONS.depth
};
// Internal component to handle controls initialization (Temporarily commented out)
// const ControlsInitializer = () => {
//   const { camera, gl, scene } = useThree(); // Get camera, renderer, and scene
//   useEffect(() => {
//     // Initialize controls
//     // const { dispose } = initCameraControls(camera, gl, scene); // Commented out call
//     // Cleanup on unmount
//     // return () => dispose(); // Commented out cleanup
//   }, [camera, gl, scene]); // Re-run if camera, gl, or scene changes
//   return null; // This component doesn't render anything itself
// };
export function AquariumCanvas(param) {
    var showPhysicsDemo = param.showPhysicsDemo, physicsEnabled = param.physicsEnabled;
    return(// Keep the existing Canvas setup
    // Add gl prop to enable local clipping
    /*#__PURE__*/ _jsxDEV(Canvas, {
        shadows: true,
        camera: {
            position: [
                0,
                10,
                15
            ],
            fov: 60
        },
        gl: {
            localClippingEnabled: true
        },
        children: [
            /*#__PURE__*/ _jsxDEV("color", {
                attach: "background",
                args: [
                    '#050520'
                ]
            }, void 0, false, {
                fileName: "AquariumCanvas.jsx",
                lineNumber: 35,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ _jsxDEV(Suspense, {
                fallback: null,
                children: /*#__PURE__*/ _jsxDEV(Physics, {
                    children: [
                        /*#__PURE__*/ _jsxDEV(GameSceneCore, {}, void 0, false, {
                            fileName: "AquariumCanvas.jsx",
                            lineNumber: 40,
                            columnNumber: 11
                        }, this),
                        showPhysicsDemo && /*#__PURE__*/ _jsxDEV(PhysicsClusterIntegration, {
                            enabled: physicsEnabled
                        }, void 0, false, {
                            fileName: "AquariumCanvas.jsx",
                            lineNumber: 44,
                            columnNumber: 31
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "AquariumCanvas.jsx",
                    lineNumber: 38,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "AquariumCanvas.jsx",
                lineNumber: 37,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ _jsxDEV("ambientLight", {
                intensity: 0.4,
                color: "#6495ED"
            }, void 0, false, {
                fileName: "AquariumCanvas.jsx",
                lineNumber: 49,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ _jsxDEV("directionalLight", {
                position: [
                    10,
                    20,
                    5
                ],
                intensity: 1.5,
                color: "#FFFFE0" // Warm light color (like sunlight)
                ,
                castShadow: true,
                "shadow-mapSize": [
                    1024,
                    1024
                ],
                "shadow-camera-near": 0.5,
                "shadow-camera-far": 50,
                "shadow-camera-left": -tankSize.width / 1.5,
                "shadow-camera-right": tankSize.width / 1.5,
                "shadow-camera-top": tankSize.depth / 1.5,
                "shadow-camera-bottom": -tankSize.depth / 1.5
            }, void 0, false, {
                fileName: "AquariumCanvas.jsx",
                lineNumber: 51,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ _jsxDEV("fogExp2", {
                attach: "fog",
                args: [
                    '#103366',
                    0.04
                ]
            }, void 0, false, {
                fileName: "AquariumCanvas.jsx",
                lineNumber: 64,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ _jsxDEV(OrbitControls, {}, void 0, false, {
                fileName: "AquariumCanvas.jsx",
                lineNumber: 66,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "AquariumCanvas.jsx",
        lineNumber: 29,
        columnNumber: 5
    }, this));
}
