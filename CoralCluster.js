import { jsxDEV as _jsxDEV } from "react/jsx-dev-runtime";
import React, { useRef } from 'react'; // Removed useMemo
import * as THREE from 'three';
// Removed TANK_DIMENSIONS import as position is now external
// import { TANK_DIMENSIONS } from './utilsTankConstants.js';
/**
 * Represents a single coral formation at a given position.
 * For now, it's just a placeholder cube.
 * @param {object} props - Component props.
 * @param {THREE.Vector3} props.position - The world position for this coral cluster.
 */ export default function CoralCluster(param) {
    var _param_position = param.position, position = _param_position === void 0 ? new THREE.Vector3(0, 0, 0) : _param_position;
    var clusterRef = useRef();
    // Removed internal position calculation using useMemo
    return /*#__PURE__*/ _jsxDEV("group", {
        ref: clusterRef,
        name: "coral-cluster",
        position: position,
        children: /*#__PURE__*/ _jsxDEV("mesh", {
            scale: [
                0.5,
                0.5,
                0.5
            ],
            children: [
                /*#__PURE__*/ _jsxDEV("boxGeometry", {
                    args: [
                        1,
                        1,
                        1
                    ]
                }, void 0, false, {
                    fileName: "CoralCluster.js",
                    lineNumber: 18,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ _jsxDEV("meshStandardMaterial", {
                    color: "pink",
                    roughness: 0.7
                }, void 0, false, {
                    fileName: "CoralCluster.js",
                    lineNumber: 19,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "CoralCluster.js",
            lineNumber: 17,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "CoralCluster.js",
        lineNumber: 15,
        columnNumber: 5
    }, this);
}
