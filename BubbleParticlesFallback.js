var _this = this;
import { jsxDEV as _jsxDEV } from "react/jsx-dev-runtime";
import React, { forwardRef } from 'react';
import { Sphere } from '@react-three/drei';
export var BubbleParticlesFallback = /*#__PURE__*/ forwardRef(function(param, ref) {
    var position = param.position;
    return /*#__PURE__*/ _jsxDEV("group", {
        ref: ref,
        position: position || [
            0,
            0,
            0
        ],
        children: [
            /*#__PURE__*/ _jsxDEV(Sphere, {
                args: [
                    0.1,
                    8,
                    8
                ],
                position: [
                    0.3,
                    0.5,
                    0
                ],
                children: /*#__PURE__*/ _jsxDEV("meshBasicMaterial", {
                    color: "#88ccff",
                    transparent: true,
                    opacity: 0.6
                }, void 0, false, {
                    fileName: "BubbleParticlesFallback.jsx",
                    lineNumber: 8,
                    columnNumber: 9
                }, _this)
            }, void 0, false, {
                fileName: "BubbleParticlesFallback.jsx",
                lineNumber: 7,
                columnNumber: 7
            }, _this),
            /*#__PURE__*/ _jsxDEV(Sphere, {
                args: [
                    0.15,
                    8,
                    8
                ],
                position: [
                    -0.2,
                    0.8,
                    0.1
                ],
                children: /*#__PURE__*/ _jsxDEV("meshBasicMaterial", {
                    color: "#88ccff",
                    transparent: true,
                    opacity: 0.5
                }, void 0, false, {
                    fileName: "BubbleParticlesFallback.jsx",
                    lineNumber: 11,
                    columnNumber: 9
                }, _this)
            }, void 0, false, {
                fileName: "BubbleParticlesFallback.jsx",
                lineNumber: 10,
                columnNumber: 7
            }, _this),
            /*#__PURE__*/ _jsxDEV(Sphere, {
                args: [
                    0.08,
                    8,
                    8
                ],
                position: [
                    0.1,
                    1.2,
                    -0.1
                ],
                children: /*#__PURE__*/ _jsxDEV("meshBasicMaterial", {
                    color: "#88ccff",
                    transparent: true,
                    opacity: 0.4
                }, void 0, false, {
                    fileName: "BubbleParticlesFallback.jsx",
                    lineNumber: 14,
                    columnNumber: 9
                }, _this)
            }, void 0, false, {
                fileName: "BubbleParticlesFallback.jsx",
                lineNumber: 13,
                columnNumber: 7
            }, _this)
        ]
    }, void 0, true, {
        fileName: "BubbleParticlesFallback.jsx",
        lineNumber: 5,
        columnNumber: 5
    }, _this);
});
