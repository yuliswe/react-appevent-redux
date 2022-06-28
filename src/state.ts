import { copyState, Immutable, mapState, Modifier } from "./immutable";
import { isPlain } from "./type_helpers";

export abstract class AppState implements Immutable {
  assignProps(props: any) {
    for (const [key, val] of Object.entries(this)) {
      if (isPlain(val) && props[key] !== undefined) {
        Object.defineProperty(this, key, {
          get: () => props[key],
        });
      }
    }
  }

  mapState<X extends this>(modifier: Modifier<X>): X {
    return mapState(modifier)(this as X);
  }

  copy(): this {
    return copyState(this);
  }
}
