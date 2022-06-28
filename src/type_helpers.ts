// prettier-ignore
type IfEquals<X, Y, A=X, B=never> =
  (<T>() => T extends X ? 1 : 2) extends
  (<T>() => T extends Y ? 1 : 2) ? A : B;

export type WritableKeys<T extends object> = {
  [P in keyof T]-?: IfEquals<
    {
      [Q in P]: T[P];
    },
    {
      -readonly [Q in P]: T[P];
    },
    P,
    never
  >;
}[keyof T];

export type NonFunctionKeys<T extends object> = {
  [K in keyof T]: T[K] extends Function ? never : K;
}[keyof T];
export type FullProps<T extends object> = Pick<
  T,
  Extract<WritableKeys<T>, NonFunctionKeys<T>>
>;
export type PartialProps<T extends object> = Partial<FullProps<T>>;

export function isIterable<T>(obj: any): obj is Iterable<T> {
  // checks for null and undefined
  if (obj === null) {
    return false;
  }
  return typeof obj[Symbol.iterator] === "function" && obj instanceof Object;
}

export function isPlain(val: any): boolean {
  return (
    typeof val === "undefined" ||
    val === null ||
    typeof val === "string" ||
    typeof val === "boolean" ||
    typeof val === "number" ||
    Array.isArray(val) ||
    Object.values(val).map(isPlain).every(Boolean)
  );
}

export type MakeNonNullable<T extends Object, Keys extends keyof T> = Omit<
  T,
  Keys
> &
  NonNullable<Pick<T, Keys>>;
