import type { Config } from '../configs/index.js';

export type Columns = Config['keys'] & Config['values'];

export type Row = Record<string, unknown>;
