"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppState = void 0;
const immutable_1 = require("./immutable");
const type_helpers_1 = require("./type_helpers");
class AppState {
    assignProps(props) {
        for (const [key, val] of Object.entries(this)) {
            if ((0, type_helpers_1.isPlain)(val) && props[key] !== undefined) {
                Object.defineProperty(this, key, {
                    get: () => props[key],
                });
            }
        }
    }
    mapState(modifier) {
        return (0, immutable_1.mapState)(modifier)(this);
    }
    copy() {
        return (0, immutable_1.copyState)(this);
    }
}
exports.AppState = AppState;
//# sourceMappingURL=state.js.map