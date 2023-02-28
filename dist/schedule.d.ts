import { AppEvent } from "./event";
declare enum DispatcherState {
    beforeEvent = 0,
    afterEvent = 1
}
export declare type AppScheduleOptions<E> = {
    id: string;
    onTriggered: (action: E) => void;
    once: boolean;
};
export declare abstract class AppSchedule<T> {
    id: string;
    onTriggered: any;
    once: boolean;
    abstract _shouldRun(dispatcherState: DispatcherState, action: AppEvent<T>): boolean;
    abstract _shouldRemove(action: AppEvent<T>): boolean;
    constructor(opts: AppScheduleOptions<any>);
    toString(): string;
}
export declare class AfterAnyEvent<T> extends AppSchedule<T> {
    _shouldRun(dispatcherState: DispatcherState, action: AppEvent<T>): boolean;
    _shouldRemove(action: AppEvent<T>): boolean;
}
export declare class BeforeAnyEvent<T> extends AppSchedule<T> {
    _shouldRun(dispatcherState: DispatcherState, action: AppEvent<T>): boolean;
    _shouldRemove(action: AppEvent<T>): boolean;
}
declare abstract class _EventOfTypeAppSchedule<E, T> extends AppSchedule<T> {
    protected typeCotr: (new (...args: any[]) => E) | (abstract new (...args: any[]) => E);
    constructor(typeCotr: (new (...args: any[]) => E) | (abstract new (...args: any[]) => E), opts: AppScheduleOptions<E>);
    toString(): string;
}
export declare class AfterEventOfType<E, T> extends _EventOfTypeAppSchedule<E, T> {
    _shouldRun(dispatcherState: DispatcherState, action: AppEvent<T>): boolean;
    _shouldRemove(action: AppEvent<T>): boolean;
}
export declare class BeforeEventOfType<E, T> extends _EventOfTypeAppSchedule<E, T> {
    _shouldRun(dispatcherState: DispatcherState, action: AppEvent<T>): boolean;
    _shouldRemove(action: AppEvent<T>): boolean;
}
export declare class AppScheduler<T> {
    schedules: Map<string, AppSchedule<T>>;
    add(schedule: AppSchedule<T>): void;
    remove(id: string): void;
    runBeforeEvent(action: AppEvent<T>): void;
    runAfterEvent(action: AppEvent<T>): void;
}
export {};
//# sourceMappingURL=schedule.d.ts.map