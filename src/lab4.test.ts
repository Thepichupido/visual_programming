import { describe, expect, it } from 'vitest';
import {
  groupBy,
  having,
  query,
  sort,
  where,
  type Group,
} from './lab4.js';

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

describe('lab4', () => {
  it('where filters by field value', () => {
    const w = where<User>();
    const result = w('name', 'John')(users);

    expect(result).toEqual([
      { id: 1, name: 'John', surname: 'Doe', age: 34, city: 'NY' },
      { id: 2, name: 'John', surname: 'Doe', age: 33, city: 'NY' },
      { id: 3, name: 'John', surname: 'Doe', age: 35, city: 'LA' },
    ]);
  });

  it('sort sorts by selected field', () => {
    const s = sort<User>();
    const result = s('age')(users);

    expect(result.map((u) => u.age)).toEqual([28, 33, 34, 35, 35]);
  });

  it('query combines where + where + sort', () => {
    const w = where<User>();
    const s = sort<User>();

    const search = query<User>(
      w('name', 'John'),
      w('surname', 'Doe'),
      s('age')
    );

    const result = search(users);

    expect(result).toEqual([
      { id: 2, name: 'John', surname: 'Doe', age: 33, city: 'NY' },
      { id: 1, name: 'John', surname: 'Doe', age: 34, city: 'NY' },
      { id: 3, name: 'John', surname: 'Doe', age: 35, city: 'LA' },
    ]);
  });

  it('groupBy groups data by key', () => {
    const g = groupBy<User>();
    const result = g('city')(users);

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
          { id: 5, name: 'Anna', surname: 'Smith', age: 28, city: 'LA' },
        ],
      },
    ]);
  });

  it('having filters groups', () => {
    const g = groupBy<User>();
    const h = having<User>();

    const grouped = g('city')(users);
    const result = h<'city'>((group) => group.items.length > 2)(grouped);

    expect(result).toEqual([
      {
        key: 'LA',
        items: [
          { id: 3, name: 'John', surname: 'Doe', age: 35, city: 'LA' },
          { id: 4, name: 'Mike', surname: 'Doe', age: 35, city: 'LA' },
          { id: 5, name: 'Anna', surname: 'Smith', age: 28, city: 'LA' },
        ],
      },
    ]);
  });

  it('query combines groupBy + having', () => {
    const g = groupBy<User>();
    const h = having<User>();

    const groupAndFilter = query<User>(
      g('city'),
      h<'city'>((group) => group.items.length > 1)
    );

    const result = groupAndFilter(users) as unknown as Group<User, 'city'>[];

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
          { id: 5, name: 'Anna', surname: 'Smith', age: 28, city: 'LA' },
        ],
      },
    ]);
  });

  it('query combines where + groupBy + having', () => {
    const w = where<User>();
    const g = groupBy<User>();
    const h = having<User>();

    const pipeline = query<User>(
      w('surname', 'Doe'),
      g('city'),
      h<'city'>((group) => group.items.some((u) => u.age > 34))
    );

    const result = pipeline(users) as unknown as Group<User, 'city'>[];

    expect(result).toEqual([
      {
        key: 'LA',
        items: [
          { id: 3, name: 'John', surname: 'Doe', age: 35, city: 'LA' },
          { id: 4, name: 'Mike', surname: 'Doe', age: 35, city: 'LA' },
        ],
      },
    ]);
  });

  it('query without steps returns original data', () => {
    const result = query<User>()(users);
    expect(result).toEqual(users);
  });
});