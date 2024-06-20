import { resolve } from 'path';

export const PWD = (path: string = '') => resolve(process.cwd(), path);
