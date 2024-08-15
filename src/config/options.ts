import { z } from 'zod';

const CASE_CONVERSION = [
  'camelCase',
  'constantCase',
  'kebabCase',
  'pascalCase',
  'pascalSnakeCase',
  'snakeCase',
  'trainCase'
] as const;

const allowIncompleteKey: boolean = false;
const caseConversion: (typeof CASE_CONVERSION)[number] | false = 'camelCase';
const enableSheetGroup: boolean = false;
const fallbackValue: string | false = 'VALUE_NOT_FOUND';
const flattenOutput: boolean = false;
const overwriteDuplicateKey: boolean = true;
const parentLookUp: boolean = true;
const separator: string = '.'; // Only effective when flattenOutput is true

const optionalBoolean = (value: boolean) => z.boolean().optional().default(value);

const options = z
  .object({
    allowIncompleteKey: optionalBoolean(allowIncompleteKey),
    caseConversion: z.enum(CASE_CONVERSION).or(z.literal(false)).optional().default(caseConversion),
    enableSheetGroup: optionalBoolean(enableSheetGroup),
    fallbackValue: z.string().or(z.literal(false)).optional().default(fallbackValue),
    flattenOutput: optionalBoolean(flattenOutput),
    overwriteDuplicateKey: optionalBoolean(overwriteDuplicateKey),
    parentLookUp: optionalBoolean(parentLookUp),
    separator: z.string().optional().default(separator)
  })
  .optional()
  .default({
    allowIncompleteKey,
    caseConversion,
    enableSheetGroup,
    fallbackValue,
    flattenOutput,
    overwriteDuplicateKey,
    parentLookUp,
    separator
  });

export default options;
