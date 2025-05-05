function _define_property(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function _object_spread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = arguments[i] != null ? arguments[i] : {};
        var ownKeys = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === "function") {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
        }
        ownKeys.forEach(function(key) {
            _define_property(target, key, source[key]);
        });
    }
    return target;
}
import { jsxDEV as _jsxDEV } from "react/jsx-dev-runtime";
import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import GameSceneCore from './GameSceneCore.js'; // master aquarium logic
export default function AquariumCanvas(props) {
    return /*#__PURE__*/ _jsxDEV(Canvas, {
        shadows: true,
        camera: {
            position: [
                0,
                5,
                12
            ],
            fov: 60
        },
        children: [
            /*#__PURE__*/ _jsxDEV(Suspense, {
                fallback: null,
                children: /*#__PURE__*/ _jsxDEV(GameSceneCore, _object_spread({}, props), void 0, false, {
                    fileName: "AquariumCanvasPS.jsx",
                    lineNumber: 11,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "AquariumCanvasPS.jsx",
                lineNumber: 10,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ _jsxDEV(OrbitControls, {
                makeDefault: true
            }, void 0, false, {
                fileName: "AquariumCanvasPS.jsx",
                lineNumber: 13,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "AquariumCanvasPS.jsx",
        lineNumber: 9,
        columnNumber: 5
    }, this);
}
