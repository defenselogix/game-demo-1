// GameScene.jsx — lean scene-manager wrapper (now exports BOTH default and named)
import { jsxDEV as _jsxDEV, Fragment as _Fragment } from "react/jsx-dev-runtime";
import React, { useEffect, useRef } from 'react'; // Import useRef
import { useThree, useFrame } from '@react-three/fiber'; // Import useThree and useFrame
import * as THREE from 'three'; // Import THREE for Vector3
import { OrbitControls } from '@react-three/drei';
import GameSceneCore from './GameSceneCore.js';
// Removed unused spawnSeaweedCluster import
// KelpStrand import removed
export function GameScene(param) {
    var onLoaded = param.onLoaded;
    var scene = useThree().scene; // Get the scene object
    var seaweedMaterialRef = useRef(); // Ref to store the shared material (though it's now handled in SeaweedField)
    // Spawn seaweed cluster on mount
    // Removed useEffect block that manually called spawnSeaweedCluster
    // Seaweed is now handled by SeaweedField within GameSceneCore
    // Removed useFrame block that updated shader time - this is now handled within SeaweedField
    return /*#__PURE__*/ _jsxDEV(_Fragment, {
        children: [
            /*#__PURE__*/ _jsxDEV("ambientLight", {
                intensity: 0.6
            }, void 0, false, {
                fileName: "GameScene.jsx",
                lineNumber: 18,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ _jsxDEV(GameSceneCore, {}, void 0, false, {
                fileName: "GameScene.jsx",
                lineNumber: 19,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ _jsxDEV(OrbitControls, {
                enablePan: false,
                maxDistance: 50
            }, void 0, false, {
                fileName: "GameScene.jsx",
                lineNumber: 22,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
export default GameScene; // ← default export
