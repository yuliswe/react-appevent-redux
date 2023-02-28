"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppScheduler = exports.BeforeEventOfType = exports.AfterEventOfType = exports.BeforeAnyEvent = exports.AfterAnyEvent = exports.AppSchedule = void 0;
/// class [AppScheduler]
///
/// Allows you to register a callback for a redux event from anywhere of the
/// app. You can choose one of the 4 types of the schedulers:
///
/// * [BeforeAnyEvent]
/// * [AfterAnyEvent]
/// * [BeforeEventOfType]<T>
/// * [AfterEventOfType]<T>
///
/// For example:
///
/// scheduler.add(AfterEventOfType<HSRFetchContent>(
///   id: "some name",
///   once: false,
///   onTriggered: (HSRFetchContent event) {
///     // do something
///   },
/// ));
///
///
/// Later, you dispatch an event of HSRFetchContent type, and then [onTriggered]
/// is called.
///
/// rootStore.dispatch(HSRFetchContent(...));
///
/// See example usage in the home_screen.dart.
///
var DispatcherState;
(function (DispatcherState) {
    DispatcherState[DispatcherState["beforeEvent"] = 0] = "beforeEvent";
    DispatcherState[DispatcherState["afterEvent"] = 1] = "afterEvent";
})(DispatcherState || (DispatcherState = {}));
class AppSchedule {
    constructor(opts) {
        this.id = opts.id;
        this.onTriggered = opts.onTriggered;
        this.once = opts.once;
    }
    toString() {
        return `${this.constructor.name}("${this.id}")`;
    }
}
exports.AppSchedule = AppSchedule;
class AfterAnyEvent extends AppSchedule {
    _shouldRun(dispatcherState, action) {
        return true;
    }
    _shouldRemove(action) {
        return false;
    }
}
exports.AfterAnyEvent = AfterAnyEvent;
class BeforeAnyEvent extends AppSchedule {
    _shouldRun(dispatcherState, action) {
        return dispatcherState === DispatcherState.beforeEvent;
    }
    _shouldRemove(action) {
        return false;
    }
}
exports.BeforeAnyEvent = BeforeAnyEvent;
class _EventOfTypeAppSchedule extends AppSchedule {
    constructor(typeCotr, opts) {
        super(opts);
        this.typeCotr = typeCotr;
    }
    toString() {
        return `${this.constructor.name}(${this.typeCotr.name}, "${this.id}")`;
    }
}
/// Runs [onTriggered] after a redux event is dispatched from
/// rootStore.dispatch(). Example:
///
/// scheduler.add(AfterEventOfType<HSRFetchContent>(
///   id: "some name",
///   once: false,
/// ));
class AfterEventOfType extends _EventOfTypeAppSchedule {
    _shouldRun(dispatcherState, action) {
        return (action instanceof this.typeCotr &&
            dispatcherState === DispatcherState.afterEvent);
    }
    _shouldRemove(action) {
        return action instanceof this.typeCotr && this.once;
    }
}
exports.AfterEventOfType = AfterEventOfType;
class BeforeEventOfType extends _EventOfTypeAppSchedule {
    _shouldRun(dispatcherState, action) {
        return (action instanceof this.typeCotr &&
            dispatcherState === DispatcherState.beforeEvent);
    }
    _shouldRemove(action) {
        return action instanceof this.typeCotr && this.once;
    }
}
exports.BeforeEventOfType = BeforeEventOfType;
class AppScheduler {
    constructor() {
        this.schedules = new Map();
    }
    add(schedule) {
        this.schedules.set(schedule.id, schedule);
    }
    remove(id) {
        const schedule = this.schedules.get(id);
        // console.debug(`Remove AppSchedule: ${schedule} (${schedule?.id})`);
        this.schedules.delete(id);
    }
    runBeforeEvent(action) {
        for (const schedule of this.schedules.values()) {
            if (schedule._shouldRun(DispatcherState.beforeEvent, action)) {
                // console.debug(`AppSchedule: ${schedule}`);
                schedule.onTriggered(action);
            }
        }
    }
    runAfterEvent(action) {
        for (const schedule of this.schedules.values()) {
            if (schedule._shouldRun(DispatcherState.afterEvent, action)) {
                // console.debug(`AppSchedule: ${schedule}`);
                schedule.onTriggered(action);
            }
            if (schedule._shouldRemove(action)) {
                // console.debug(`Remove AppSchedule: ${schedule}`);
                this.schedules.delete(schedule.id);
            }
        }
    }
}
exports.AppScheduler = AppScheduler;
//# sourceMappingURL=schedule.js.map