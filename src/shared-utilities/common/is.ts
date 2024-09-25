// NOTE: This file SHOULD NOT import ANY external functions, EVER!!!

import { ObjectLike } from '../types/common';

export const isArray = (input: unknown): input is Array<unknown> => {
  return Array.isArray(input);
};

export const isFunction = <Expected = (...args: unknown[]) => unknown>(
  input: unknown
): input is Expected => {
  return typeof input === 'function';
};

export const isNumber = (input: unknown): input is number => typeof input === 'number';

export const isObject = (input: unknown): input is ObjectLike => {
  return typeof input === 'object' && !Array.isArray(input) && input !== null;
};

export const isString = (input: unknown): input is string => {
  return typeof input === 'string';
};
