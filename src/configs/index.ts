import { z } from 'zod';

import columns from './columns.js';
import ignores from './ignores.js';
import options from './options.js';

const Schema = z.object({
  ignores,
  input: z.string().endsWith('.xlsx').or(z.string().endsWith('.xls')),
  keys: columns,
  options,
  outputDir: z.string(),
  values: columns
});

export default Schema;

export type Config = z.input<typeof Schema>;

export type Configs = Array<Config>;
