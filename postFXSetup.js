var _this = this;
import { jsxDEV as _jsxDEV } from "react/jsx-dev-runtime";
import React from 'react';
// Import additional effects
import { EffectComposer, Bloom, GodRays, Vignette, BrightnessContrast, ChromaticAberration } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing'; // Import BlendFunction for Vignette and ChromaticAberration
// Accept emitter prop
export var PostFXSetup = function(param) {
    var emitter = param.emitter;
    return /*#__PURE__*/ _jsxDEV(EffectComposer, {
        disableNormalPass: true,
        children: [
            emitter && /*#__PURE__*/ _jsxDEV(GodRays, {
                sun: emitter,
                exposure: 0.18,
                decay: 0.92,
                blur: false,
                samples: 30
            }, void 0, false, {
                fileName: "postFXSetup.js",
                lineNumber: 11,
                columnNumber: 9
            }, _this),
            /*#__PURE__*/ _jsxDEV(BrightnessContrast, {
                brightness: 0.0,
                contrast: 0.05
            }, void 0, false, {
                fileName: "postFXSetup.js",
                lineNumber: 28,
                columnNumber: 7
            }, _this)
        ]
    }, void 0, true, {
        fileName: "postFXSetup.js",
        lineNumber: 8,
        columnNumber: 5
    }, _this);
};
