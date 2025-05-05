import { jsxDEV as _jsxDEV } from "react/jsx-dev-runtime";
import React from 'react';
import { PerformanceMonitor } from './PerformanceMonitor.js';
// This component is rendered outside of the Three.js canvas
// to safely display the performance monitor
export function BubblePerformanceDisplay(param) {
    var bubblePool = param.bubblePool;
    return /*#__PURE__*/ _jsxDEV(PerformanceMonitor, {
        enabled: true,
        bubblePool: bubblePool,
        position: "top-right",
        showDetailed: true
    }, void 0, false, {
        fileName: "BubblePerformanceDisplay.jsx",
        lineNumber: 8,
        columnNumber: 5
    }, this);
}
