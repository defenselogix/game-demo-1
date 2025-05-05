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
import React, { useState } from 'react';
import TestPageLoader from './TestPageLoader.js';
import GameSceneCore from './GameSceneCore.js';
export default function TestRouteManager() {
    var _this = this;
    var _useState = _sliced_to_array(useState('testPage'), 2), currentRoute = _useState[0], setCurrentRoute = _useState[1];
    var _useState1 = _sliced_to_array(useState(false), 2), isMenuOpen = _useState1[0], setIsMenuOpen = _useState1[1];
    // Define available test routes
    var routes = {
        testPage: {
            name: 'Render Test Page',
            component: /*#__PURE__*/ _jsxDEV(TestPageLoader, {}, void 0, false, {
                fileName: "TestRouteManager.jsx",
                lineNumber: 13,
                columnNumber: 18
            }, this),
            description: 'Basic rendering test for Three.js and React Three Fiber'
        },
        gameScene: {
            name: 'Game Scene Core',
            component: /*#__PURE__*/ _jsxDEV(GameSceneCore, {}, void 0, false, {
                fileName: "TestRouteManager.jsx",
                lineNumber: 18,
                columnNumber: 18
            }, this),
            description: 'Core game scene with physics and underwater environment'
        }
    };
    // Handle navigation
    var navigateTo = function(route) {
        setCurrentRoute(route);
        setIsMenuOpen(false);
    };
    // Toggle menu visibility
    var toggleMenu = function() {
        setIsMenuOpen(!isMenuOpen);
    };
    return /*#__PURE__*/ _jsxDEV("div", {
        style: {
            width: '100%',
            height: '100%',
            position: 'relative'
        },
        children: [
            /*#__PURE__*/ _jsxDEV("div", {
                style: {
                    width: '100%',
                    height: '100%'
                },
                children: routes[currentRoute].component
            }, void 0, false, {
                fileName: "TestRouteManager.jsx",
                lineNumber: 37,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ _jsxDEV("div", {
                style: {
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    zIndex: 1000
                },
                children: /*#__PURE__*/ _jsxDEV("button", {
                    onClick: toggleMenu,
                    style: {
                        padding: '8px 12px',
                        backgroundColor: '#3498db',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                    },
                    children: isMenuOpen ? '✕ Close' : '☰ Menu'
                }, void 0, false, {
                    fileName: "TestRouteManager.jsx",
                    lineNumber: 50,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "TestRouteManager.jsx",
                lineNumber: 42,
                columnNumber: 7
            }, this),
            isMenuOpen && /*#__PURE__*/ _jsxDEV("div", {
                style: {
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0,0,0,0.7)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 999
                },
                children: /*#__PURE__*/ _jsxDEV("div", {
                    style: {
                        backgroundColor: '#0a1929',
                        padding: '20px',
                        borderRadius: '8px',
                        maxWidth: '90%',
                        width: '500px',
                        maxHeight: '90%',
                        overflowY: 'auto'
                    },
                    children: [
                        /*#__PURE__*/ _jsxDEV("h2", {
                            style: {
                                color: 'white',
                                marginTop: 0,
                                textAlign: 'center'
                            },
                            children: "Test Components"
                        }, void 0, false, {
                            fileName: "TestRouteManager.jsx",
                            lineNumber: 93,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ _jsxDEV("p", {
                            style: {
                                color: '#aaa',
                                textAlign: 'center'
                            },
                            children: "Select a component to test"
                        }, void 0, false, {
                            fileName: "TestRouteManager.jsx",
                            lineNumber: 96,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ _jsxDEV("div", {
                            style: {
                                marginTop: '20px'
                            },
                            children: Object.entries(routes).map(function(param) {
                                var _param = _sliced_to_array(param, 2), key = _param[0], route = _param[1];
                                return /*#__PURE__*/ _jsxDEV("div", {
                                    style: {
                                        backgroundColor: currentRoute === key ? '#1e3a5f' : '#1a2a40',
                                        padding: '15px',
                                        borderRadius: '6px',
                                        marginBottom: '10px',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease'
                                    },
                                    onClick: function() {
                                        return navigateTo(key);
                                    },
                                    children: [
                                        /*#__PURE__*/ _jsxDEV("h3", {
                                            style: {
                                                color: 'white',
                                                margin: '0 0 5px 0'
                                            },
                                            children: route.name
                                        }, void 0, false, {
                                            fileName: "TestRouteManager.jsx",
                                            lineNumber: 114,
                                            columnNumber: 19
                                        }, _this),
                                        /*#__PURE__*/ _jsxDEV("p", {
                                            style: {
                                                color: '#bbb',
                                                margin: 0,
                                                fontSize: '14px'
                                            },
                                            children: route.description
                                        }, void 0, false, {
                                            fileName: "TestRouteManager.jsx",
                                            lineNumber: 115,
                                            columnNumber: 19
                                        }, _this)
                                    ]
                                }, key, true, {
                                    fileName: "TestRouteManager.jsx",
                                    lineNumber: 102,
                                    columnNumber: 17
                                }, _this);
                            })
                        }, void 0, false, {
                            fileName: "TestRouteManager.jsx",
                            lineNumber: 100,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ _jsxDEV("div", {
                            style: {
                                textAlign: 'center',
                                marginTop: '20px'
                            },
                            children: /*#__PURE__*/ _jsxDEV("button", {
                                onClick: toggleMenu,
                                style: {
                                    padding: '8px 20px',
                                    backgroundColor: '#e74c3c',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                },
                                children: "Close Menu"
                            }, void 0, false, {
                                fileName: "TestRouteManager.jsx",
                                lineNumber: 123,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "TestRouteManager.jsx",
                            lineNumber: 122,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "TestRouteManager.jsx",
                    lineNumber: 82,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "TestRouteManager.jsx",
                lineNumber: 68,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ _jsxDEV("div", {
                style: {
                    position: 'absolute',
                    bottom: '10px',
                    left: '10px',
                    padding: '8px 12px',
                    backgroundColor: 'rgba(0,0,0,0.6)',
                    color: 'white',
                    borderRadius: '4px',
                    fontSize: '14px',
                    zIndex: 100
                },
                children: [
                    "Currently Testing: ",
                    routes[currentRoute].name
                ]
            }, void 0, true, {
                fileName: "TestRouteManager.jsx",
                lineNumber: 142,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "TestRouteManager.jsx",
        lineNumber: 35,
        columnNumber: 5
    }, this);
}
