import { jsxDEV as _jsxDEV } from "react/jsx-dev-runtime";
import React from 'react';
import { Html } from '@react-three/drei';
export function FallbackErrorUI(param) {
    var error = param.error, errorInfo = param.errorInfo, onReset = param.onReset;
    var containerStyle = {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(10, 20, 30, 0.9)',
        color: 'white',
        fontFamily: 'Arial, sans-serif',
        zIndex: 1000,
        padding: '2rem'
    };
    var headingStyle = {
        color: '#ff5555',
        marginBottom: '1rem'
    };
    var messageStyle = {
        marginBottom: '1rem',
        maxWidth: '600px',
        lineHeight: '1.5'
    };
    var buttonStyle = {
        padding: '0.5rem 1rem',
        backgroundColor: '#4a90e2',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '1rem',
        marginTop: '1rem'
    };
    var errorBoxStyle = {
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        padding: '1rem',
        borderRadius: '4px',
        maxWidth: '90%',
        maxHeight: '40vh',
        overflow: 'auto',
        fontFamily: 'monospace',
        fontSize: '0.9rem',
        whiteSpace: 'pre-wrap',
        margin: '1rem 0'
    };
    // Using Html from drei to properly render HTML content within R3F
    return /*#__PURE__*/ _jsxDEV(Html, {
        fullscreen: true,
        children: /*#__PURE__*/ _jsxDEV("div", {
            style: containerStyle,
            children: [
                /*#__PURE__*/ _jsxDEV("h2", {
                    style: headingStyle,
                    children: "Something went wrong!"
                }, void 0, false, {
                    fileName: "FallbackErrorUI.jsx",
                    lineNumber: 61,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ _jsxDEV("p", {
                    style: messageStyle,
                    children: "The application encountered an error. This could be due to a temporary issue or a bug in the system."
                }, void 0, false, {
                    fileName: "FallbackErrorUI.jsx",
                    lineNumber: 62,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ _jsxDEV("div", {
                    style: errorBoxStyle,
                    children: [
                        /*#__PURE__*/ _jsxDEV("strong", {
                            children: "Error:"
                        }, void 0, false, {
                            fileName: "FallbackErrorUI.jsx",
                            lineNumber: 67,
                            columnNumber: 11
                        }, this),
                        " ",
                        error === null || error === void 0 ? void 0 : error.toString(),
                        errorInfo && /*#__PURE__*/ _jsxDEV("div", {
                            style: {
                                marginTop: '1rem'
                            },
                            children: [
                                /*#__PURE__*/ _jsxDEV("strong", {
                                    children: "Component Stack:"
                                }, void 0, false, {
                                    fileName: "FallbackErrorUI.jsx",
                                    lineNumber: 70,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ _jsxDEV("div", {
                                    children: errorInfo.componentStack
                                }, void 0, false, {
                                    fileName: "FallbackErrorUI.jsx",
                                    lineNumber: 71,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "FallbackErrorUI.jsx",
                            lineNumber: 69,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "FallbackErrorUI.jsx",
                    lineNumber: 66,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ _jsxDEV("button", {
                    style: buttonStyle,
                    onClick: onReset,
                    children: "Try Again"
                }, void 0, false, {
                    fileName: "FallbackErrorUI.jsx",
                    lineNumber: 76,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "FallbackErrorUI.jsx",
            lineNumber: 60,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "FallbackErrorUI.jsx",
        lineNumber: 59,
        columnNumber: 5
    }, this);
}
