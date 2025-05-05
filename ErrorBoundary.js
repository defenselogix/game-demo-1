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
function _type_of(obj) {
    "@swc/helpers - typeof";
    return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj;
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
import React, { Component } from 'react';
import { FallbackErrorUI } from './FallbackErrorUI.js';
/**
 * Error Boundary component that catches JavaScript errors in its child component tree,
 * logs those errors, and displays a fallback UI instead of crashing the whole application.
 * 
 * @example
 * <ErrorBoundary 
 *   FallbackComponent={CustomFallback} 
 *   onError={(error, info) => logErrorToService(error, info)}
 *   onReset={() => { // custom reset logic }}
 * >
 *   <YourApplication />
 * </ErrorBoundary>
 */ export var ErrorBoundary = /*#__PURE__*/ function(Component) {
    "use strict";
    _inherits(ErrorBoundary, Component);
    function ErrorBoundary(props) {
        _class_call_check(this, ErrorBoundary);
        var _this;
        _this = _call_super(this, ErrorBoundary, [
            props
        ]);
        _this.state = {
            hasError: false,
            error: null,
            errorInfo: null
        };
        _this.resetErrorBoundary = _this.resetErrorBoundary.bind(_this);
        return _this;
    }
    _create_class(ErrorBoundary, [
        {
            key: "componentDidCatch",
            value: function componentDidCatch(error, errorInfo) {
                // You can log the error to an error reporting service
                this.setState({
                    errorInfo: errorInfo
                });
                // Call the onError callback if provided
                if (this.props.onError) {
                    this.props.onError(error, errorInfo);
                }
                // Log the error to console in development
                if (process.env.NODE_ENV !== 'production') {
                    console.error('Error caught by ErrorBoundary:', error);
                    console.error('Component stack trace:', errorInfo === null || errorInfo === void 0 ? void 0 : errorInfo.componentStack);
                }
            }
        },
        {
            key: "resetErrorBoundary",
            value: function resetErrorBoundary() {
                // Call the onReset callback if provided
                if (this.props.onReset) {
                    this.props.onReset();
                }
                // Reset the error state
                this.setState({
                    hasError: false,
                    error: null,
                    errorInfo: null
                });
            }
        },
        {
            key: "render",
            value: function render() {
                if (this.state.hasError) {
                    // Render the fallback UI if there's an error
                    var FallbackComponent = this.props.FallbackComponent || FallbackErrorUI;
                    return /*#__PURE__*/ _jsxDEV(FallbackComponent, {
                        error: this.state.error,
                        errorInfo: this.state.errorInfo,
                        resetErrorBoundary: this.resetErrorBoundary
                    }, void 0, false, {
                        fileName: "ErrorBoundary.jsx",
                        lineNumber: 60,
                        columnNumber: 9
                    }, this);
                }
                // Otherwise, render the children normally
                return this.props.children;
            }
        }
    ], [
        {
            key: "getDerivedStateFromError",
            value: function getDerivedStateFromError(error) {
                // Update state so the next render will show the fallback UI
                return {
                    hasError: true,
                    error: error
                };
            }
        }
    ]);
    return ErrorBoundary;
}(Component);
