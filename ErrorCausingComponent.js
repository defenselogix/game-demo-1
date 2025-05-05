function _array_like_to_array(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}
function _array_with_holes(arr) {
    if (Array.isArray(arr)) return arr;
}
function _iterable_to_array_limit(arr, i) {
    var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];
    if (_i == null) return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _s, _e;
    try {
        for(_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true){
            _arr.push(_s.value);
            if (i && _arr.length === i) break;
        }
    } catch (err) {
        _d = true;
        _e = err;
    } finally{
        try {
            if (!_n && _i["return"] != null) _i["return"]();
        } finally{
            if (_d) throw _e;
        }
    }
    return _arr;
}
function _non_iterable_rest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _sliced_to_array(arr, i) {
    return _array_with_holes(arr) || _iterable_to_array_limit(arr, i) || _unsupported_iterable_to_array(arr, i) || _non_iterable_rest();
}
function _unsupported_iterable_to_array(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _array_like_to_array(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(n);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _array_like_to_array(o, minLen);
}
import { jsxDEV as _jsxDEV } from "react/jsx-dev-runtime";
import React, { useState, useEffect } from 'react';
/**
 * A component that intentionally throws different types of errors
 * to demonstrate and test error boundary functionality
 * 
 * @param {Object} props - Component properties
 * @param {string} props.errorType - Type of error to throw (render, effect, event, promise)
 * @param {number} props.delay - Delay in ms before throwing error in effects/promises
 * @param {boolean} props.shouldError - Whether the component should throw an error
 * @returns {JSX.Element} Component that will throw an error based on configuration
 */ export function ErrorCausingComponent(param) {
    var _param_errorType = param.errorType, errorType = _param_errorType === void 0 ? 'render' : _param_errorType, _param_delay = param.delay, delay = _param_delay === void 0 ? 1000 : _param_delay, _param_shouldError = param.shouldError, shouldError = _param_shouldError === void 0 ? true : _param_shouldError;
    var _useState = _sliced_to_array(useState(0), 2), count = _useState[0], setCount = _useState[1];
    var _useState1 = _sliced_to_array(useState(false), 2), hasErrored = _useState1[0], setHasErrored = _useState1[1];
    // Function to create different error types with descriptive messages
    var createError = function(type) {
        switch(type){
            case 'reference':
                return new ReferenceError('This is a simulated REFERENCE error (undefined variable)');
            case 'type':
                return new TypeError('This is a simulated TYPE error (invalid operation)');
            case 'syntax':
                return new SyntaxError('This is a simulated SYNTAX error (invalid code)');
            case 'range':
                return new RangeError('This is a simulated RANGE error (value out of range)');
            case 'custom':
                var customError = new Error('This is a simulated CUSTOM application error');
                customError.name = 'ApplicationError';
                return customError;
            default:
                return new Error("This is a simulated error from ".concat(type));
        }
    };
    // Effect error - throws after component mounts
    useEffect(function() {
        var timeoutId;
        if (shouldError && errorType === 'effect' && !hasErrored) {
            timeoutId = setTimeout(function() {
                setHasErrored(true);
                throw createError('effect');
            }, delay);
        }
        return function() {
            if (timeoutId) clearTimeout(timeoutId);
        };
    }, [
        errorType,
        delay,
        shouldError,
        hasErrored
    ]);
    // Promise error - rejects a promise after delay
    useEffect(function() {
        var timeoutId;
        if (shouldError && errorType === 'promise' && !hasErrored) {
            timeoutId = setTimeout(function() {
                setHasErrored(true);
                Promise.reject(createError('promise')).catch(function(err) {
                    // This will cause an unhandled rejection
                    throw err;
                });
            }, delay);
        }
        return function() {
            if (timeoutId) clearTimeout(timeoutId);
        };
    }, [
        errorType,
        delay,
        shouldError,
        hasErrored
    ]);
    // Event handler that throws an error
    var handleErrorButtonClick = function() {
        if (shouldError) {
            throw createError('event');
        }
    };
    // Counter increment (safe operation)
    var handleIncrement = function() {
        setCount(function(prevCount) {
            return prevCount + 1;
        });
    };
    // Render error - throws during render
    if (shouldError && errorType === 'render' && !hasErrored) {
        setHasErrored(true);
        throw createError('render');
    }
    return /*#__PURE__*/ _jsxDEV("div", {
        style: {
            padding: '20px',
            background: 'rgba(255, 240, 240, 0.9)',
            borderRadius: '8px',
            border: '1px solid #ffcccc',
            maxWidth: '500px',
            margin: '0 auto'
        },
        children: [
            /*#__PURE__*/ _jsxDEV("h3", {
                style: {
                    color: '#cc0000',
                    marginTop: 0
                },
                children: "Error Testing Component"
            }, void 0, false, {
                fileName: "ErrorCausingComponent.jsx",
                lineNumber: 104,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ _jsxDEV("div", {
                style: {
                    marginBottom: '15px'
                },
                children: [
                    /*#__PURE__*/ _jsxDEV("div", {
                        children: "Current configuration:"
                    }, void 0, false, {
                        fileName: "ErrorCausingComponent.jsx",
                        lineNumber: 107,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ _jsxDEV("ul", {
                        style: {
                            margin: '10px 0'
                        },
                        children: [
                            /*#__PURE__*/ _jsxDEV("li", {
                                children: [
                                    "Error Type: ",
                                    /*#__PURE__*/ _jsxDEV("strong", {
                                        children: errorType
                                    }, void 0, false, {
                                        fileName: "ErrorCausingComponent.jsx",
                                        lineNumber: 109,
                                        columnNumber: 27
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "ErrorCausingComponent.jsx",
                                lineNumber: 109,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ _jsxDEV("li", {
                                children: [
                                    "Delay: ",
                                    /*#__PURE__*/ _jsxDEV("strong", {
                                        children: [
                                            delay,
                                            "ms"
                                        ]
                                    }, void 0, true, {
                                        fileName: "ErrorCausingComponent.jsx",
                                        lineNumber: 110,
                                        columnNumber: 22
                                    }, this),
                                    " (for effect/promise errors)"
                                ]
                            }, void 0, true, {
                                fileName: "ErrorCausingComponent.jsx",
                                lineNumber: 110,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ _jsxDEV("li", {
                                children: [
                                    "Should Error: ",
                                    /*#__PURE__*/ _jsxDEV("strong", {
                                        children: shouldError ? 'Yes' : 'No'
                                    }, void 0, false, {
                                        fileName: "ErrorCausingComponent.jsx",
                                        lineNumber: 111,
                                        columnNumber: 29
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "ErrorCausingComponent.jsx",
                                lineNumber: 111,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "ErrorCausingComponent.jsx",
                        lineNumber: 108,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "ErrorCausingComponent.jsx",
                lineNumber: 106,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ _jsxDEV("div", {
                style: {
                    marginBottom: '15px'
                },
                children: [
                    /*#__PURE__*/ _jsxDEV("div", {
                        style: {
                            marginBottom: '8px'
                        },
                        children: [
                            "Counter: ",
                            count
                        ]
                    }, void 0, true, {
                        fileName: "ErrorCausingComponent.jsx",
                        lineNumber: 116,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ _jsxDEV("button", {
                        onClick: handleIncrement,
                        style: {
                            background: '#4CAF50',
                            border: 'none',
                            color: 'white',
                            padding: '8px 16px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            marginRight: '10px'
                        },
                        children: "Safe Increment"
                    }, void 0, false, {
                        fileName: "ErrorCausingComponent.jsx",
                        lineNumber: 117,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ _jsxDEV("button", {
                        onClick: handleErrorButtonClick,
                        style: {
                            background: '#f44336',
                            border: 'none',
                            color: 'white',
                            padding: '8px 16px',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        },
                        children: "Throw Event Error"
                    }, void 0, false, {
                        fileName: "ErrorCausingComponent.jsx",
                        lineNumber: 132,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "ErrorCausingComponent.jsx",
                lineNumber: 115,
                columnNumber: 7
            }, this),
            errorType === 'effect' && /*#__PURE__*/ _jsxDEV("div", {
                style: {
                    background: '#fffae6',
                    padding: '10px',
                    borderRadius: '4px',
                    border: '1px solid #ffe066'
                },
                children: [
                    /*#__PURE__*/ _jsxDEV("strong", {
                        children: "Effect Error:"
                    }, void 0, false, {
                        fileName: "ErrorCausingComponent.jsx",
                        lineNumber: 154,
                        columnNumber: 11
                    }, this),
                    " Will throw ",
                    delay,
                    "ms after mounting..."
                ]
            }, void 0, true, {
                fileName: "ErrorCausingComponent.jsx",
                lineNumber: 148,
                columnNumber: 9
            }, this),
            errorType === 'promise' && /*#__PURE__*/ _jsxDEV("div", {
                style: {
                    background: '#fffae6',
                    padding: '10px',
                    borderRadius: '4px',
                    border: '1px solid #ffe066'
                },
                children: [
                    /*#__PURE__*/ _jsxDEV("strong", {
                        children: "Promise Error:"
                    }, void 0, false, {
                        fileName: "ErrorCausingComponent.jsx",
                        lineNumber: 165,
                        columnNumber: 11
                    }, this),
                    " Will reject ",
                    delay,
                    "ms after mounting..."
                ]
            }, void 0, true, {
                fileName: "ErrorCausingComponent.jsx",
                lineNumber: 159,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "ErrorCausingComponent.jsx",
        lineNumber: 96,
        columnNumber: 5
    }, this);
}
