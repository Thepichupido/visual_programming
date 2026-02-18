import { describe, it, expect } from 'vitest';
import {
  createUser,
  createBook,
  calculateArea,
  getStatusColor,
  capitalizeFirst,
  trimAndUpper,
  getFirstElement,
  findById,
} from './lab1.js';

describe('lab1 tests', () => {
  it('createUser default active', () => {
    const u = createUser({ id: 1, name: 'Alice' });
    expect(u.isActive).toBe(true);
  });

  it('createUser with email', () => {
    const u = createUser({ id: 2, name: 'Bob', email: 'a@a.com', isActive: false });
    expect(u.email).toBe('a@a.com');
    expect(u.isActive).toBe(false);
  });

  it('createBook optional year', () => {
    const b = createBook({ title: 'T', author: 'A', genre: 'fiction' });
    expect(b.year).toBeUndefined();
  });

  it('circle area', () => {
    expect(calculateArea('circle', { radius: 2 })).toBeCloseTo(Math.PI * 4);
  });

  it('square area', () => {
    expect(calculateArea('square', { side: 3 })).toBe(9);
  });

  it('status color', () => {
    expect(getStatusColor('active')).toBe('green');
  });

  it('capitalize', () => {
    expect(capitalizeFirst('hello')).toBe('Hello');
  });

  it('trim upper', () => {
    expect(trimAndUpper('  hi  ', true)).toBe('HI');
  });

  it('first element', () => {
    expect(getFirstElement([1, 2, 3])).toBe(1);
  });

  it('find by id', () => {
    const arr = [{ id: 1 }, { id: 2 }];
    expect(findById(arr, 2)).toEqual({ id: 2 });
  });
});
