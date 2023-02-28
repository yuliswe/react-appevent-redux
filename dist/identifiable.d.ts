import * as uuid from "uuid";
export declare type identifer = string;
export interface Identifiable {
    get key(): identifer;
}
export declare const uuid4: (<T extends ArrayLike<number>>(options: uuid.V4Options | null | undefined, buffer: T, offset?: number | undefined) => T) & ((options?: uuid.V4Options | undefined) => string);
//# sourceMappingURL=identifiable.d.ts.map