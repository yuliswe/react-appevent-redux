"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CancellableTask = exports.AllTasksIntercept = exports.TaskInterceptNativeEvent = exports.Task = void 0;
const identifiable_1 = require("./identifiable");
/*
An instance of [Task] should encapsulate the data that's required to [run] the task by
storing them in properties. An instance of [Task] can be scheduled by calling
`TaskManager.add(taks)`.
*/
class Task {
    constructor() {
        this.taskId = (0, identifiable_1.uuid4)();
    }
    get key() {
        return this.taskId;
    }
}
exports.Task = Task;
/// Intercepts the task manager so that running tasks can be modified.
class TaskInterceptNativeEvent {
    /// The ID of the Task to be intercepted.
    constructor(taskID, callable) {
        this.taskID = taskID;
        this.callable = callable;
    }
}
exports.TaskInterceptNativeEvent = TaskInterceptNativeEvent;
class AllTasksIntercept {
    /// The ID of the Task to be intercepted.
    constructor(callable) {
        this.callable = callable;
    }
}
exports.AllTasksIntercept = AllTasksIntercept;
class CancellableTask extends Task {
    constructor() {
        super(...arguments);
        this.isCanceled = false;
    }
    onCancel() { }
    cancel() {
        this.isCanceled = true;
        this.onCancel();
    }
}
exports.CancellableTask = CancellableTask;
//# sourceMappingURL=task.js.map