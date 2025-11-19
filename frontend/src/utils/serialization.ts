const CAMEL_CASE_REGEX = /[_-](\w)/g;
const SNAKE_CASE_REGEX = /[A-Z]/g;

const toCamelKey = (key: string) => key.replace(CAMEL_CASE_REGEX, (_, char: string) => char.toUpperCase());
const toSnakeKey = (key: string) =>
  key
    .replace(SNAKE_CASE_REGEX, (char) => `_${char.toLowerCase()}`)
    .replace(/^_/, '');

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  Object.prototype.toString.call(value) === '[object Object]';

const isBrowserInstance = (value: unknown, type: 'File' | 'Blob' | 'FormData') => {
  if (type === 'File') return typeof File !== 'undefined' && value instanceof File;
  if (type === 'Blob') return typeof Blob !== 'undefined' && value instanceof Blob;
  if (type === 'FormData') return typeof FormData !== 'undefined' && value instanceof FormData;
  return false;
};

const shouldSkipTransform = (value: unknown) =>
  value instanceof Date ||
  isBrowserInstance(value, 'File') ||
  isBrowserInstance(value, 'Blob') ||
  isBrowserInstance(value, 'FormData');

export const toCamelCase = (input: unknown): unknown => {
  if (Array.isArray(input)) {
    return input.map((item) => toCamelCase(item));
  }
  if (!input || typeof input !== 'object' || shouldSkipTransform(input) || !isPlainObject(input)) {
    return input;
  }

  return Object.entries(input).reduce<Record<string, unknown>>((acc, [key, value]) => {
    acc[toCamelKey(key)] = toCamelCase(value);
    return acc;
  }, {});
};

export const toSnakeCase = (input: unknown): unknown => {
  if (Array.isArray(input)) {
    return input.map((item) => toSnakeCase(item));
  }
  if (!input || typeof input !== 'object' || shouldSkipTransform(input) || !isPlainObject(input)) {
    return input;
  }

  return Object.entries(input).reduce<Record<string, unknown>>((acc, [key, value]) => {
    acc[toSnakeKey(key)] = toSnakeCase(value);
    return acc;
  }, {});
};
