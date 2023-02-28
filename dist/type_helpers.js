"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isPlain = exports.isIterable = void 0;
function isIterable(obj) {
    // checks for null and undefined
    if (obj === null) {
        return false;
    }
    return typeof obj[Symbol.iterator] === "function" && obj instanceof Object;
}
exports.isIterable = isIterable;
function isPlain(val) {
    return (typeof val === "undefined" ||
        val === null ||
        typeof val === "string" ||
        typeof val === "boolean" ||
        typeof val === "number" ||
        Array.isArray(val) ||
        Object.values(val).map(isPlain).every(Boolean));
}
exports.isPlain = isPlain;
//# sourceMappingURL=type_helpers.js.map