"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskManager = exports.AllTasksInterceptAddedNativeEvent = exports.TaskInterceptAdded = exports.TaskAddedNativeEvent = void 0;
const event_1 = require("./event");
const event_target_shim_1 = require("event-target-shim");
class TaskAddedNativeEvent extends event_target_shim_1.Event {
    constructor(task, newState, reason) {
        super("TaskAddedNativeEvent");
        this.task = task;
        this.newState = newState;
        this.reason = reason;
    }
}
exports.TaskAddedNativeEvent = TaskAddedNativeEvent;
class TaskInterceptAdded extends event_target_shim_1.Event {
    constructor(intercept) {
        super("TaskInterceptAdded");
        this.intercept = intercept;
    }
}
exports.TaskInterceptAdded = TaskInterceptAdded;
class AllTasksInterceptAddedNativeEvent extends event_target_shim_1.Event {
    constructor(allIntercept) {
        super("AllTasksInterceptAddedNativeEvent");
        this.allIntercept = allIntercept;
    }
}
exports.AllTasksInterceptAddedNativeEvent = AllTasksInterceptAddedNativeEvent;
// Task manager running on the main thread
class TaskManager {
    constructor(options) {
        this.tasks = new Map();
        this.mockTaskRun = options.mockTaskRun;
    }
    getTaskById(taskID) {
        return this.tasks.get(taskID);
    }
    *getTasksByType(taskType) {
        for (const task of this.tasks.values()) {
            if (task instanceof taskType) {
                yield task;
            }
        }
    }
    listen(store) {
        this.store = store;
        this.store.addTaskListener((event) => {
            if (event instanceof TaskAddedNativeEvent) {
                this.onTaskAdded(event);
            }
            else if (event instanceof TaskInterceptAdded) {
                this.onTaskIntercept(event);
            }
            else if (event instanceof AllTasksInterceptAddedNativeEvent) {
                this.onAllTasksIntercept(event);
            }
            else {
                console.error("Unknown type", event);
                throw Error("Unknown type");
            }
        });
    }
    onTaskIntercept(event) {
        const targetTask = this.tasks.get(event.intercept.taskID);
        if (targetTask) {
            const toSend = event.intercept.callable(targetTask);
            // if (toSend) {
            //     this.store!.dispatch(toSend)
            // }
        }
    }
    onAllTasksIntercept(event) {
        const toSend = event.allIntercept.callable(this.tasks.values());
        // if (toSend) {
        //     this.store!.dispatch(toSend)
        // }
    }
    async onTaskAdded(action) {
        const task = action.task;
        console.assert(this.store !== undefined);
        this.tasks.set(task.key, task);
        try {
            // force control to return to the store.dispatch execution becuase task
            // run is suppoed to be low priority
            await new Promise((r) => setTimeout(r, 0));
            for await (const event of task.run(action.newState)) {
                this.store.dispatch(event);
            }
            if (task instanceof event_1.AppEvent) {
                this.store.dispatchAfterTask(task);
            }
        }
        catch (error) {
            console.error("Exception during task", task.constructor.name);
            throw error;
        }
        finally {
            this.tasks.delete(task.key);
        }
    }
}
exports.TaskManager = TaskManager;
//# sourceMappingURL=task_manager.js.map