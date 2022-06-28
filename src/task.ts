import type { AppEvent } from "./event";
import type { Identifiable } from "./identifiable";
import { uuid4 } from "./identifiable";

export type AppEventStream<T> = AsyncIterable<AppEvent<T>>;
/*
An instance of [Task] should encapsulate the data that's required to [run] the task by
storing them in properties. An instance of [Task] can be scheduled by calling
`TaskManager.add(taks)`.
*/
export abstract class Task<T> implements Identifiable {
  taskId: string = uuid4();

  get key() {
    return this.taskId;
  }

  /// Executes the code and broadcasts events to the UI. In most cases, the
  /// implementation of [run] will be asynchronous. Be aware that during the execution
  /// of an async [run] method, the properties of `Task` could be mutated by
  /// interceptions. The mutation allows you to implement things such as cancellation.
  abstract run(state: T): AppEventStream<T>;
}

export interface MockedTask<T> {
  mockedRun(state: T): Promise<void>;
}

/// Intercepts the task manager so that running tasks can be modified.
export class TaskInterceptNativeEvent {
  /// The ID of the Task to be intercepted.
  constructor(public taskID: string, public callable: (task: any) => void) {}
}

export class AllTasksIntercept {
  /// The ID of the Task to be intercepted.
  constructor(public callable: (task: Iterable<any>) => void) {}
}

export abstract class CancellableTask<T> extends Task<T> {
  isCanceled = false;
  onCancel(): AppEvent<T> | void {}
  cancel() {
    this.isCanceled = true;
    this.onCancel();
  }
}
