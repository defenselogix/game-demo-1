import { jsxDEV as _jsxDEV, Fragment as _Fragment } from "react/jsx-dev-runtime";
import React, { useEffect } from 'react';
import { OrbitControls } from '@react-three/drei';
export function DiagnosticScene(param) {
    var onLoaded = param.onLoaded;
    useEffect(function() {
        console.log('DiagnosticScene mounted');
        onLoaded === null || onLoaded === void 0 ? void 0 : onLoaded();
        return function() {
            return console.log('DiagnosticScene unmounted');
        };
    }, [
        onLoaded
    ]);
    return /*#__PURE__*/ _jsxDEV(_Fragment, {
        children: [
            /*#__PURE__*/ _jsxDEV("ambientLight", {
                intensity: 0.6
            }, void 0, false, {
                fileName: "DiagnosticScene.jsx",
                lineNumber: 13,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ _jsxDEV("directionalLight", {
                position: [
                    5,
                    5,
                    5
                ],
                intensity: 0.8
            }, void 0, false, {
                fileName: "DiagnosticScene.jsx",
                lineNumber: 14,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ _jsxDEV("mesh", {
                position: [
                    0,
                    0,
                    0
                ],
                children: [
                    /*#__PURE__*/ _jsxDEV("boxGeometry", {
                        args: [
                            1,
                            1,
                            1
                        ]
                    }, void 0, false, {
                        fileName: "DiagnosticScene.jsx",
                        lineNumber: 18,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ _jsxDEV("meshStandardMaterial", {
                        color: "royalblue"
                    }, void 0, false, {
                        fileName: "DiagnosticScene.jsx",
                        lineNumber: 19,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "DiagnosticScene.jsx",
                lineNumber: 17,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ _jsxDEV("mesh", {
                position: [
                    2,
                    0,
                    0
                ],
                children: [
                    /*#__PURE__*/ _jsxDEV("sphereGeometry", {
                        args: [
                            0.5,
                            32,
                            32
                        ]
                    }, void 0, false, {
                        fileName: "DiagnosticScene.jsx",
                        lineNumber: 23,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ _jsxDEV("meshStandardMaterial", {
                        color: "tomato"
                    }, void 0, false, {
                        fileName: "DiagnosticScene.jsx",
                        lineNumber: 24,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "DiagnosticScene.jsx",
                lineNumber: 22,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ _jsxDEV(OrbitControls, {
                enablePan: false
            }, void 0, false, {
                fileName: "DiagnosticScene.jsx",
                lineNumber: 27,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
export default DiagnosticScene;
