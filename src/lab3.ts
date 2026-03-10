import { readFile, writeFile } from 'node:fs/promises';

export function csvToJSON(input: string[], delimiter: string): object[] {
  if (!Array.isArray(input) || input.length === 0) {
    throw new Error('Input must contain at least header row');
  }

  if (typeof delimiter !== 'string' || delimiter.length === 0) {
    throw new Error('Delimiter must be a non-empty string');
  }

  const header = input[0]?.split(delimiter);

  if (!header || header.length === 0 || header.some((item) => item === '')) {
    throw new Error('Invalid header');
  }

  const result: object[] = [];

for (let i = 1; i < input.length; i++) {
  const row = input[i];

  if (row === undefined) {
    throw new Error('Invalid row');
  }

  const values = row.split(delimiter);

    if (values.length !== header.length) {
      throw new Error('Invalid number of columns');
    }

    const obj: Record<string, string | number> = {};

    for (let j = 0; j < header.length; j++) {
      const key = header[j];
      const value = values[j];

      if (key === undefined || value === undefined) {
        throw new Error('Invalid row data');
      }

      if (/^-?\d+(\.\d+)?$/.test(value)) {
        obj[key] = Number(value);
      } else {
        obj[key] = value;
      }
    }

    result.push(obj);
  }

  return result;
}

export async function formatCSVFileToJSONFile(
  input: string,
  output: string,
  delimiter: string
): Promise<void> {
  const fileContent = await readFile(input, 'utf-8');
  const lines = fileContent
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  const json = csvToJSON(lines, delimiter);

  await writeFile(output, JSON.stringify(json, null, 2), 'utf-8');
}