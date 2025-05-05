var _this = this;
import { jsxDEV as _jsxDEV } from "react/jsx-dev-runtime";
import React from 'react';
import { useUI } from './UIContext.js';
export var ControlsOverlay = function() {
    var _useUI = useUI(), showWaterSurface = _useUI.showWaterSurface, toggleWaterSurface = _useUI.toggleWaterSurface, causticsIntensity = _useUI.causticsIntensity, setCausticsIntensity = _useUI.setCausticsIntensity, showPerformanceStats = _useUI.showPerformanceStats, togglePerformanceStats = _useUI.togglePerformanceStats;
    return /*#__PURE__*/ _jsxDEV("div", {
        style: {
            position: 'absolute',
            bottom: '20px',
            right: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            zIndex: 1000
        },
        children: /*#__PURE__*/ _jsxDEV("div", {
            style: {
                background: 'rgba(0,30,60,0.7)',
                borderRadius: '8px',
                padding: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                backdropFilter: 'blur(4px)',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
            },
            children: [
                /*#__PURE__*/ _jsxDEV("div", {
                    style: {
                        color: 'white',
                        fontSize: '14px',
                        userSelect: 'none',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '5px',
                        pointerEvents: 'auto'
                    },
                    children: [
                        /*#__PURE__*/ _jsxDEV("div", {
                            style: {
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            },
                            children: [
                                /*#__PURE__*/ _jsxDEV("span", {
                                    children: "Caustics Intensity"
                                }, void 0, false, {
                                    fileName: "ControlsOverlay.jsx",
                                    lineNumber: 46,
                                    columnNumber: 13
                                }, _this),
                                /*#__PURE__*/ _jsxDEV("span", {
                                    children: [
                                        Math.round(causticsIntensity * 100),
                                        "%"
                                    ]
                                }, void 0, true, {
                                    fileName: "ControlsOverlay.jsx",
                                    lineNumber: 47,
                                    columnNumber: 13
                                }, _this)
                            ]
                        }, void 0, true, {
                            fileName: "ControlsOverlay.jsx",
                            lineNumber: 45,
                            columnNumber: 11
                        }, _this),
                        /*#__PURE__*/ _jsxDEV("input", {
                            type: "range",
                            min: "0",
                            max: "1",
                            step: "0.05",
                            value: causticsIntensity,
                            onChange: function(e) {
                                return setCausticsIntensity(parseFloat(e.target.value));
                            },
                            style: {
                                width: '100%',
                                minWidth: '180px'
                            }
                        }, void 0, false, {
                            fileName: "ControlsOverlay.jsx",
                            lineNumber: 49,
                            columnNumber: 11
                        }, _this)
                    ]
                }, void 0, true, {
                    fileName: "ControlsOverlay.jsx",
                    lineNumber: 36,
                    columnNumber: 9
                }, _this),
                /*#__PURE__*/ _jsxDEV("button", {
                    onClick: toggleWaterSurface,
                    style: {
                        background: 'rgba(25,55,85,0.8)',
                        color: 'white',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '14px',
                        transition: 'background 0.2s',
                        pointerEvents: 'auto',
                        fontWeight: 'bold',
                        textAlign: 'center',
                        width: '100%'
                    },
                    onMouseOver: function(e) {
                        return e.currentTarget.style.background = 'rgba(35,65,95,0.9)';
                    },
                    onMouseOut: function(e) {
                        return e.currentTarget.style.background = 'rgba(25,55,85,0.8)';
                    },
                    children: showWaterSurface ? 'Hide Water Surface' : 'Show Water Surface'
                }, void 0, false, {
                    fileName: "ControlsOverlay.jsx",
                    lineNumber: 61,
                    columnNumber: 9
                }, _this),
                /*#__PURE__*/ _jsxDEV("button", {
                    onClick: togglePerformanceStats,
                    style: {
                        background: 'rgba(25,55,85,0.8)',
                        color: 'white',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '14px',
                        transition: 'background 0.2s',
                        pointerEvents: 'auto',
                        fontWeight: 'bold',
                        textAlign: 'center',
                        width: '100%'
                    },
                    onMouseOver: function(e) {
                        return e.currentTarget.style.background = 'rgba(35,65,95,0.9)';
                    },
                    onMouseOut: function(e) {
                        return e.currentTarget.style.background = 'rgba(25,55,85,0.8)';
                    },
                    children: showPerformanceStats ? 'Hide Performance Stats' : 'Show Performance Stats'
                }, void 0, false, {
                    fileName: "ControlsOverlay.jsx",
                    lineNumber: 84,
                    columnNumber: 9
                }, _this)
            ]
        }, void 0, true, {
            fileName: "ControlsOverlay.jsx",
            lineNumber: 25,
            columnNumber: 7
        }, _this)
    }, void 0, false, {
        fileName: "ControlsOverlay.jsx",
        lineNumber: 15,
        columnNumber: 5
    }, _this);
};
