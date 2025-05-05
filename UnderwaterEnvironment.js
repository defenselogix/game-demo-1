import { jsxDEV as _jsxDEV, Fragment as _Fragment } from "react/jsx-dev-runtime";
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber'; // Keep useFrame as it might be needed later
import * as THREE from 'three';
import WaterSurface from './WaterSurface.js'; // Restore WaterSurface import
import { TankGroup } from './envMeshes.js'; // Restore TankGroup import
// PlantLife import removed - rendered via GameSceneCore
// import CoralCluster from './CoralCluster.js'; // Remove single cluster import
import CoralField from './CoralField.js'; // Import the CoralField component
import { TANK_DIMENSIONS } from './utilsTankConstants.js'; // Keep tank dimensions import
// UnderwaterFog component removed to isolate error
// CausticsEffect removed
// BubbleEmitter component removed to isolate error
// Full underwater environment
export default function UnderwaterEnvironment() {
    return /*#__PURE__*/ _jsxDEV(_Fragment, {
        children: [
            /*#__PURE__*/ _jsxDEV("ambientLight", {
                intensity: 0.3,
                color: "#0a3b5a"
            }, void 0, false, {
                fileName: "UnderwaterEnvironment.jsx",
                lineNumber: 22,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ _jsxDEV("directionalLight", {
                position: [
                    -2,
                    8,
                    -2
                ],
                intensity: 1.2,
                color: "#89d7ff",
                castShadow: true,
                "shadow-mapSize-width": 1024,
                "shadow-mapSize-height": 1024,
                "shadow-camera-far": 50,
                "shadow-camera-left": -10,
                "shadow-camera-right": 10,
                "shadow-camera-top": 10,
                "shadow-camera-bottom": -10
            }, void 0, false, {
                fileName: "UnderwaterEnvironment.jsx",
                lineNumber: 23,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ _jsxDEV(CoralField, {}, void 0, false, {
                fileName: "UnderwaterEnvironment.jsx",
                lineNumber: 38,
                columnNumber: 7
            }, this),
            " "
        ]
    }, void 0, true);
}
