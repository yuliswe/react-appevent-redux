"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.to = exports.copyState = exports.mapStateOptional = exports.mapState = exports.copy = exports.isImmutable = void 0;
function isImmutable(x) {
    return x["copyWith"] !== undefined;
}
exports.isImmutable = isImmutable;
function copy(obj) {
    if (obj instanceof Object) {
        const copy = Object.create(Object.getPrototypeOf(obj));
        Object.assign(copy, obj);
        return copy;
    }
    else {
        return obj;
    }
}
exports.copy = copy;
/**
 * Short-hand for chaining modifiers. So instead of writing:
 *
 *      state.copyWith({
 *           parent: (parent) => parent.m({
 *               child: (child) => child.m({
 *                   childprop: (childprop) => true
 *               })
 *           })
 *      })
 *
 * You can write
 *
 *      state.copyWith({
 *           parent: modify<ParentType>({
 *               child: modify<ChildType>({
 *                   childprop: to(true)
 *               })
 *           })
 *      })
 *
 * @param modifier
 * @returns
 */
function mapState(modifier) {
    return (x) => {
        const copy = copyState(x);
        for (const k in modifier) {
            const fn = modifier[k];
            const newVal = fn(x[k]);
            copy[k] = newVal;
        }
        return copy;
    };
}
exports.mapState = mapState;
function mapStateOptional(modifier, defaultVal) {
    return (x) => mapState(modifier)(x !== null && x !== void 0 ? x : defaultVal);
}
exports.mapStateOptional = mapStateOptional;
function copyState(target) {
    const copy = Object.create(Object.getPrototypeOf(target));
    Object.assign(copy, target);
    return copy;
}
exports.copyState = copyState;
function to(val) {
    return (_) => val;
}
exports.to = to;
//# sourceMappingURL=immutable.js.map