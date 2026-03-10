export type Transform<I, O = I> = (data: I[]) => O[];

export type Group<T extends object, K extends keyof T> = {
  key: T[K];
  items: T[];
};

type Op<I, O, K extends string> = {
  kind: K;
  apply: Transform<I, O>;
};

export type WhereOp<T extends object> = Op<T, T, 'where'>;
export type SortOp<T extends object> = Op<T, T, 'sort'>;
export type GroupByOp<T extends object, K extends keyof T> = Op<
  T,
  Group<T, K>,
  'groupBy'
>;
export type HavingOp<T extends object, K extends keyof T> = Op<
  Group<T, K>,
  Group<T, K>,
  'having'
>;

export type WhereFactory<T extends object> = <K extends keyof T>(
  key: K,
  value: T[K]
) => WhereOp<T>;

export type SortFactory<T extends object> = <K extends keyof T>(
  key: K
) => SortOp<T>;

export type GroupByFactory<T extends object> = <K extends keyof T>(
  key: K
) => GroupByOp<T, K>;

export const where = <T extends object>(): WhereFactory<T> => {
  return (key, value) => ({
    kind: 'where',
    apply: (data) => data.filter((item) => item[key] === value),
  });
};

export const sort = <T extends object>(): SortFactory<T> => {
  return (key) => ({
    kind: 'sort',
    apply: (data) => {
      return [...data].sort((a, b) => {
        const av = a[key] as string | number | boolean;
        const bv = b[key] as string | number | boolean;

        if (av < bv) return -1;
        if (av > bv) return 1;
        return 0;
      });
    },
  });
};

export const groupBy = <T extends object>(): GroupByFactory<T> => {
  return <K extends keyof T>(key: K): GroupByOp<T, K> => ({
    kind: 'groupBy',
    apply: (data) => {
      const map = new Map<T[K], T[]>();

      for (const item of data) {
        const groupKey = item[key];
        const existing = map.get(groupKey);

        if (existing !== undefined) {
          existing.push(item);
        } else {
          map.set(groupKey, [item]);
        }
      }

      const result: Group<T, K>[] = [];

      for (const [groupKey, items] of map.entries()) {
        result.push({
          key: groupKey,
          items,
        });
      }

      return result;
    },
  });
};

export function having<T extends object, K extends keyof T>(
  predicate: (group: Group<T, K>) => boolean
): HavingOp<T, K> {
  return {
    kind: 'having',
    apply: (groups) => groups.filter(predicate),
  };
}

export function query<T extends object>(): Transform<T, T>;

export function query<T extends object>(
  op1: WhereOp<T>
): Transform<T, T>;
export function query<T extends object>(
  op1: SortOp<T>
): Transform<T, T>;
export function query<T extends object>(
  op1: WhereOp<T>,
  op2: WhereOp<T>
): Transform<T, T>;
export function query<T extends object>(
  op1: WhereOp<T>,
  op2: SortOp<T>
): Transform<T, T>;
export function query<T extends object>(
  op1: SortOp<T>,
  op2: SortOp<T>
): Transform<T, T>;
export function query<T extends object>(
  op1: WhereOp<T>,
  op2: WhereOp<T>,
  op3: SortOp<T>
): Transform<T, T>;

export function query<T extends object, K extends keyof T>(
  op1: GroupByOp<T, K>
): Transform<T, Group<T, K>>;
export function query<T extends object, K extends keyof T>(
  op1: WhereOp<T>,
  op2: GroupByOp<T, K>
): Transform<T, Group<T, K>>;
export function query<T extends object, K extends keyof T>(
  op1: GroupByOp<T, K>,
  op2: HavingOp<T, K>
): Transform<T, Group<T, K>>;
export function query<T extends object, K extends keyof T>(
  op1: WhereOp<T>,
  op2: GroupByOp<T, K>,
  op3: HavingOp<T, K>
): Transform<T, Group<T, K>>;
export function query<T extends object, K extends keyof T>(
  op1: GroupByOp<T, K>,
  op2: SortOp<Group<T, K>>
): Transform<T, Group<T, K>>;
export function query<T extends object, K extends keyof T>(
  op1: WhereOp<T>,
  op2: GroupByOp<T, K>,
  op3: SortOp<Group<T, K>>
): Transform<T, Group<T, K>>;
export function query<T extends object, K extends keyof T>(
  op1: GroupByOp<T, K>,
  op2: HavingOp<T, K>,
  op3: SortOp<Group<T, K>>
): Transform<T, Group<T, K>>;
export function query<T extends object, K extends keyof T>(
  op1: WhereOp<T>,
  op2: GroupByOp<T, K>,
  op3: HavingOp<T, K>,
  op4: SortOp<Group<T, K>>
): Transform<T, Group<T, K>>;

export function query(
  ...ops: Array<{ apply: (data: any[]) => any[] }>
): (data: any[]) => any[] {
  return (data: any[]) => ops.reduce((acc, op) => op.apply(acc), data);
}