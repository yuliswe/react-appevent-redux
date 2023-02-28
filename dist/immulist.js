"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.immlsRemoveSkeletonPreconcat = exports.immlsRemoveSkeletonConcat = exports.immlsFilter = exports.immlsMapModified = exports.immlsRemove = exports.immlsMap = exports.immlsPreconcat = exports.immlsConcat = exports.immlsModifyItem = exports.ImmuList = void 0;
const immutable_1 = require("./immutable");
class ImmuList {
    constructor(array) {
        this.array = array;
        this.dict = new Map();
        for (const [idx, v] of array.entries()) {
            this.dict.set(v.key, idx);
        }
    }
    [Symbol.iterator]() {
        return this.array[Symbol.iterator]();
    }
    mapItem(targetId, modifier) {
        return new ImmuList(this.array.map((x) => {
            if (x.key === targetId) {
                const oldval = x;
                const copy = Object.create(Object.getPrototypeOf(oldval));
                Object.assign(copy, oldval);
                for (const k in modifier) {
                    const fn = modifier[k];
                    copy[k] = fn(copy[k]);
                }
                return copy;
            }
            else {
                return x;
            }
        }));
    }
    concat(other) {
        return new ImmuList(this.array.concat(Array.from(other)));
    }
    map(fn) {
        return new ImmuList(this.array.map(fn));
    }
    get length() {
        return this.array.length;
    }
    get(id) {
        const idx = this.dict.get(id);
        if (idx === undefined) {
            return undefined;
        }
        else {
            return this.array[idx];
        }
    }
    at(index) {
        return this.array[index];
    }
    contains(id) {
        return this.get(id) !== undefined;
    }
    filter(fn) {
        return new ImmuList(this.array.filter(fn));
    }
    find(fn) {
        return this.array.find(fn);
    }
    remove(id) {
        const index = this.indexOf(id);
        let newArray = [...this.array];
        if (index !== undefined) {
            newArray.splice(index, 1);
        }
        return new ImmuList(newArray);
    }
    indexOf(id) {
        const index = this.array.findIndex((e) => e.key === id);
        if (index === -1) {
            return undefined;
        }
        else {
            return index;
        }
    }
    slice(from, len) {
        return new ImmuList(this.array.slice(from, len));
    }
    preconcat(other) {
        return new ImmuList([...other, ...this.array]);
    }
    removeAt(from, len = 1) {
        let newArray = [...this.array];
        newArray.splice(from, len);
        return new ImmuList(newArray);
    }
    insertAt(from, ...items) {
        let newArray = [...this.array];
        newArray.splice(from, 0, ...items);
        return new ImmuList(newArray);
    }
    static build(size, fn) {
        return new ImmuList(new Array(size).fill(0).map((_, idx) => fn(idx)));
    }
    toArray() {
        return this.array;
    }
}
exports.ImmuList = ImmuList;
function immlsModifyItem(id, modifier) {
    return (x) => x.mapItem(id, modifier);
}
exports.immlsModifyItem = immlsModifyItem;
function immlsConcat(other) {
    return (x) => x.concat(other);
}
exports.immlsConcat = immlsConcat;
function immlsPreconcat(other) {
    return (x) => x.preconcat(other);
}
exports.immlsPreconcat = immlsPreconcat;
function immlsMap(fn) {
    return (ls) => ls.map(fn);
}
exports.immlsMap = immlsMap;
function immlsRemove(id) {
    return (ls) => ls.remove(id);
}
exports.immlsRemove = immlsRemove;
function immlsMapModified(modifier) {
    return (ls) => ls.map((0, immutable_1.mapState)(modifier));
}
exports.immlsMapModified = immlsMapModified;
function immlsFilter(fn) {
    return (ls) => ls.filter(fn);
}
exports.immlsFilter = immlsFilter;
function immlsRemoveSkeletonConcat(newList) {
    return (ls) => ls.filter((x) => !x.isSkeleton).concat(newList);
}
exports.immlsRemoveSkeletonConcat = immlsRemoveSkeletonConcat;
function immlsRemoveSkeletonPreconcat(newList) {
    return (ls) => ls.filter((x) => !x.isSkeleton).preconcat(newList);
}
exports.immlsRemoveSkeletonPreconcat = immlsRemoveSkeletonPreconcat;
//# sourceMappingURL=immulist.js.map