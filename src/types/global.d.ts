import { Config } from '../configs';

export type Columns = Config['keys'] & Config['values'];

export type Row = Record<string, unknown>;
