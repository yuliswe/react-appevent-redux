import { Modifier } from "./immutable";
import type { identifer, Identifiable } from "./identifiable";
export declare class ImmuList<T extends Identifiable> {
    protected array: T[];
    protected dict: Map<identifer, number>;
    constructor(array: T[]);
    [Symbol.iterator](): Iterator<T>;
    mapItem(targetId: identifer, modifier: Modifier<T>): ImmuList<T>;
    concat(other: Iterable<T>): ImmuList<T>;
    map<X extends Identifiable>(fn: (x: T) => X): ImmuList<X>;
    get length(): number;
    get(id: identifer): T | undefined;
    at(index: number): T;
    contains(id: identifer): boolean;
    filter(fn: (x: T) => boolean): ImmuList<T>;
    find(fn: (x: T) => boolean): T | undefined;
    remove(id: identifer): ImmuList<T>;
    indexOf(id: identifer): number | undefined;
    slice(from: number, len?: number): ImmuList<T>;
    preconcat(other: Iterable<T>): ImmuList<T>;
    removeAt(from: number, len?: number): ImmuList<T>;
    insertAt(from: number, ...items: T[]): ImmuList<T>;
    static build<T extends Identifiable>(size: number, fn: (idx: number) => T): ImmuList<T>;
    toArray(): Array<T>;
}
export declare function immlsModifyItem<Y extends Identifiable>(id: identifer, modifier: Modifier<Y>): (x: ImmuList<Y>) => ImmuList<Y>;
export declare function immlsConcat<Y extends Identifiable>(other: ImmuList<Y>): (x: ImmuList<Y>) => ImmuList<Y>;
export declare function immlsPreconcat<Y extends Identifiable>(other: ImmuList<Y>): (x: ImmuList<Y>) => ImmuList<Y>;
export declare function immlsMap<X extends Identifiable, Y extends Identifiable = X>(fn: (x: X) => Y): (ls: ImmuList<X>) => ImmuList<Y>;
export declare function immlsRemove<X extends Identifiable>(id: identifer): (ls: ImmuList<X>) => ImmuList<X>;
export declare function immlsMapModified<X extends Identifiable>(modifier: Modifier<X>): (ls: ImmuList<X>) => ImmuList<X>;
export declare function immlsFilter<X extends Identifiable>(fn: (x: X) => boolean): (ls: ImmuList<X>) => ImmuList<X>;
export declare function immlsRemoveSkeletonConcat<X extends {
    isSkeleton: boolean;
} & Identifiable>(newList: Iterable<X>): (ls: ImmuList<X>) => ImmuList<X>;
export declare function immlsRemoveSkeletonPreconcat<X extends {
    isSkeleton: boolean;
} & Identifiable>(newList: Iterable<X>): (ls: ImmuList<X>) => ImmuList<X>;
//# sourceMappingURL=immulist.d.ts.map