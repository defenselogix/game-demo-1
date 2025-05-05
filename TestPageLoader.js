function _array_like_to_array(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}
function _array_with_holes(arr) {
    if (Array.isArray(arr)) return arr;
}
function _assert_this_initialized(self) {
    if (self === void 0) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }
    return self;
}
function _call_super(_this, derived, args) {
    derived = _get_prototype_of(derived);
    return _possible_constructor_return(_this, _is_native_reflect_construct() ? Reflect.construct(derived, args || [], _get_prototype_of(_this).constructor) : derived.apply(_this, args));
}
function _class_call_check(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _create_class(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
}
function _get_prototype_of(o) {
    _get_prototype_of = Object.setPrototypeOf ? Object.getPrototypeOf : function getPrototypeOf(o) {
        return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _get_prototype_of(o);
}
function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function");
    }
    subClass.prototype = Object.create(superClass && superClass.prototype, {
        constructor: {
            value: subClass,
            writable: true,
            configurable: true
        }
    });
    if (superClass) _set_prototype_of(subClass, superClass);
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
function _possible_constructor_return(self, call) {
    if (call && (_type_of(call) === "object" || typeof call === "function")) {
        return call;
    }
    return _assert_this_initialized(self);
}
function _set_prototype_of(o, p) {
    _set_prototype_of = Object.setPrototypeOf || function setPrototypeOf(o, p) {
        o.__proto__ = p;
        return o;
    };
    return _set_prototype_of(o, p);
}
function _sliced_to_array(arr, i) {
    return _array_with_holes(arr) || _iterable_to_array_limit(arr, i) || _unsupported_iterable_to_array(arr, i) || _non_iterable_rest();
}
function _type_of(obj) {
    "@swc/helpers - typeof";
    return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj;
}
function _unsupported_iterable_to_array(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _array_like_to_array(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(n);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _array_like_to_array(o, minLen);
}
function _is_native_reflect_construct() {
    try {
        var result = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}));
    } catch (_) {}
    return (_is_native_reflect_construct = function() {
        return !!result;
    })();
}
import { jsxDEV as _jsxDEV } from "react/jsx-dev-runtime";
import React, { Suspense, lazy, useState } from 'react';
// Lazy load the RenderTestPage component
var RenderTestPage = /*#__PURE__*/ lazy(function() {
    // Simulate network delay in development for testing loading state
    return new Promise(function(resolve) {
        var loadComponent = import('RenderTestPage');
        if (process.env.NODE_ENV === 'development') {
            setTimeout(function() {
                return resolve(loadComponent);
            }, 1500);
        } else {
            resolve(loadComponent);
        }
    });
});
// Error boundary for handling component loading errors
var LoadingErrorBoundary = /*#__PURE__*/ function(_React_Component) {
    "use strict";
    _inherits(LoadingErrorBoundary, _React_Component);
    function LoadingErrorBoundary(props) {
        _class_call_check(this, LoadingErrorBoundary);
        var _this;
        _this = _call_super(this, LoadingErrorBoundary, [
            props
        ]);
        _this.state = {
            hasError: false,
            error: null
        };
        return _this;
    }
    _create_class(LoadingErrorBoundary, [
        {
            key: "componentDidCatch",
            value: function componentDidCatch(error, errorInfo) {
                console.error("Loading error:", error);
                console.error("Component stack:", errorInfo.componentStack);
            }
        },
        {
            key: "render",
            value: function render() {
                var _this = this;
                if (this.state.hasError) {
                    var _this_state_error;
                    return /*#__PURE__*/ _jsxDEV("div", {
                        style: {
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: '#1a1a2e',
                            color: 'white',
                            fontFamily: 'sans-serif',
                            padding: '2rem'
                        },
                        children: [
                            /*#__PURE__*/ _jsxDEV("h2", {
                                children: "Failed to Load Test Scene"
                            }, void 0, false, {
                                fileName: "TestPageLoader.jsx",
                                lineNumber: 50,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ _jsxDEV("p", {
                                children: "There was a problem loading the 3D test environment:"
                            }, void 0, false, {
                                fileName: "TestPageLoader.jsx",
                                lineNumber: 51,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ _jsxDEV("pre", {
                                style: {
                                    backgroundColor: '#0f3460',
                                    padding: '1rem',
                                    borderRadius: '5px',
                                    maxWidth: '100%',
                                    overflow: 'auto',
                                    marginTop: '1rem'
                                },
                                children: ((_this_state_error = this.state.error) === null || _this_state_error === void 0 ? void 0 : _this_state_error.message) || "Unknown error"
                            }, void 0, false, {
                                fileName: "TestPageLoader.jsx",
                                lineNumber: 52,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ _jsxDEV("button", {
                                onClick: function() {
                                    _this.setState({
                                        hasError: false,
                                        error: null
                                    });
                                    _this.props.onReset && _this.props.onReset();
                                },
                                style: {
                                    marginTop: '1rem',
                                    padding: '0.5rem 1rem',
                                    backgroundColor: '#e94560',
                                    border: 'none',
                                    borderRadius: '4px',
                                    color: 'white',
                                    cursor: 'pointer'
                                },
                                children: "Try Again"
                            }, void 0, false, {
                                fileName: "TestPageLoader.jsx",
                                lineNumber: 62,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "TestPageLoader.jsx",
                        lineNumber: 35,
                        columnNumber: 9
                    }, this);
                }
                return this.props.children;
            }
        }
    ], [
        {
            key: "getDerivedStateFromError",
            value: function getDerivedStateFromError(error) {
                return {
                    hasError: true,
                    error: error
                };
            }
        }
    ]);
    return LoadingErrorBoundary;
}(React.Component);
// Loading component with animated spinner
function LoadingIndicator() {
    return /*#__PURE__*/ _jsxDEV("div", {
        style: {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#0a1929',
            color: 'white',
            fontFamily: 'sans-serif'
        },
        children: [
            /*#__PURE__*/ _jsxDEV("div", {
                style: {
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    border: '5px solid rgba(255, 255, 255, 0.1)',
                    borderTopColor: '#3498db',
                    animation: 'spin 1s linear infinite'
                }
            }, void 0, false, {
                fileName: "TestPageLoader.jsx",
                lineNumber: 104,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ _jsxDEV("style", {
                children: "\n          @keyframes spin {\n            to { transform: rotate(360deg); }\n          }\n        "
            }, void 0, false, {
                fileName: "TestPageLoader.jsx",
                lineNumber: 112,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ _jsxDEV("p", {
                style: {
                    marginTop: '1.5rem'
                },
                children: "Loading 3D Environment..."
            }, void 0, false, {
                fileName: "TestPageLoader.jsx",
                lineNumber: 119,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ _jsxDEV("p", {
                style: {
                    fontSize: '0.8rem',
                    marginTop: '0.5rem',
                    opacity: 0.7
                },
                children: "This may take a few moments on slower devices"
            }, void 0, false, {
                fileName: "TestPageLoader.jsx",
                lineNumber: 120,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "TestPageLoader.jsx",
        lineNumber: 90,
        columnNumber: 5
    }, this);
}
export default function TestPageLoader() {
    var _useState = _sliced_to_array(useState(0), 2), key = _useState[0], setKey = _useState[1];
    // Function to reset the component by changing its key
    var handleReset = function() {
        setKey(function(prevKey) {
            return prevKey + 1;
        });
    };
    return /*#__PURE__*/ _jsxDEV(LoadingErrorBoundary, {
        onReset: handleReset,
        children: /*#__PURE__*/ _jsxDEV(Suspense, {
            fallback: /*#__PURE__*/ _jsxDEV(LoadingIndicator, {}, void 0, false, {
                fileName: "TestPageLoader.jsx",
                lineNumber: 137,
                columnNumber: 27
            }, void 0),
            children: /*#__PURE__*/ _jsxDEV(RenderTestPage, {}, void 0, false, {
                fileName: "TestPageLoader.jsx",
                lineNumber: 138,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "TestPageLoader.jsx",
            lineNumber: 137,
            columnNumber: 7
        }, this)
    }, key, false, {
        fileName: "TestPageLoader.jsx",
        lineNumber: 136,
        columnNumber: 5
    }, this);
}
