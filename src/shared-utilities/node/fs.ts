import { existsSync } from 'fs';
import { resolve } from 'path';

import { isString } from '../common/is.js';

export const PWD = (path: string = '') => resolve(process.cwd(), path);

export const pathExists = (path: unknown) => {
  return path && isString(path) ? existsSync(path) : false;
};
