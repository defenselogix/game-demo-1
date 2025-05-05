import { jsxDEV as _jsxDEV } from "react/jsx-dev-runtime";
import React from 'react';
import ReactDOM from 'react-dom/client';
import FishTankApp from './FishTankApp.js'; // Import the new main app component
// Get the root element from the DOM
var rootElement = document.getElementById('renderDiv');
// Create a React root and render the RenderTestScene component
var root = ReactDOM.createRoot(rootElement);
root.render(/*#__PURE__*/ _jsxDEV(React.StrictMode, {
    children: /*#__PURE__*/ _jsxDEV(FishTankApp, {}, void 0, false, {
        fileName: "main.js",
        lineNumber: 11,
        columnNumber: 5
    }, this)
}, void 0, false, {
    fileName: "main.js",
    lineNumber: 10,
    columnNumber: 3
}, this));
// Log initialization for debugging
console.log('🚀 Renderer initialized with FishTankApp');
