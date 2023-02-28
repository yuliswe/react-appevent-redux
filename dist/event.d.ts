import { AppEventStream, Task as AppTask } from "./task";
export declare abstract class AppEvent<T> extends AppTask<T> {
    type: string;
    get __name(): string;
    constructor();
    abstract reducer(state: T): T;
    task(newState: T, oldState: T): Iterable<AppTask<T>>;
    reduceAfter(state: T): T;
    jsEvent(): Event;
    toString(): string;
}
export declare class NativeReduxEvent<T> extends AppEvent<T> {
    name: string;
    constructor(name: string);
    reducer(state: T): T;
    run(state: T): AppEventStream<T>;
}
export declare class InitAppEvent<T> extends AppEvent<T> {
    reducer(state: T): T;
    run(state: T): AppEventStream<T>;
}
//# sourceMappingURL=event.d.ts.map