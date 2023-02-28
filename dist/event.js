"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitAppEvent = exports.NativeReduxEvent = exports.AppEvent = void 0;
const task_1 = require("./task");
class AppEvent extends task_1.Task {
    constructor() {
        super();
        this.type = this.constructor.name;
    }
    get __name() {
        return this.type;
    }
    *task(newState, oldState) {
        yield this;
    }
    reduceAfter(state) {
        return state;
    }
    jsEvent() {
        return new Event(this.constructor.name);
    }
    toString() {
        return `${this.constructor.name}`;
    }
}
exports.AppEvent = AppEvent;
class NativeReduxEvent extends AppEvent {
    constructor(name) {
        super();
        this.name = name;
    }
    reducer(state) {
        return state;
    }
    async *run(state) { }
}
exports.NativeReduxEvent = NativeReduxEvent;
class InitAppEvent extends AppEvent {
    reducer(state) {
        return state;
    }
    async *run(state) { }
}
exports.InitAppEvent = InitAppEvent;
//# sourceMappingURL=event.js.map