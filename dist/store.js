"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppStore = exports.APPSTORE_SET_STATE = exports.StateChangedNativeEvent = void 0;
const identifiable_1 = require("./identifiable");
const task_manager_1 = require("./task_manager");
const event_target_shim_1 = require("event-target-shim");
const schedule_1 = require("./schedule");
class StateChangedNativeEvent extends event_target_shim_1.Event {
    constructor(oldState, newState, reason) {
        super("StateChangedNativeEvent");
        this.oldState = oldState;
        this.newState = newState;
        this.reason = reason;
    }
}
exports.StateChangedNativeEvent = StateChangedNativeEvent;
exports.APPSTORE_SET_STATE = "APPSTORE_SET_STATE";
class AppStore {
    constructor(options) {
        var _a, _b;
        this.__type = "Store";
        this.id = (0, identifiable_1.uuid4)();
        this.middlewares = [];
        this.eventTarget = new event_target_shim_1.EventTarget();
        this.id = (_a = options.id) !== null && _a !== void 0 ? _a : this.id;
        this.middlewares = (_b = options.middlewares) !== null && _b !== void 0 ? _b : this.middlewares;
        this.reduxStore = options.reduxStore;
        this.taskManager = new task_manager_1.TaskManager({
            mockTaskRun: false,
        });
        this.taskManager.listen(this);
    }
    static wrapReducer(reducer) {
        return (state, action) => {
            let actionName = action.type;
            if (actionName.startsWith(exports.APPSTORE_SET_STATE)) {
                return action.state;
            }
            else {
                return reducer(state, action);
            }
        };
    }
    listenToStateChange(listener) {
        this.eventTarget.addEventListener("StateChangedNativeEvent", listener);
    }
    addTaskListener(listener) {
        this.eventTarget.addEventListener("TaskAddedNativeEvent", listener);
        this.eventTarget.addEventListener("TaskInterceptNativeEvent", listener);
        this.eventTarget.addEventListener("AllTasksInterceptAddedNativeEvent", listener);
    }
    getState() {
        const state = this.reduxStore.getState();
        return state;
    }
    dispatch(event) {
        var _a, _b;
        AppStore.scheduler.runBeforeEvent(event);
        const oldState = this.getState();
        // let newEvent = this.runMiddlewares(oldState, event);
        const newState = event.reducer(oldState);
        // feature: sync a part of the state with url
        // console.info("AppEvent:", event.constructor, event);
        this.eventTarget.dispatchEvent(new StateChangedNativeEvent(null, newState, (_a = event.__name) !== null && _a !== void 0 ? _a : "?"));
        for (const task of event.task(newState, oldState)) {
            this.eventTarget.dispatchEvent(new task_manager_1.TaskAddedNativeEvent(task, newState, (_b = event.__name) !== null && _b !== void 0 ? _b : "?"));
        }
        if (this._waitPromiseHandles) {
            if (event instanceof this._waitPromiseHandles.eventType) {
                this._waitPromiseHandles.resolve(event);
            }
        }
        const dispatch = this.reduxStore.dispatch;
        dispatch({
            type: exports.APPSTORE_SET_STATE + " " + event.type,
            "appEvent.type": event.type,
            appEvent: event,
            state: newState,
        });
        AppStore.scheduler.runAfterEvent(event);
    }
    dispatchAfterTask(event) {
        const dispatch = this.reduxStore.dispatch;
        const oldState = this.getState();
        const newState = event.reduceAfter(oldState);
        dispatch({
            type: `APPSTORE_SET_STATE ${event.type} (reduceAfter)`,
            "appEvent.type": `${event.type} (reduceAfter)`,
            appEvent: event,
            state: newState,
        });
    }
    addSchedule(schedule) {
        // console.debug("Add schedule", schedule);
        AppStore.scheduler.add(schedule);
    }
    removeSchedule(id) {
        AppStore.scheduler.remove(id);
    }
    /**
     * This is a helper designed to aid async mocha testing. You can wait for a Payload
     * before checking expectations on the state like this:
     *
     * let payload = await rootComponent.store.waitFor(VerifyAccountPayload)
     *  expect(payload.result.success).eq(true)
     *
     * The promise is resolve after the state is updated, so you can expect the latest
     * state after the event.
     *
     * @eventType the constructor of the event to wait for
     * @returns the event waited for
     */
    async waitFor(eventType) {
        return new Promise((resolve, reject) => {
            this._waitPromiseHandles = { eventType, resolve, reject };
        });
    }
}
exports.AppStore = AppStore;
AppStore.scheduler = new schedule_1.AppScheduler();
//# sourceMappingURL=store.js.map