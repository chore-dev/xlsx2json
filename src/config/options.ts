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

const ALLOW_INCOMPLETE_KEY_DEFAULT_VALUE: boolean = true;
const CASE_CONVERSION_DEFAULT_VALUE: (typeof CASE_CONVERSION)[number] | false = 'camelCase';
const ENABLE_SHEET_GROUP_DEFAULT_VALUE: boolean = false;
const FALLBACK_VALUE_DEFAULT_VALUE: string | false = 'VALUE_NOT_FOUND';
const FLATTEN_OUTPUT_DEFAULT_VALUE: boolean = false;
const OVERWRITE_DUPLICATE_KEY_DEFAULT_VALUE: boolean = true;
const PARENT_LOOK_UP_DEFAULT_VALUE: boolean = true;
const SEPARATOR_DEFAULT_VALUE: string = '.'; // Only effective when flattenOutput is true

const optionalBoolean = (value: boolean) => z.boolean().optional().default(value);

const options = z
  .object({
    allowIncompleteKey: optionalBoolean(ALLOW_INCOMPLETE_KEY_DEFAULT_VALUE),
    caseConversion: z
      .enum(CASE_CONVERSION)
      .or(z.literal(false))
      .optional()
      .default(CASE_CONVERSION_DEFAULT_VALUE),
    enableSheetGroup: optionalBoolean(ENABLE_SHEET_GROUP_DEFAULT_VALUE),
    fallbackValue: z.string().or(z.literal(false)).optional().default(FALLBACK_VALUE_DEFAULT_VALUE),
    flattenOutput: optionalBoolean(FLATTEN_OUTPUT_DEFAULT_VALUE),
    overwriteDuplicateKey: optionalBoolean(OVERWRITE_DUPLICATE_KEY_DEFAULT_VALUE),
    parentLookUp: optionalBoolean(PARENT_LOOK_UP_DEFAULT_VALUE),
    separator: z.string().optional().default(SEPARATOR_DEFAULT_VALUE)
  })
  .optional()
  .default({
    allowIncompleteKey: ALLOW_INCOMPLETE_KEY_DEFAULT_VALUE,
    caseConversion: CASE_CONVERSION_DEFAULT_VALUE,
    enableSheetGroup: ENABLE_SHEET_GROUP_DEFAULT_VALUE,
    fallbackValue: FALLBACK_VALUE_DEFAULT_VALUE,
    flattenOutput: FLATTEN_OUTPUT_DEFAULT_VALUE,
    overwriteDuplicateKey: OVERWRITE_DUPLICATE_KEY_DEFAULT_VALUE,
    parentLookUp: PARENT_LOOK_UP_DEFAULT_VALUE,
    separator: SEPARATOR_DEFAULT_VALUE
  });

export default options;
