export type Transform<T> = (data: T[]) => T[];

export type Where<T extends object> = <K extends keyof T>(
  key: K,
  value: T[K]
) => Transform<T>;

export type Sort<T extends object> = <K extends keyof T>(
  key: K
) => Transform<T>;

export type Group<T extends object, K extends keyof T> = {
  key: T[K];
  items: T[];
};

export type GroupBy<T extends object> = <K extends keyof T>(
  key: K
) => (data: T[]) => Group<T, K>[];

export type GroupTransform<T extends object, K extends keyof T> = (
  groups: Group<T, K>[]
) => Group<T, K>[];

export type Having<T extends object> = <K extends keyof T>(
  predicate: (group: Group<T, K>) => boolean
) => GroupTransform<T, K>;

export const where = <T extends object>(): Where<T> => {
  return (key, value) => (data) => data.filter((item) => item[key] === value);
};

export const sort = <T extends object>(): Sort<T> => {
  return (key) => (data) => {
    return [...data].sort((a, b) => {
      const av = a[key];
      const bv = b[key];

      if (av < bv) return -1;
      if (av > bv) return 1;
      return 0;
    });
  };
};

export const groupBy = <T extends object>(): GroupBy<T> => {
  return (key) => (data) => {
    const map = new Map<T[keyof T], T[]>();

    for (const item of data) {
      const groupKey = item[key];
      const existing = map.get(groupKey);

      if (existing !== undefined) {
        existing.push(item);
      } else {
        map.set(groupKey, [item]);
      }
    }

    const result: Group<T, typeof key>[] = [];

    for (const [groupKey, items] of map.entries()) {
      result.push({
        key: groupKey as T[typeof key],
        items,
      });
    }

    return result;
  };
};

export const having = <T extends object>(): Having<T> => {
  return (predicate) => (groups) => groups.filter(predicate);
};

export function query<T extends object>(
  ...steps: Array<(data: any[]) => any[]>
): Transform<T> {
  return (data: T[]) => {
    return steps.reduce<any[]>((acc, step) => step(acc), data);
  };
}