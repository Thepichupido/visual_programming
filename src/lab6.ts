export type DeepReadonly<T> =
  T extends Function
    ? T
    : T extends object
      ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
      : T;

export type PickedByType<T, U> = {
  [K in keyof T as T[K] extends U ? K : never]: T[K]
};

export type EventHandlers<T> = {
  [K in keyof T as `on${Capitalize<string & K>}`]: (event: T[K]) => void
};