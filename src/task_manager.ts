import type { AppStore } from "./store";
import type { AllTasksIntercept, Task, TaskInterceptNativeEvent } from "./task";
import { Event } from "event-target-shim";

export class TaskAddedNativeEvent<T> extends Event {
  constructor(public task: Task<T>, public newState: T, public reason: string) {
    super("TaskAddedNativeEvent");
  }
}

export class TaskInterceptAdded extends Event {
  constructor(public intercept: TaskInterceptNativeEvent) {
    super("TaskInterceptAdded");
  }
}
export class AllTasksInterceptAddedNativeEvent extends Event {
  constructor(public allIntercept: AllTasksIntercept) {
    super("AllTasksInterceptAddedNativeEvent");
  }
}

export type TaskManagerOptions = {
  mockTaskRun: boolean;
};
// Task manager running on the main thread
export class TaskManager<T> {
  tasks = new Map<string, Task<T>>();

  public store!: AppStore<T>;
  public mockTaskRun: boolean;

  constructor(options: TaskManagerOptions) {
    this.mockTaskRun = options.mockTaskRun;
  }

  getTaskById(taskID: string): Task<any> | undefined {
    return this.tasks.get(taskID);
  }

  *getTasksByType(taskType: any): Iterable<Task<any>> {
    for (const task of this.tasks.values()) {
      if (task instanceof taskType) {
        yield task;
      }
    }
  }

  listen(store: AppStore<T>) {
    this.store = store;
    this.store.addTaskListener((event) => {
      if (event instanceof TaskAddedNativeEvent) {
        this.onTaskAdded(event);
      } else if (event instanceof TaskInterceptAdded) {
        this.onTaskIntercept(event);
      } else if (event instanceof AllTasksInterceptAddedNativeEvent) {
        this.onAllTasksIntercept(event);
      } else {
        console.error("Unknown type", event);
        throw Error("Unknown type");
      }
    });
  }

  onTaskIntercept(event: TaskInterceptAdded) {
    const targetTask = this.tasks.get(event.intercept.taskID);
    if (targetTask) {
      const toSend = event.intercept.callable(targetTask);
      // if (toSend) {
      //     this.store!.dispatch(toSend)
      // }
    }
  }

  onAllTasksIntercept(event: AllTasksInterceptAddedNativeEvent) {
    const toSend = event.allIntercept.callable(this.tasks.values());
    // if (toSend) {
    //     this.store!.dispatch(toSend)
    // }
  }

  async onTaskAdded(action: TaskAddedNativeEvent<T>) {
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
    } catch (error) {
      console.error("Exception during task", task.constructor.name);
      throw error;
    } finally {
      this.tasks.delete(task.key);
    }
  }
}
