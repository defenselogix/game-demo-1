import { jsxDEV as _jsxDEV } from "react/jsx-dev-runtime";
import React from 'react';
// import { Html } from '@react-three/drei'; // Temporarily remove
// import { UIOverlay } from './UIOverlay.js'; // Temporarily remove
import { AquariumCanvas } from './AquariumCanvas.js'; // Keep placeholder
// import { UIProvider } from './UIContext.js'; // Temporarily remove
// import { BubblePerformanceUI } from './BubblePerformanceUI.js'; // Temporarily remove
// import { ReefInfoOverlay } from './ReefInfoOverlay.js'; // Temporarily remove
export default function FishTankApp() {
    // Temporarily remove state and handlers depending on removed components
    // const [bubblePool, setBubblePool] = useState(null);
    // const handleBubblePoolReady = (pool) => {
    //   setBubblePool(pool);
    //   console.log('Bubble pool ready in FishTankApp:', pool);
    // };
    return(// <UIProvider> {/* Temporarily remove Context provider */}
    /*#__PURE__*/ _jsxDEV("div", {
        style: {
            position: 'relative',
            width: '100%',
            height: '100%',
            backgroundColor: '#1a2b4d'
        },
        children: [
            " ",
            /*#__PURE__*/ _jsxDEV(AquariumCanvas, {}, void 0, false, {
                fileName: "FishTankApp.jsx",
                lineNumber: 19,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "FishTankApp.jsx",
        lineNumber: 17,
        columnNumber: 7
    }, this));
}
