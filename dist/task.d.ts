import type { AppEvent } from "./event";
import type { Identifiable } from "./identifiable";
export declare type AppEventStream<T> = AsyncIterable<AppEvent<T>>;
export declare abstract class Task<T> implements Identifiable {
    taskId: string;
    get key(): string;
    abstract run(state: T): AppEventStream<T>;
}
export interface MockedTask<T> {
    mockedRun(state: T): Promise<void>;
}
export declare class TaskInterceptNativeEvent {
    taskID: string;
    callable: (task: any) => void;
    constructor(taskID: string, callable: (task: any) => void);
}
export declare class AllTasksIntercept {
    callable: (task: Iterable<any>) => void;
    constructor(callable: (task: Iterable<any>) => void);
}
export declare abstract class CancellableTask<T> extends Task<T> {
    isCanceled: boolean;
    onCancel(): AppEvent<T> | void;
    cancel(): void;
}
//# sourceMappingURL=task.d.ts.map