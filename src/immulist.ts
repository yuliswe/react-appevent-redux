import { mapState, Modifier } from "./immutable";

import type { identifer, Identifiable } from "./identifiable";

export class ImmuList<T extends Identifiable> {
  protected dict: Map<identifer, number>;

  constructor(protected array: T[]) {
    this.dict = new Map();
    for (const [idx, v] of array.entries()) {
      this.dict.set(v.key, idx);
    }
  }

  [Symbol.iterator](): Iterator<T> {
    return this.array[Symbol.iterator]();
  }

  mapItem(targetId: identifer, modifier: Modifier<T>): ImmuList<T> {
    return new ImmuList<T>(
      this.array.map((x: T) => {
        if (x.key === targetId) {
          const oldval: T = x;
          const copy = Object.create(
            Object.getPrototypeOf(oldval)
          ) as typeof oldval;
          Object.assign(copy, oldval);
          for (const k in modifier) {
            const fn = (modifier as any)[k]!;
            (copy as any)[k] = fn((copy as any)[k]);
          }
          return copy;
        } else {
          return x;
        }
      })
    );
  }

  concat(other: Iterable<T>): ImmuList<T> {
    return new ImmuList(this.array.concat(Array.from(other)));
  }

  map<X extends Identifiable>(fn: (x: T) => X): ImmuList<X> {
    return new ImmuList(this.array.map(fn));
  }

  get length() {
    return this.array.length;
  }

  get(id: identifer): T | undefined {
    const idx = this.dict.get(id);
    if (idx === undefined) {
      return undefined;
    } else {
      return this.array[idx];
    }
  }

  at(index: number): T {
    return this.array[index];
  }

  contains(id: identifer): boolean {
    return this.get(id) !== undefined;
  }

  filter(fn: (x: T) => boolean): ImmuList<T> {
    return new ImmuList(this.array.filter(fn));
  }

  find(fn: (x: T) => boolean): T | undefined {
    return this.array.find(fn);
  }

  remove(id: identifer): ImmuList<T> {
    const index = this.indexOf(id);
    let newArray = [...this.array];
    if (index !== undefined) {
      newArray.splice(index, 1);
    }
    return new ImmuList(newArray);
  }

  indexOf(id: identifer): number | undefined {
    const index = this.array.findIndex((e: T) => e.key === id);
    if (index === -1) {
      return undefined;
    } else {
      return index;
    }
  }

  slice(from: number, len?: number) {
    return new ImmuList(this.array.slice(from, len));
  }

  preconcat(other: Iterable<T>): ImmuList<T> {
    return new ImmuList([...other, ...this.array]);
  }

  removeAt(from: number, len: number = 1) {
    let newArray = [...this.array];
    newArray.splice(from, len);
    return new ImmuList(newArray);
  }

  insertAt(from: number, ...items: T[]): ImmuList<T> {
    let newArray = [...this.array];
    newArray.splice(from, 0, ...items);
    return new ImmuList(newArray);
  }

  static build<T extends Identifiable>(
    size: number,
    fn: (idx: number) => T
  ): ImmuList<T> {
    return new ImmuList(new Array(size).fill(0).map((_, idx) => fn(idx)));
  }

  toArray(): Array<T> {
    return this.array;
  }
}

export function immlsModifyItem<Y extends Identifiable>(
  id: identifer,
  modifier: Modifier<Y>
): (x: ImmuList<Y>) => ImmuList<Y> {
  return (x) => x.mapItem(id, modifier);
}

export function immlsConcat<Y extends Identifiable>(
  other: ImmuList<Y>
): (x: ImmuList<Y>) => ImmuList<Y> {
  return (x) => x.concat(other);
}

export function immlsPreconcat<Y extends Identifiable>(
  other: ImmuList<Y>
): (x: ImmuList<Y>) => ImmuList<Y> {
  return (x) => x.preconcat(other);
}

export function immlsMap<X extends Identifiable, Y extends Identifiable = X>(
  fn: (x: X) => Y
): (ls: ImmuList<X>) => ImmuList<Y> {
  return (ls: ImmuList<X>) => ls.map(fn);
}

export function immlsRemove<X extends Identifiable>(
  id: identifer
): (ls: ImmuList<X>) => ImmuList<X> {
  return (ls: ImmuList<X>) => ls.remove(id);
}

export function immlsMapModified<X extends Identifiable>(
  modifier: Modifier<X>
): (ls: ImmuList<X>) => ImmuList<X> {
  return (ls: ImmuList<X>) => ls.map(mapState(modifier));
}

export function immlsFilter<X extends Identifiable>(
  fn: (x: X) => boolean
): (ls: ImmuList<X>) => ImmuList<X> {
  return (ls: ImmuList<X>) => ls.filter(fn);
}

export function immlsRemoveSkeletonConcat<
  X extends { isSkeleton: boolean } & Identifiable
>(newList: Iterable<X>): (ls: ImmuList<X>) => ImmuList<X> {
  return (ls: ImmuList<X>) => ls.filter((x) => !x.isSkeleton).concat(newList);
}

export function immlsRemoveSkeletonPreconcat<
  X extends { isSkeleton: boolean } & Identifiable
>(newList: Iterable<X>): (ls: ImmuList<X>) => ImmuList<X> {
  return (ls: ImmuList<X>) =>
    ls.filter((x) => !x.isSkeleton).preconcat(newList);
}
