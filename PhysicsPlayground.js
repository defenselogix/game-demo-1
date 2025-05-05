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
var _this = this;
import { jsxDEV as _jsxDEV } from "react/jsx-dev-runtime";
import React from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Box, Sphere } from '@react-three/drei';
var UnderwaterObject = function(param) {
    var position = param.position, _param_shape = param.shape, shape = _param_shape === void 0 ? 'box' : _param_shape, _param_color = param.color, color = _param_color === void 0 ? 'coral' : _param_color, _param_size = param.size, size = _param_size === void 0 ? 0.5 : _param_size;
    var meshRef = React.useRef();
    var _React_useState = _sliced_to_array(React.useState(false), 2), clicked = _React_useState[0], setClicked = _React_useState[1];
    // Animate the objects to simulate underwater movement
    useFrame(function(state) {
        if (meshRef.current) {
            // Gentle bobbing motion
            meshRef.current.position.y += Math.sin(state.clock.elapsedTime + position[0]) * 0.002;
            // Subtle rotation
            meshRef.current.rotation.x += 0.001;
            meshRef.current.rotation.y += 0.001;
            // Add extra buoyancy when clicked
            if (clicked) {
                meshRef.current.position.y += 0.001;
            }
        }
    });
    var handleClick = function(e) {
        e.stopPropagation();
        setClicked(!clicked);
    };
    var ShapeComponent = shape === 'sphere' ? Sphere : Box;
    return /*#__PURE__*/ _jsxDEV("mesh", {
        ref: meshRef,
        position: position,
        onClick: handleClick,
        onPointerOver: function() {
            return document.body.style.cursor = 'pointer';
        },
        onPointerOut: function() {
            return document.body.style.cursor = 'auto';
        },
        children: /*#__PURE__*/ _jsxDEV(ShapeComponent, {
            args: shape === 'sphere' ? [
                size
            ] : [
                size,
                size,
                size
            ],
            children: /*#__PURE__*/ _jsxDEV("meshStandardMaterial", {
                color: clicked ? '#80DEEA' : color,
                emissive: clicked ? '#4DD0E1' : 'black',
                emissiveIntensity: clicked ? 0.6 : 0,
                transparent: true,
                opacity: 0.8,
                roughness: 0.2,
                metalness: 0.5
            }, void 0, false, {
                fileName: "PhysicsPlayground.jsx",
                lineNumber: 42,
                columnNumber: 9
            }, _this)
        }, void 0, false, {
            fileName: "PhysicsPlayground.jsx",
            lineNumber: 41,
            columnNumber: 7
        }, _this)
    }, void 0, false, {
        fileName: "PhysicsPlayground.jsx",
        lineNumber: 34,
        columnNumber: 5
    }, _this);
};
export default function PhysicsPlayground() {
    var _this = this;
    // Fixed set of underwater objects for simplified version
    var underwaterObjects = [
        {
            id: 1,
            position: [
                -2,
                1,
                -1
            ],
            shape: 'box',
            color: '#E57373',
            size: 0.5
        },
        {
            id: 2,
            position: [
                1,
                2,
                -2
            ],
            shape: 'sphere',
            color: '#81C784',
            size: 0.4
        },
        {
            id: 3,
            position: [
                0,
                3,
                0
            ],
            shape: 'box',
            color: '#FFD54F',
            size: 0.6
        },
        {
            id: 4,
            position: [
                2,
                1,
                1
            ],
            shape: 'sphere',
            color: '#9575CD',
            size: 0.5
        },
        {
            id: 5,
            position: [
                -1,
                4,
                2
            ],
            shape: 'box',
            color: '#4FC3F7',
            size: 0.4
        }
    ];
    return /*#__PURE__*/ _jsxDEV("group", {
        children: [
            /*#__PURE__*/ _jsxDEV("mesh", {
                position: [
                    0,
                    -1.5,
                    0
                ],
                children: [
                    /*#__PURE__*/ _jsxDEV("boxGeometry", {
                        args: [
                            20,
                            1,
                            20
                        ]
                    }, void 0, false, {
                        fileName: "PhysicsPlayground.jsx",
                        lineNumber: 70,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ _jsxDEV("meshStandardMaterial", {
                        color: "#2d5f74",
                        roughness: 0.9
                    }, void 0, false, {
                        fileName: "PhysicsPlayground.jsx",
                        lineNumber: 71,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "PhysicsPlayground.jsx",
                lineNumber: 69,
                columnNumber: 7
            }, this),
            underwaterObjects.map(function(obj) {
                return /*#__PURE__*/ _jsxDEV(UnderwaterObject, {
                    position: obj.position,
                    shape: obj.shape,
                    color: obj.color,
                    size: obj.size
                }, obj.id, false, {
                    fileName: "PhysicsPlayground.jsx",
                    lineNumber: 76,
                    columnNumber: 9
                }, _this);
            }),
            /*#__PURE__*/ _jsxDEV(Text, {
                position: [
                    0,
                    5,
                    0
                ],
                fontSize: 0.3,
                color: "#ffffff",
                anchorX: "center",
                anchorY: "middle",
                children: "Click objects to make them float!"
            }, void 0, false, {
                fileName: "PhysicsPlayground.jsx",
                lineNumber: 86,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ _jsxDEV("mesh", {
                position: [
                    3.5,
                    0.5,
                    0
                ],
                children: [
                    /*#__PURE__*/ _jsxDEV("boxGeometry", {
                        args: [
                            1,
                            1,
                            1
                        ]
                    }, void 0, false, {
                        fileName: "PhysicsPlayground.jsx",
                        lineNumber: 98,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ _jsxDEV("meshStandardMaterial", {
                        color: "#FF80AB",
                        transparent: true,
                        opacity: 0.9,
                        emissive: "#FF4081",
                        emissiveIntensity: 0.3
                    }, void 0, false, {
                        fileName: "PhysicsPlayground.jsx",
                        lineNumber: 99,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ _jsxDEV(Text, {
                        position: [
                            0,
                            0,
                            0.6
                        ],
                        fontSize: 0.2,
                        color: "#ffffff",
                        anchorX: "center",
                        anchorY: "middle",
                        children: "Interactive"
                    }, void 0, false, {
                        fileName: "PhysicsPlayground.jsx",
                        lineNumber: 100,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "PhysicsPlayground.jsx",
                lineNumber: 97,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "PhysicsPlayground.jsx",
        lineNumber: 67,
        columnNumber: 5
    }, this);
}
