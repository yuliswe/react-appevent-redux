import { uuid4 } from "./identifiable";

import { AppEvent } from "./event";
import { TaskAddedNativeEvent, TaskManager } from "./task_manager";
import * as Redux from "@reduxjs/toolkit";
import { Event, EventTarget } from "event-target-shim";
import { AppSchedule, AppScheduler } from "./schedule";

export class StateChangedNativeEvent<T> extends Event {
  constructor(
    public oldState: T | null,
    public newState: T,
    public reason: string
  ) {
    super("StateChangedNativeEvent");
  }
}

export const APPSTORE_SET_STATE = "APPSTORE_SET_STATE";

export class AppStore<T> {
  __type?: string = "Store";
  id: string = uuid4();
  middlewares: Redux.Middleware[] = [];

  private eventTarget: EventTarget = new EventTarget();
  private reduxStore: Redux.EnhancedStore<T>;
  static scheduler = new AppScheduler<unknown>();
  private taskManager: TaskManager<T>;

  constructor(options: {
    id?: string;
    reduxStore: Redux.EnhancedStore<T>;
    middlewares?: Redux.Middleware[];
  }) {
    this.id = options.id ?? this.id;
    this.middlewares = options.middlewares ?? this.middlewares;
    this.reduxStore = options.reduxStore;
    this.taskManager = new TaskManager({
      mockTaskRun: false,
    });
    this.taskManager.listen(this);
  }

  static wrapReducer<T>(reducer: Redux.Reducer<T>): Redux.Reducer<T> {
    return (state: any, action: any) => {
      let actionName: string = action.type;
      if (actionName.startsWith(APPSTORE_SET_STATE)) {
        return action.state;
      } else {
        return reducer(state, action);
      }
    };
  }

  listenToStateChange(listener: EventListenerOrEventListenerObject) {
    this.eventTarget.addEventListener("StateChangedNativeEvent", listener);
  }

  addTaskListener(listener: EventListenerOrEventListenerObject) {
    this.eventTarget.addEventListener("TaskAddedNativeEvent", listener);
    this.eventTarget.addEventListener("TaskInterceptNativeEvent", listener);
    this.eventTarget.addEventListener(
      "AllTasksInterceptAddedNativeEvent",
      listener
    );
  }

  getState(): T {
    const state = this.reduxStore.getState();
    return state;
  }

  dispatch(event: AppEvent<T>) {
    AppStore.scheduler.runBeforeEvent(event);
    const oldState = this.getState();
    // let newEvent = this.runMiddlewares(oldState, event);
    const newState = event.reducer(oldState);
    // feature: sync a part of the state with url
    // console.info("AppEvent:", event.constructor, event);
    this.eventTarget.dispatchEvent(
      new StateChangedNativeEvent<T>(null, newState, event.__name ?? "?")
    );
    for (const task of event.task(newState, oldState)) {
      this.eventTarget.dispatchEvent(
        new TaskAddedNativeEvent<T>(task, newState, event.__name ?? "?")
      );
    }

    if (this._waitPromiseHandles) {
      if (event instanceof this._waitPromiseHandles.eventType) {
        this._waitPromiseHandles.resolve(event);
      }
    }

    const dispatch = this.reduxStore.dispatch as any;

    dispatch({
      type: APPSTORE_SET_STATE + " " + event.type,
      "appEvent.type": event.type,
      appEvent: event,
      state: newState,
    });

    AppStore.scheduler.runAfterEvent(event);
  }

  dispatchAfterTask(event: AppEvent<T>) {
    const dispatch = this.reduxStore.dispatch as any;
    const oldState = this.getState();
    const newState = event.reduceAfter(oldState);
    dispatch({
      type: `APPSTORE_SET_STATE ${event.type} (reduceAfter)`,
      "appEvent.type": `${event.type} (reduceAfter)`,
      appEvent: event,
      state: newState,
    });
  }

  addSchedule(schedule: AppSchedule<T>) {
    // console.debug("Add schedule", schedule);
    AppStore.scheduler.add(schedule);
  }

  removeSchedule(id: string) {
    AppStore.scheduler.remove(id);
  }

  private _waitPromiseHandles?: {
    eventType: any;
    resolve: (event: any) => void;
    reject: (reason: any) => void;
  };
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
  async waitFor<E extends AppEvent<T>>(
    eventType: new (...args: any[]) => E
  ): Promise<E> {
    return new Promise((resolve, reject) => {
      this._waitPromiseHandles = { eventType, resolve, reject };
    });
  }

  // runMiddlewares(oldState: T, event: AppEvent<T>): AppEvent<T> {
  //   let oldevent = event;
  //   let newEvent = event;
  //   for (let trans of this.middlewares) {
  //     newEvent = trans(newEvent, oldState);
  //   }
  //   if (newEvent === oldevent) {
  //     console.log("Store.dispatch", oldevent);
  //   } else {
  //     console.log("Store.dispatch", oldevent, "transformed to", newEvent);
  //   }
  //   return newEvent;
  // }
}

export type AnyStore = AppStore<any>;
