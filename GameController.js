function _array_like_to_array(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}
function _array_with_holes(arr) {
    if (Array.isArray(arr)) return arr;
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
function _define_property(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
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
function _object_spread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = arguments[i] != null ? arguments[i] : {};
        var ownKeys = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === "function") {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
        }
        ownKeys.forEach(function(key) {
            _define_property(target, key, source[key]);
        });
    }
    return target;
}
function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        if (enumerableOnly) {
            symbols = symbols.filter(function(sym) {
                return Object.getOwnPropertyDescriptor(object, sym).enumerable;
            });
        }
        keys.push.apply(keys, symbols);
    }
    return keys;
}
function _object_spread_props(target, source) {
    source = source != null ? source : {};
    if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
        ownKeys(Object(source)).forEach(function(key) {
            Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
    }
    return target;
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
import * as THREE from 'three';
import { useState, useEffect, useRef } from 'react';
/**
 * Game controller that handles game state and input
 */ export var GameController = /*#__PURE__*/ function() {
    "use strict";
    function GameController() {
        var _this = this;
        _class_call_check(this, GameController);
        _define_property(this, "handleKeyDown", function(event) {
            _this.inputState.keys.add(event.key);
            _this.notifyListeners();
        });
        _define_property(this, "handleKeyUp", function(event) {
            _this.inputState.keys.delete(event.key);
            _this.notifyListeners();
        });
        _define_property(this, "handleMouseMove", function(event) {
            _this.inputState.mouse.x = event.clientX / window.innerWidth * 2 - 1;
            _this.inputState.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
            _this.notifyListeners();
        });
        _define_property(this, "handleMouseDown", function() {
            _this.inputState.mouse.isDown = true;
            _this.notifyListeners();
        });
        _define_property(this, "handleMouseUp", function() {
            _this.inputState.mouse.isDown = false;
            _this.notifyListeners();
        });
        this.isInitialized = false;
        this.gameState = {
            score: 0,
            isPlaying: false,
            level: 1
        };
        this.inputState = {
            keys: new Set(),
            mouse: {
                x: 0,
                y: 0,
                isDown: false
            }
        };
        this.listeners = new Set();
    }
    _create_class(GameController, [
        {
            key: "init",
            value: function init() {
                if (this.isInitialized) return;
                window.addEventListener('keydown', this.handleKeyDown);
                window.addEventListener('keyup', this.handleKeyUp);
                window.addEventListener('mousemove', this.handleMouseMove);
                window.addEventListener('mousedown', this.handleMouseDown);
                window.addEventListener('mouseup', this.handleMouseUp);
                this.isInitialized = true;
                this.notifyListeners();
            }
        },
        {
            key: "cleanup",
            value: function cleanup() {
                if (!this.isInitialized) return;
                window.removeEventListener('keydown', this.handleKeyDown);
                window.removeEventListener('keyup', this.handleKeyUp);
                window.removeEventListener('mousemove', this.handleMouseMove);
                window.removeEventListener('mousedown', this.handleMouseDown);
                window.removeEventListener('mouseup', this.handleMouseUp);
                this.isInitialized = false;
            }
        },
        {
            key: "startGame",
            value: function startGame() {
                this.gameState.isPlaying = true;
                this.gameState.score = 0;
                this.gameState.level = 1;
                this.notifyListeners();
            }
        },
        {
            key: "endGame",
            value: function endGame() {
                this.gameState.isPlaying = false;
                this.notifyListeners();
            }
        },
        {
            key: "addScore",
            value: function addScore(points) {
                this.gameState.score += points;
                // Level up every 100 points
                var newLevel = Math.floor(this.gameState.score / 100) + 1;
                if (newLevel > this.gameState.level) {
                    this.gameState.level = newLevel;
                }
                this.notifyListeners();
            }
        },
        {
            key: "subscribe",
            value: function subscribe(listener) {
                var _this = this;
                this.listeners.add(listener);
                return function() {
                    return _this.listeners.delete(listener);
                };
            }
        },
        {
            key: "notifyListeners",
            value: function notifyListeners() {
                var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                try {
                    for(var _iterator = this.listeners[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                        var listener = _step.value;
                        listener(this.gameState, this.inputState);
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally{
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return != null) {
                            _iterator.return();
                        }
                    } finally{
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }
            }
        }
    ], [
        {
            key: "getInstance",
            value: // Singleton instance
            function getInstance() {
                if (!GameController.instance) {
                    GameController.instance = new GameController();
                }
                return GameController.instance;
            }
        }
    ]);
    return GameController;
}();
// React hook to use the game controller
export function useGameController() {
    var _useState = _sliced_to_array(useState({
        score: 0,
        isPlaying: false,
        level: 1
    }), 2), gameState = _useState[0], setGameState = _useState[1];
    var _useState1 = _sliced_to_array(useState({
        keys: new Set(),
        mouse: {
            x: 0,
            y: 0,
            isDown: false
        }
    }), 2), inputState = _useState1[0], setInputState = _useState1[1];
    useEffect(function() {
        var controller = GameController.getInstance();
        controller.init();
        var unsubscribe = controller.subscribe(function(newGameState, newInputState) {
            setGameState(_object_spread({}, newGameState));
            setInputState(_object_spread_props(_object_spread({}, newInputState), {
                keys: new Set(newInputState.keys)
            }));
        });
        return function() {
            unsubscribe();
        };
    }, []);
    var controller = GameController.getInstance();
    return {
        gameState: gameState,
        inputState: inputState,
        startGame: function() {
            return controller.startGame();
        },
        endGame: function() {
            return controller.endGame();
        },
        addScore: function(points) {
            return controller.addScore(points);
        }
    };
}
