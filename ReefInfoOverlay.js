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
import { jsxDEV as _jsxDEV, Fragment as _Fragment } from "react/jsx-dev-runtime";
import React, { useState, useEffect } from 'react';
import { useUI } from './UIContext.js';
export var ReefInfoOverlay = function() {
    var showReefInfo = useUI().showReefInfo;
    var _useState = _sliced_to_array(useState('reef'), 2), activeSection = _useState[0], setActiveSection = _useState[1];
    var _useState1 = _sliced_to_array(useState(false), 2), isExpanded = _useState1[0], setIsExpanded = _useState1[1];
    // Information categories
    var infoSections = {
        reef: {
            title: 'Coral Reef Ecosystem',
            description: 'Coral reefs are diverse underwater ecosystems held together by calcium carbonate structures secreted by corals. They are among the most biodiverse ecosystems on Earth, housing approximately 25% of all marine species.',
            facts: [
                'Coral reefs cover less than 1% of the ocean floor but support about 25% of all marine species',
                'Corals are actually animals, not plants',
                'The Great Barrier Reef is the largest living structure on Earth'
            ]
        },
        fish: {
            title: 'Reef Fish',
            description: 'Reef fish are fish that live among or in close relation to coral reefs. They have developed specialized adaptations to live in this complex environment.',
            facts: [
                'Reef fish often have bright colors for communication, camouflage, or warning',
                'Many reef fish species form symbiotic relationships with other marine creatures',
                'Some reef fish can change their sex during their lifetime'
            ]
        },
        conservation: {
            title: 'Reef Conservation',
            description: 'Coral reefs face numerous threats including climate change, ocean acidification, overfishing, and pollution. Conservation efforts are crucial for their survival.',
            facts: [
                'Rising ocean temperatures cause coral bleaching, a stress response where corals expel their symbiotic algae',
                'Ocean acidification weakens coral skeletons, making reefs more vulnerable to damage',
                'Sustainable fishing practices and marine protected areas help preserve reef ecosystems'
            ]
        }
    };
    var toggleExpand = function() {
        setIsExpanded(!isExpanded);
    };
    // If reef info is hidden, don't render anything
    if (!showReefInfo) return null;
    return /*#__PURE__*/ _jsxDEV("div", {
        style: {
            position: 'absolute',
            top: '20px',
            left: '20px',
            maxWidth: isExpanded ? '400px' : '60px',
            background: 'rgba(0,20,40,0.75)',
            backdropFilter: 'blur(8px)',
            color: 'white',
            borderRadius: '12px',
            overflow: 'hidden',
            transition: 'max-width 0.3s ease-out, max-height 0.3s ease-out',
            boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
            zIndex: 100,
            fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            display: 'flex',
            flexDirection: 'column',
            pointerEvents: 'auto'
        },
        children: [
            /*#__PURE__*/ _jsxDEV("div", {
                onClick: toggleExpand,
                style: {
                    display: 'flex',
                    alignItems: 'center',
                    padding: '12px 15px',
                    cursor: 'pointer',
                    background: 'rgba(0,60,100,0.6)',
                    borderBottom: isExpanded ? '1px solid rgba(255,255,255,0.1)' : 'none'
                },
                children: [
                    /*#__PURE__*/ _jsxDEV("div", {
                        style: {
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            background: 'rgba(0,100,180,0.5)',
                            marginRight: isExpanded ? '10px' : '0'
                        },
                        children: /*#__PURE__*/ _jsxDEV("span", {
                            style: {
                                fontSize: '20px'
                            },
                            children: "\uD83D\uDC20"
                        }, void 0, false, {
                            fileName: "ReefInfoOverlay.jsx",
                            lineNumber: 88,
                            columnNumber: 11
                        }, _this)
                    }, void 0, false, {
                        fileName: "ReefInfoOverlay.jsx",
                        lineNumber: 78,
                        columnNumber: 9
                    }, _this),
                    isExpanded && /*#__PURE__*/ _jsxDEV("div", {
                        style: {
                            fontWeight: 'bold',
                            fontSize: '16px'
                        },
                        children: "Reef Information"
                    }, void 0, false, {
                        fileName: "ReefInfoOverlay.jsx",
                        lineNumber: 91,
                        columnNumber: 11
                    }, _this)
                ]
            }, void 0, true, {
                fileName: "ReefInfoOverlay.jsx",
                lineNumber: 67,
                columnNumber: 7
            }, _this),
            isExpanded && /*#__PURE__*/ _jsxDEV(_Fragment, {
                children: [
                    /*#__PURE__*/ _jsxDEV("div", {
                        style: {
                            display: 'flex',
                            borderBottom: '1px solid rgba(255,255,255,0.1)',
                            padding: '0 10px'
                        },
                        children: Object.keys(infoSections).map(function(section) {
                            return /*#__PURE__*/ _jsxDEV("div", {
                                onClick: function() {
                                    return setActiveSection(section);
                                },
                                style: {
                                    padding: '12px 10px',
                                    cursor: 'pointer',
                                    borderBottom: section === activeSection ? '2px solid #3498db' : '2px solid transparent',
                                    color: section === activeSection ? '#3498db' : 'rgba(255,255,255,0.7)',
                                    fontWeight: section === activeSection ? 'bold' : 'normal',
                                    fontSize: '14px',
                                    transition: 'all 0.2s'
                                },
                                children: section.charAt(0).toUpperCase() + section.slice(1)
                            }, section, false, {
                                fileName: "ReefInfoOverlay.jsx",
                                lineNumber: 107,
                                columnNumber: 15
                            }, _this);
                        })
                    }, void 0, false, {
                        fileName: "ReefInfoOverlay.jsx",
                        lineNumber: 101,
                        columnNumber: 11
                    }, _this),
                    /*#__PURE__*/ _jsxDEV("div", {
                        style: {
                            padding: '15px',
                            overflowY: 'auto',
                            maxHeight: '60vh'
                        },
                        children: [
                            /*#__PURE__*/ _jsxDEV("h3", {
                                style: {
                                    margin: '0 0 10px 0',
                                    color: '#3498db'
                                },
                                children: infoSections[activeSection].title
                            }, void 0, false, {
                                fileName: "ReefInfoOverlay.jsx",
                                lineNumber: 127,
                                columnNumber: 13
                            }, _this),
                            /*#__PURE__*/ _jsxDEV("p", {
                                style: {
                                    margin: '0 0 15px 0',
                                    fontSize: '14px',
                                    lineHeight: '1.5',
                                    color: 'rgba(255,255,255,0.9)'
                                },
                                children: infoSections[activeSection].description
                            }, void 0, false, {
                                fileName: "ReefInfoOverlay.jsx",
                                lineNumber: 130,
                                columnNumber: 13
                            }, _this),
                            /*#__PURE__*/ _jsxDEV("h4", {
                                style: {
                                    margin: '15px 0 10px 0',
                                    fontSize: '15px',
                                    color: '#2ecc71'
                                },
                                children: "Quick Facts"
                            }, void 0, false, {
                                fileName: "ReefInfoOverlay.jsx",
                                lineNumber: 139,
                                columnNumber: 13
                            }, _this),
                            /*#__PURE__*/ _jsxDEV("ul", {
                                style: {
                                    margin: '0',
                                    paddingLeft: '20px',
                                    fontSize: '13px',
                                    lineHeight: '1.4'
                                },
                                children: infoSections[activeSection].facts.map(function(fact, index) {
                                    return /*#__PURE__*/ _jsxDEV("li", {
                                        style: {
                                            margin: '8px 0',
                                            color: 'rgba(255,255,255,0.8)'
                                        },
                                        children: fact
                                    }, index, false, {
                                        fileName: "ReefInfoOverlay.jsx",
                                        lineNumber: 153,
                                        columnNumber: 17
                                    }, _this);
                                })
                            }, void 0, false, {
                                fileName: "ReefInfoOverlay.jsx",
                                lineNumber: 146,
                                columnNumber: 13
                            }, _this)
                        ]
                    }, void 0, true, {
                        fileName: "ReefInfoOverlay.jsx",
                        lineNumber: 126,
                        columnNumber: 11
                    }, _this)
                ]
            }, void 0, true)
        ]
    }, void 0, true, {
        fileName: "ReefInfoOverlay.jsx",
        lineNumber: 48,
        columnNumber: 5
    }, _this);
};
