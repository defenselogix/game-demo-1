import { jsxDEV as _jsxDEV } from "react/jsx-dev-runtime";
import * as THREE from 'three';
import { RigidBody } from '@react-three/rapier';
/**
 * Physics twin for a visual sand-mound.
 * The `colliders="trimesh"` prop lets Rapier build a collider that
 * exactly follows the mesh’s vertex data, and `userData.type`
 * flags it so `getSurfacePoint` hits the mound.
 */ export default function SandMoundPhysics(param) {
    var geometry = param.geometry, material = param.material, _param_position = param.position, position = _param_position === void 0 ? [
        0,
        0,
        0
    ] : _param_position;
    /** Rapier doesn't pick up React's `userData` prop automatically.
   *  Attach it imperatively when the body is first created so
   *  `getSurfacePoint` can recognise this collider as a sand-mound. */ // ensure *both* the body and every collider report `type:'sandMound'`
    var handleCreate = function(body) {
        body.userData = {
            type: 'sandMound'
        }; // RigidBody
        // R3F/Rapier exposes the collider list on the body instance
        if (body.colliders) {
            body.colliders().forEach(function(col) {
                col.userData = {
                    type: 'sandMound'
                }; // Collider
            });
        }
    };
    return /*#__PURE__*/ _jsxDEV(RigidBody, {
        type: "fixed",
        colliders: "trimesh",
        position: position,
        onCreate: handleCreate,
        children: /*#__PURE__*/ _jsxDEV("mesh", {
            geometry: geometry,
            material: material
        }, void 0, false, {
            fileName: "SandMoundPhysics.jsx",
            lineNumber: 30,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "SandMoundPhysics.jsx",
        lineNumber: 24,
        columnNumber: 5
    }, this);
}
