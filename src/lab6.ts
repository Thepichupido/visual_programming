export type DeepReadonly<T> =
  T extends (...args: any[]) => any
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

export type AggregateOp<T, R> = {
  kind: "aggregate"
  fn: (items: T[]) => R
};

export function count<T>(): AggregateOp<T, number> {
  return {
    kind: "aggregate",
    fn: (items: T[]) => items.length
  };
}

export function query<T, R>(
  items: T[],
  op: AggregateOp<T, R>
): R {
  return op.fn(items);
}