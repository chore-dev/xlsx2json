import { z } from 'zod';

const ignores = z
  .object({
    rows: z.array(z.number()).optional().default([]),
    sheets: z.array(z.string()).optional().default([])
  })
  .optional()
  .default({ rows: [], sheets: [] });

export default ignores;
