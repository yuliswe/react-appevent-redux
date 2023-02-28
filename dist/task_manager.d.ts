import type { AppStore } from "./store";
import type { AllTasksIntercept, Task, TaskInterceptNativeEvent } from "./task";
import { Event } from "event-target-shim";
export declare class TaskAddedNativeEvent<T> extends Event {
    task: Task<T>;
    newState: T;
    reason: string;
    constructor(task: Task<T>, newState: T, reason: string);
}
export declare class TaskInterceptAdded extends Event {
    intercept: TaskInterceptNativeEvent;
    constructor(intercept: TaskInterceptNativeEvent);
}
export declare class AllTasksInterceptAddedNativeEvent extends Event {
    allIntercept: AllTasksIntercept;
    constructor(allIntercept: AllTasksIntercept);
}
export declare type TaskManagerOptions = {
    mockTaskRun: boolean;
};
export declare class TaskManager<T> {
    tasks: Map<string, Task<T>>;
    store: AppStore<T>;
    mockTaskRun: boolean;
    constructor(options: TaskManagerOptions);
    getTaskById(taskID: string): Task<any> | undefined;
    getTasksByType(taskType: any): Iterable<Task<any>>;
    listen(store: AppStore<T>): void;
    onTaskIntercept(event: TaskInterceptAdded): void;
    onAllTasksIntercept(event: AllTasksInterceptAddedNativeEvent): void;
    onTaskAdded(action: TaskAddedNativeEvent<T>): Promise<void>;
}
//# sourceMappingURL=task_manager.d.ts.map