import { z } from 'zod';

import options from './options';

const columns = z.array(z.string()).min(1);

const ignores = z
  .object({
    rows: z.array(z.number()).optional().default([]),
    sheets: z.array(z.string()).optional().default([])
  })
  .optional()
  .default({ rows: [], sheets: [] });

const Schema = z.object({
  ignores,
  input: z.string().endsWith('.xlsx').or(z.string().endsWith('.xls')),
  keys: columns,
  options,
  outputDir: z.string(),
  values: columns
});

export default Schema;
