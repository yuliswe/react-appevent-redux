import type { NonFunctionKeys } from "./type_helpers";
declare type Fn<T> = (arg: T) => T;
export declare type Modifier<T extends object> = {
    [k in NonFunctionKeys<T>]?: Fn<T[k]>;
};
export interface Immutable {
    mapState<X extends this>(modifier: Modifier<X>): this;
}
export declare function isImmutable(x: any): x is Immutable;
export declare function copy<X>(obj: X): X;
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
export declare function mapState<X extends object>(modifier: Modifier<X>): (x: X) => X;
export declare function mapStateOptional<X extends object>(modifier: Modifier<X>, defaultVal: X): (x: X | undefined) => X | undefined;
export declare function copyState<X>(target: X): X;
export declare function to<X, Y extends X>(val: Y): (arg: X) => Y;
export {};
//# sourceMappingURL=immutable.d.ts.map