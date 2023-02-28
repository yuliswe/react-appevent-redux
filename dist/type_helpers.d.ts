declare type IfEquals<X, Y, A = X, B = never> = (<T>() => T extends X ? 1 : 2) extends (<T>() => T extends Y ? 1 : 2) ? A : B;
export declare type WritableKeys<T extends object> = {
    [P in keyof T]-?: IfEquals<{
        [Q in P]: T[P];
    }, {
        -readonly [Q in P]: T[P];
    }, P, never>;
}[keyof T];
export declare type NonFunctionKeys<T extends object> = {
    [K in keyof T]: T[K] extends Function ? never : K;
}[keyof T];
export declare type FullProps<T extends object> = Pick<T, Extract<WritableKeys<T>, NonFunctionKeys<T>>>;
export declare type PartialProps<T extends object> = Partial<FullProps<T>>;
export declare function isIterable<T>(obj: any): obj is Iterable<T>;
export declare function isPlain(val: any): boolean;
export declare type MakeNonNullable<T extends Object, Keys extends keyof T> = Omit<T, Keys> & NonNullable<Pick<T, Keys>>;
export {};
//# sourceMappingURL=type_helpers.d.ts.map