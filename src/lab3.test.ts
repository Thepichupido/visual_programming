import { describe, it, expect, vi, beforeEach } from 'vitest';
import { csvToJSON, formatCSVFileToJSONFile } from './lab3.js';
import * as fsPromises from 'node:fs/promises';

vi.mock('node:fs/promises', () => {
  return {
    readFile: vi.fn(),
    writeFile: vi.fn(),
  };
});

describe('csvToJSON', () => {
  it('converts csv rows to array of objects', () => {
    const input = ['p1;p2;p3;p4', '1;A;b;c', '2;B;v;d'];

    const result = csvToJSON(input, ';');

    expect(result).toEqual([
      { p1: 1, p2: 'A', p3: 'b', p4: 'c' },
      { p1: 2, p2: 'B', p3: 'v', p4: 'd' },
    ]);
  });

  it('works with another delimiter', () => {
    const input = ['id,name,age', '1,Alice,20', '2,Bob,21'];

    const result = csvToJSON(input, ',');

    expect(result).toEqual([
      { id: 1, name: 'Alice', age: 20 },
      { id: 2, name: 'Bob', age: 21 },
    ]);
  });

  it('throws on empty input', () => {
    expect(() => csvToJSON([], ';')).toThrow();
  });

  it('throws on empty delimiter', () => {
    expect(() => csvToJSON(['a;b', '1;2'], '')).toThrow();
  });

  it('throws on invalid header', () => {
    expect(() => csvToJSON(['a;;c', '1;2;3'], ';')).toThrow();
  });

  it('throws when row has wrong number of columns', () => {
    const input = ['p1;p2;p3', '1;2'];

    expect(() => csvToJSON(input, ';')).toThrow();
  });
});

describe('formatCSVFileToJSONFile', () => {
  const mockedReadFile = vi.mocked(fsPromises.readFile);
  const mockedWriteFile = vi.mocked(fsPromises.writeFile);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('reads csv, converts it and writes json', async () => {
    mockedReadFile.mockResolvedValue('id;name\n1;Alice\n2;Bob' as never);

    await formatCSVFileToJSONFile('input.csv', 'output.json', ';');

    expect(mockedReadFile).toHaveBeenCalledWith('input.csv', 'utf-8');
    expect(mockedWriteFile).toHaveBeenCalledWith(
      'output.json',
      JSON.stringify(
        [
          { id: 1, name: 'Alice' },
          { id: 2, name: 'Bob' },
        ],
        null,
        2
      ),
      'utf-8'
    );
  });

  it('passes readFile error further', async () => {
    mockedReadFile.mockRejectedValue(new Error('read error'));

    await expect(
      formatCSVFileToJSONFile('input.csv', 'output.json', ';')
    ).rejects.toThrow('read error');

    expect(mockedWriteFile).not.toHaveBeenCalled();
  });

  it('throws if csv content is invalid', async () => {
    mockedReadFile.mockResolvedValue('id;name\n1' as never);

    await expect(
      formatCSVFileToJSONFile('input.csv', 'output.json', ';')
    ).rejects.toThrow();

    expect(mockedWriteFile).not.toHaveBeenCalled();
  });
});