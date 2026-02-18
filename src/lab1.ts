export interface User {
  id: number;
  name: string;
  email?: string;
  isActive: boolean;
}

export function createUser(params: {
  id: number;
  name: string;
  email?: string;
  isActive?: boolean;
}): User {
  const user: User = {
    id: params.id,
    name: params.name,
    isActive: params.isActive ?? true,
  };

  if (params.email !== undefined) {
    user.email = params.email;
  }

  return user;
}

export type Genre = 'fiction' | 'non-fiction';

export interface Book {
  title: string;
  author: string;
  year?: number;
  genre: Genre;
}

export function createBook(book: Book): Book {
  const result: Book = {
    title: book.title,
    author: book.author,
    genre: book.genre,
  };

  if (book.year !== undefined) {
    result.year = book.year;
  }

  return result;
}

export function calculateArea(shape: 'circle', params: { radius: number }): number;
export function calculateArea(shape: 'square', params: { side: number }): number;
export function calculateArea(
  shape: 'circle' | 'square',
  params: { radius?: number; side?: number }
): number {
  if (shape === 'circle') {
    const r = params.radius;
    if (typeof r !== 'number') {
      throw new Error('radius is required for circle');
    }
    return Math.PI * r * r;
  }

  const s = params.side;
  if (typeof s !== 'number') {
    throw new Error('side is required for square');
  }
  return s * s;
}

export type Status = 'active' | 'inactive' | 'new';

export function getStatusColor(status: Status): string {
  switch (status) {
    case 'active':
      return 'green';
    case 'inactive':
      return 'gray';
    case 'new':
      return 'blue';
    default: {
      const _exhaustive: never = status;
      return _exhaustive;
    }
  }
}

export type StringFormatter = (value: string, uppercase?: boolean) => string;

export const capitalizeFirst: StringFormatter = (value, uppercase = false) => {
  if (value.length === 0) return value;

  const first = value.charAt(0).toUpperCase();
  const res = first + value.slice(1);

  return uppercase ? res.toUpperCase() : res;
};

export const trimAndUpper: StringFormatter = (value, uppercase = false) => {
  const trimmed = value.trim();
  return uppercase ? trimmed.toUpperCase() : trimmed;
};

export function getFirstElement<T>(arr: T[]): T | undefined {
  return arr.length > 0 ? arr[0] : undefined;
}

export interface HasId {
  id: number;
}

export function findById<T extends HasId>(items: T[], id: number): T | undefined {
  return items.find((x) => x.id === id);
}

