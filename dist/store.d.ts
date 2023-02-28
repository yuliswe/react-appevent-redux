import { AppEvent } from "./event";
import * as Redux from "@reduxjs/toolkit";
import { Event } from "event-target-shim";
import { AppSchedule, AppScheduler } from "./schedule";
export declare class StateChangedNativeEvent<T> extends Event {
    oldState: T | null;
    newState: T;
    reason: string;
    constructor(oldState: T | null, newState: T, reason: string);
}
export declare const APPSTORE_SET_STATE = "APPSTORE_SET_STATE";
export declare class AppStore<T> {
    __type?: string;
    id: string;
    middlewares: Redux.Middleware[];
    private eventTarget;
    private reduxStore;
    static scheduler: AppScheduler<unknown>;
    private taskManager;
    constructor(options: {
        id?: string;
        reduxStore: Redux.EnhancedStore<T>;
        middlewares?: Redux.Middleware[];
    });
    static wrapReducer<T>(reducer: Redux.Reducer<T>): Redux.Reducer<T>;
    listenToStateChange(listener: EventListenerOrEventListenerObject): void;
    addTaskListener(listener: EventListenerOrEventListenerObject): void;
    getState(): T;
    dispatch(event: AppEvent<T>): void;
    dispatchAfterTask(event: AppEvent<T>): void;
    addSchedule(schedule: AppSchedule<T>): void;
    removeSchedule(id: string): void;
    private _waitPromiseHandles?;
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
    waitFor<E extends AppEvent<T>>(eventType: new (...args: any[]) => E): Promise<E>;
}
export declare type AnyStore = AppStore<any>;
//# sourceMappingURL=store.d.ts.map