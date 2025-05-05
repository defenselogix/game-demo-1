import { jsxDEV as _jsxDEV } from "react/jsx-dev-runtime";
import React, { useEffect } from 'react'; // Import useEffect
import { useThree } from '@react-three/fiber'; // Import useThree
import FishTankEnvironment from './FishTankEnvironment.js'; // Ensure correct import path
import FishSchool from './FishSchool.js'; // Ensure correct import path
import CoralCluster from './CoralCluster.js'; // Ensure correct import path
// SeaweedField import removed - rendered within FishTankEnvironment
import { BubbleParticles } from './BubbleParticles.js'; // Use named import
// Using constants for dimensions
import { TANK_DIMENSIONS } from './utilsTankConstants.js';
var tankDims = {
    width: TANK_DIMENSIONS.innerWidth,
    height: TANK_DIMENSIONS.maxY - TANK_DIMENSIONS.minY,
    depth: TANK_DIMENSIONS.innerDepth
};
// Helper component to log scene children
function SceneDebugger() {
    var scene = useThree().scene; // Access the scene object
    useEffect(function() {
        // --- DEBUG: list every top‑level object so we can spot the stray meshes ---
        var timer = setTimeout(function() {
            console.table(scene.children.map(function(o) {
                var _o_geometry, _o_material;
                return {
                    name: o.name || 'Unnamed',
                    type: o.type,
                    geometry: ((_o_geometry = o.geometry) === null || _o_geometry === void 0 ? void 0 : _o_geometry.type) || 'N/A',
                    material: Array.isArray(o.material) ? o.material.map(function(m) {
                        return m === null || m === void 0 ? void 0 : m.type;
                    }).join(', ') || 'N/A' // Handle material arrays
                     : ((_o_material = o.material) === null || _o_material === void 0 ? void 0 : _o_material.type) || 'N/A'
                };
            }));
        }, 1500); // Increased delay slightly to ensure Rapier setup might complete
        return function() {
            return clearTimeout(timer);
        }; // Cleanup timer on unmount
    }, [
        scene
    ]); // Re-run if scene changes (unlikely but good practice)
    return null; // This component doesn't render anything visible
}
/**
 * NOTE: This component is rendered *inside* the root <Canvas> declared elsewhere.
 * Therefore it should return regular R3F primitives/groups, **not** another <Canvas>.
 */ export default function GameSceneCore() {
    return /*#__PURE__*/ _jsxDEV("group", {
        children: [
            /*#__PURE__*/ _jsxDEV(SceneDebugger, {}, void 0, false, {
                fileName: "GameSceneCore.js",
                lineNumber: 43,
                columnNumber: 7
            }, this),
            " ",
            /*#__PURE__*/ _jsxDEV(FishTankEnvironment, {
                seaweedClusters: 30,
                seaweedSpread: 0.6,
                children: [
                    /*#__PURE__*/ _jsxDEV(FishSchool, {
                        bounds: tankDims
                    }, void 0, false, {
                        fileName: "GameSceneCore.js",
                        lineNumber: 49,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ _jsxDEV(CoralCluster, {
                        bounds: tankDims
                    }, void 0, false, {
                        fileName: "GameSceneCore.js",
                        lineNumber: 51,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ _jsxDEV(BubbleParticles, {
                        count: 100,
                        tankBounds: TANK_DIMENSIONS
                    }, void 0, false, {
                        fileName: "GameSceneCore.js",
                        lineNumber: 52,
                        columnNumber: 9
                    }, this),
                    " "
                ]
            }, void 0, true, {
                fileName: "GameSceneCore.js",
                lineNumber: 47,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "GameSceneCore.js",
        lineNumber: 42,
        columnNumber: 5
    }, this);
}
