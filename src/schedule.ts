import { AppEvent } from "./event";

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
enum DispatcherState {
  beforeEvent,
  afterEvent,
}

export type AppScheduleOptions<E> = {
  id: string;
  onTriggered: (action: E) => void;
  once: boolean;
};

export abstract class AppSchedule<T> {
  /// A unique identifier of the schedule. Used to remove the schdule.
  id: string;

  /// The callback to be executed.
  onTriggered: any;

  /// If true then after the callback is triggered, the schedule is
  /// automatically removed.
  once: boolean;

  /// Called before and after each event. If returns true, then the callback is
  /// triggered.
  abstract _shouldRun(
    dispatcherState: DispatcherState,
    action: AppEvent<T>
  ): boolean;

  /// Called after each event. If returns true, then the scheduler is removed.
  abstract _shouldRemove(action: AppEvent<T>): boolean;

  constructor(opts: AppScheduleOptions<any>) {
    this.id = opts.id;
    this.onTriggered = opts.onTriggered;
    this.once = opts.once;
  }

  toString(): string {
    return `${this.constructor.name}("${this.id}")`;
  }
}

export class AfterAnyEvent<T> extends AppSchedule<T> {
  _shouldRun(dispatcherState: DispatcherState, action: AppEvent<T>) {
    return true;
  }
  _shouldRemove(action: AppEvent<T>) {
    return false;
  }
}

export class BeforeAnyEvent<T> extends AppSchedule<T> {
  _shouldRun(dispatcherState: DispatcherState, action: AppEvent<T>) {
    return dispatcherState === DispatcherState.beforeEvent;
  }
  _shouldRemove(action: AppEvent<T>) {
    return false;
  }
}

abstract class _EventOfTypeAppSchedule<E, T> extends AppSchedule<T> {
  constructor(
    protected typeCotr:
      | (new (...args: any[]) => E)
      | (abstract new (...args: any[]) => E),
    opts: AppScheduleOptions<E>
  ) {
    super(opts);
  }

  override toString(): string {
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
export class AfterEventOfType<E, T> extends _EventOfTypeAppSchedule<E, T> {
  _shouldRun(dispatcherState: DispatcherState, action: AppEvent<T>) {
    return (
      action instanceof this.typeCotr &&
      dispatcherState === DispatcherState.afterEvent
    );
  }

  _shouldRemove(action: AppEvent<T>) {
    return action instanceof this.typeCotr && this.once;
  }
}

export class BeforeEventOfType<E, T> extends _EventOfTypeAppSchedule<E, T> {
  _shouldRun(dispatcherState: DispatcherState, action: AppEvent<T>) {
    return (
      action instanceof this.typeCotr &&
      dispatcherState === DispatcherState.beforeEvent
    );
  }

  _shouldRemove(action: AppEvent<T>) {
    return action instanceof this.typeCotr && this.once;
  }
}

export class AppScheduler<T> {
  schedules = new Map<string, AppSchedule<T>>();

  add(schedule: AppSchedule<T>) {
    this.schedules.set(schedule.id, schedule);
  }

  remove(id: string) {
    const schedule = this.schedules.get(id);
    console.debug(`Remove AppSchedule: ${schedule} (${schedule?.id})`);
    this.schedules.delete(id);
  }

  runBeforeEvent(action: AppEvent<T>) {
    for (const schedule of this.schedules.values()) {
      if (schedule._shouldRun(DispatcherState.beforeEvent, action)) {
        console.debug(`AppSchedule: ${schedule}`);
        schedule.onTriggered(action);
      }
    }
  }

  runAfterEvent(action: AppEvent<T>) {
    for (const schedule of this.schedules.values()) {
      if (schedule._shouldRun(DispatcherState.afterEvent, action)) {
        console.debug(`AppSchedule: ${schedule}`);
        schedule.onTriggered(action);
      }
      if (schedule._shouldRemove(action)) {
        console.debug(`Remove AppSchedule: ${schedule}`);
        this.schedules.delete(schedule.id);
      }
    }
  }
}
