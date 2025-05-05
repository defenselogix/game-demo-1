var _this = this;
import { jsxDEV as _jsxDEV } from "react/jsx-dev-runtime";
import React from 'react';
import useGameStore from './stateStore.js'; // Import the game store hook
export var UIOverlay = function() {
    // Use try/catch to prevent errors if stateStore is not available
    var score = 0;
    var gameTime = 0;
    try {
        score = useGameStore(function(state) {
            return state.score;
        }) || 0; // Get the current score with fallback
        gameTime = useGameStore(function(state) {
            return state.gameTime;
        }) || 0; // Get the game time with fallback
    } catch (error) {
        console.warn("Error accessing game store:", error);
    }
    // Format time (seconds) into MM:SS
    var formatTime = function(timeInSeconds) {
        var minutes = Math.floor(timeInSeconds / 60);
        var seconds = Math.floor(timeInSeconds % 60);
        return "".concat(String(minutes).padStart(2, '0'), ":").concat(String(seconds).padStart(2, '0'));
    };
    return /*#__PURE__*/ _jsxDEV("div", {
        style: {
            position: 'absolute',
            top: '10px',
            left: '10px',
            right: '10px',
            pointerEvents: 'none',
            color: 'white',
            fontSize: '24px',
            fontFamily: 'Arial, sans-serif',
            display: 'flex',
            justifyContent: 'space-between'
        },
        children: [
            /*#__PURE__*/ _jsxDEV("span", {
                children: [
                    "Score: ",
                    score
                ]
            }, void 0, true, {
                fileName: "componentsUIOverlay.jsx",
                lineNumber: 24,
                columnNumber: 7
            }, _this),
            /*#__PURE__*/ _jsxDEV("span", {
                children: [
                    "Time: ",
                    formatTime(gameTime)
                ]
            }, void 0, true, {
                fileName: "componentsUIOverlay.jsx",
                lineNumber: 25,
                columnNumber: 7
            }, _this)
        ]
    }, void 0, true, {
        fileName: "componentsUIOverlay.jsx",
        lineNumber: 23,
        columnNumber: 5
    }, _this);
};
