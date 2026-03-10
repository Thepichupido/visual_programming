import { describe, expect, expectTypeOf, it } from 'vitest';
import { groupBy, having, query, sort, where } from './lab5.js';

type User = {
  id: number;
  name: string;
  surname: string;
  age: number;
  city: string;
};

const users: User[] = [
  { id: 1, name: 'John', surname: 'Doe', age: 34, city: 'NY' },
  { id: 2, name: 'John', surname: 'Doe', age: 33, city: 'NY' },
  { id: 3, name: 'John', surname: 'Doe', age: 35, city: 'LA' },
  { id: 4, name: 'Mike', surname: 'Doe', age: 35, city: 'LA' },
  { id: 5, name: 'Anna', surname: 'Smith', age: 28, city: 'LA' },
];

const w = where<User>();
const s = sort<User>();
const g = groupBy<User>();

const q1 = query(
  w('name', 'John'),
  w('surname', 'Doe'),
  s('age')
);

const q2 = query(
  w('surname', 'Doe'),
  g('city')
);

const q3 = query(
  w('surname', 'Doe'),
  g('city'),
  having<User, 'city'>((group) => group.items.length > 1)
);

const q4 = query(
  w('surname', 'Doe'),
  g('city'),
  having<User, 'city'>((group) => group.items.length > 1),
  sort<{ key: User['city']; items: User[] }>()('key')
);

expectTypeOf(q1).parameters.toEqualTypeOf<[User[]]>();
expectTypeOf(q1).returns.toEqualTypeOf<User[]>();

expectTypeOf(q2).parameters.toEqualTypeOf<[User[]]>();
expectTypeOf(q2).returns.toEqualTypeOf<Array<{ key: User['city']; items: User[] }>>();

expectTypeOf(q3).parameters.toEqualTypeOf<[User[]]>();
expectTypeOf(q3).returns.toEqualTypeOf<Array<{ key: User['city']; items: User[] }>>();

expectTypeOf(q4).parameters.toEqualTypeOf<[User[]]>();
expectTypeOf(q4).returns.toEqualTypeOf<Array<{ key: User['city']; items: User[] }>>();

// @ts-expect-error
const bad1 = query(having<User, 'city'>((group) => group.items.length > 1));

// @ts-expect-error
const bad2 = query(s('age'), w('name', 'John'));

// @ts-expect-error
const bad3 = query(g('city'), w('name', 'John'));

// @ts-expect-error
const bad4 = query(s('age'), g('city'));

// @ts-expect-error
const bad5 = query(g('city'), sort<{ key: User['city']; items: User[] }>()('key'), having<User, 'city'>((group) => group.items.length > 1));

describe('lab5', () => {
  it('where + sort works', () => {
    const result = q1(users);

    expect(result).toEqual([
      { id: 2, name: 'John', surname: 'Doe', age: 33, city: 'NY' },
      { id: 1, name: 'John', surname: 'Doe', age: 34, city: 'NY' },
      { id: 3, name: 'John', surname: 'Doe', age: 35, city: 'LA' },
    ]);
  });

  it('where + groupBy works', () => {
    const result = q2(users);

    expect(result).toEqual([
      {
        key: 'NY',
        items: [
          { id: 1, name: 'John', surname: 'Doe', age: 34, city: 'NY' },
          { id: 2, name: 'John', surname: 'Doe', age: 33, city: 'NY' },
        ],
      },
      {
        key: 'LA',
        items: [
          { id: 3, name: 'John', surname: 'Doe', age: 35, city: 'LA' },
          { id: 4, name: 'Mike', surname: 'Doe', age: 35, city: 'LA' },
        ],
      },
    ]);
  });

  it('where + groupBy + having works', () => {
    const result = q3(users);

    expect(result).toEqual([
      {
        key: 'NY',
        items: [
          { id: 1, name: 'John', surname: 'Doe', age: 34, city: 'NY' },
          { id: 2, name: 'John', surname: 'Doe', age: 33, city: 'NY' },
        ],
      },
      {
        key: 'LA',
        items: [
          { id: 3, name: 'John', surname: 'Doe', age: 35, city: 'LA' },
          { id: 4, name: 'Mike', surname: 'Doe', age: 35, city: 'LA' },
        ],
      },
    ]);
  });

  it('where + groupBy + having + sort works', () => {
    const result = q4(users);

    expect(result).toEqual([
      {
        key: 'LA',
        items: [
          { id: 3, name: 'John', surname: 'Doe', age: 35, city: 'LA' },
          { id: 4, name: 'Mike', surname: 'Doe', age: 35, city: 'LA' },
        ],
      },
      {
        key: 'NY',
        items: [
          { id: 1, name: 'John', surname: 'Doe', age: 34, city: 'NY' },
          { id: 2, name: 'John', surname: 'Doe', age: 33, city: 'NY' },
        ],
      },
    ]);
  });

  it('empty query returns original array', () => {
    const result = query<User>()(users);
    expect(result).toEqual(users);
  });
});