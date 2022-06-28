import type { NonFunctionKeys } from "./type_helpers";
type Fn<T> = (arg: T) => T;
export type Modifier<T extends object> = {
  [k in NonFunctionKeys<T>]?: Fn<T[k]>;
};

export interface Immutable {
  mapState<X extends this>(modifier: Modifier<X>): this;
}

export function isImmutable(x: any): x is Immutable {
  return x["copyWith"] !== undefined;
}

export function copy<X>(obj: X): X {
  if (obj instanceof Object) {
    const copy = Object.create(Object.getPrototypeOf(obj));
    Object.assign(copy, obj);
    return copy;
  } else {
    return obj;
  }
}

/**
 * Short-hand for chaining modifiers. So instead of writing:
 *
 *      state.copyWith({
 *           parent: (parent) => parent.m({
 *               child: (child) => child.m({
 *                   childprop: (childprop) => true
 *               })
 *           })
 *      })
 *
 * You can write
 *
 *      state.copyWith({
 *           parent: modify<ParentType>({
 *               child: modify<ChildType>({
 *                   childprop: to(true)
 *               })
 *           })
 *      })
 *
 * @param modifier
 * @returns
 */
export function mapState<X extends object>(modifier: Modifier<X>): (x: X) => X {
  return (x) => {
    const copy: any = copyState(x);
    for (const k in modifier) {
      const fn = (modifier as any)[k];
      const newVal = fn((x as any)[k]);
      copy[k] = newVal;
    }
    return copy;
  };
}

export function mapStateOptional<X extends object>(
  modifier: Modifier<X>,
  defaultVal: X
): (x: X | undefined) => X | undefined {
  return (x) => mapState(modifier)(x ?? defaultVal);
}

export function copyState<X>(target: X): X {
  const copy = Object.create(Object.getPrototypeOf(target));
  Object.assign(copy, target);
  return copy;
}

export function to<X, Y extends X>(val: Y): (arg: X) => Y {
  return (_) => val;
}
