import { z } from 'zod';

import columns from './columns';
import ignores from './ignores';
import options from './options';

const Schema = z.object({
  ignores,
  input: z.string().endsWith('.xlsx').or(z.string().endsWith('.xls')),
  keys: columns,
  options,
  outputDir: z.string(),
  values: columns
});

export default Schema;
