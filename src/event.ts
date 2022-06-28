import { AppEventStream, Task as AppTask } from "./task";

export abstract class AppEvent<T> extends AppTask<T> {
  type: string;

  get __name(): string {
    return this.type;
  }

  constructor() {
    super();
    this.type = this.constructor.name;
  }
  abstract reducer(state: T): T;
  *task(newState: T, oldState: T): Iterable<AppTask<T>> {
    yield this;
  }
  jsEvent(): Event {
    return new Event(this.constructor.name);
  }

  toString(): string {
    return `${this.constructor.name}`;
  }
}

export class NativeReduxEvent<T> extends AppEvent<T> {
  constructor(public name: string) {
    super();
  }

  reducer(state: T): T {
    return state;
  }

  async *run(state: T): AppEventStream<T> {}
}

export class InitAppEvent<T> extends AppEvent<T> {
  reducer(state: T): T {
    return state;
  }
  async *run(state: T): AppEventStream<T> {}
}
