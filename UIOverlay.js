var _this = this;
import { jsxDEV as _jsxDEV } from "react/jsx-dev-runtime";
import React from 'react';
import { useUI } from './UIContext.js';
import { ControlsOverlay } from './ControlsOverlay.js';
import useGameStore from './stateStore.js';
export var UIOverlay = function(param) {
    var showPhysicsDemo = param.showPhysicsDemo, physicsEnabled = param.physicsEnabled, onTogglePhysicsDemo = param.onTogglePhysicsDemo, onTogglePhysicsEnabled = param.onTogglePhysicsEnabled;
    var score = useGameStore(function(state) {
        return state.score;
    });
    var gameTime = useGameStore(function(state) {
        return state.gameTime;
    });
    // Format time (seconds) into MM:SS
    var formatTime = function(timeInSeconds) {
        var minutes = Math.floor(timeInSeconds / 60);
        var seconds = Math.floor(timeInSeconds % 60);
        return "".concat(String(minutes).padStart(2, '0'), ":").concat(String(seconds).padStart(2, '0'));
    };
    return /*#__PURE__*/ _jsxDEV("div", {
        className: "ui-container",
        style: {
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none'
        },
        children: [
            /*#__PURE__*/ _jsxDEV("div", {
                style: {
                    position: 'absolute',
                    top: '10px',
                    left: '10px',
                    right: '10px',
                    color: 'white',
                    fontSize: '24px',
                    fontFamily: 'Arial, sans-serif',
                    display: 'flex',
                    justifyContent: 'space-between',
                    textShadow: '0 2px 4px rgba(0,0,0,0.5)'
                },
                children: [
                    /*#__PURE__*/ _jsxDEV("span", {
                        children: [
                            "Score: ",
                            score
                        ]
                    }, void 0, true, {
                        fileName: "UIOverlay.jsx",
                        lineNumber: 32,
                        columnNumber: 9
                    }, _this),
                    /*#__PURE__*/ _jsxDEV("span", {
                        children: [
                            "Time: ",
                            formatTime(gameTime)
                        ]
                    }, void 0, true, {
                        fileName: "UIOverlay.jsx",
                        lineNumber: 33,
                        columnNumber: 9
                    }, _this)
                ]
            }, void 0, true, {
                fileName: "UIOverlay.jsx",
                lineNumber: 20,
                columnNumber: 7
            }, _this),
            /*#__PURE__*/ _jsxDEV(ControlsOverlay, {}, void 0, false, {
                fileName: "UIOverlay.jsx",
                lineNumber: 37,
                columnNumber: 7
            }, _this),
            process.env.NODE_ENV === 'development' && /*#__PURE__*/ _jsxDEV("div", {
                style: {
                    position: 'absolute',
                    top: '20px',
                    right: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                    pointerEvents: 'auto'
                },
                children: [
                    /*#__PURE__*/ _jsxDEV("button", {
                        onClick: onTogglePhysicsDemo,
                        style: {
                            background: 'rgba(0,30,60,0.7)',
                            color: 'white',
                            padding: '8px 12px',
                            borderRadius: '6px',
                            border: 'none',
                            cursor: 'pointer'
                        },
                        children: showPhysicsDemo ? 'Hide Physics Demo' : 'Show Physics Demo'
                    }, void 0, false, {
                        fileName: "UIOverlay.jsx",
                        lineNumber: 50,
                        columnNumber: 11
                    }, _this),
                    /*#__PURE__*/ _jsxDEV("button", {
                        onClick: onTogglePhysicsEnabled,
                        style: {
                            background: 'rgba(0,30,60,0.7)',
                            color: 'white',
                            padding: '8px 12px',
                            borderRadius: '6px',
                            border: 'none',
                            cursor: 'pointer'
                        },
                        children: physicsEnabled ? 'Disable Physics' : 'Enable Physics'
                    }, void 0, false, {
                        fileName: "UIOverlay.jsx",
                        lineNumber: 63,
                        columnNumber: 11
                    }, _this)
                ]
            }, void 0, true, {
                fileName: "UIOverlay.jsx",
                lineNumber: 41,
                columnNumber: 9
            }, _this)
        ]
    }, void 0, true, {
        fileName: "UIOverlay.jsx",
        lineNumber: 18,
        columnNumber: 5
    }, _this);
};
