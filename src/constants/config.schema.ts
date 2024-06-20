import { z } from 'zod';

const ConfigSchema = z.object({
  ignores: z
    .object({
      columns: z.array(z.number()).optional().default([]),
      rows: z.array(z.number()).optional().default([]),
      sheets: z.array(z.string()).optional().default([])
    })
    .optional()
    .default({ columns: [], rows: [], sheets: [] }),
  input: z.string().endsWith('.xlsx').or(z.string().endsWith('.xls')),
  keys: z.array(z.string()).min(1),
  outputDir: z.string(),
  values: z.array(z.string()).min(1)
});

export default ConfigSchema;
