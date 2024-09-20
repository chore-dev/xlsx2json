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

const DEFAULT_VALUES = {
  ALLOW_INCOMPLETE_KEY: true,
  CASE_CONVERSION: 'camelCase',
  ENABLE_SHEET_GROUP: false,
  FALLBACK_VALUE: 'VALUE_NOT_FOUND',
  FLATTEN_OUTPUT: false,
  OVERWRITE_DUPLICATE_KEY: true,
  PARENT_LOOK_UP: true,
  SEPARATOR: '.'
} as const;

const optionalBoolean = (value: boolean) => z.boolean().optional().default(value);

const options = z
  .object({
    allowIncompleteKey: optionalBoolean(DEFAULT_VALUES.ALLOW_INCOMPLETE_KEY),
    caseConversion: z
      .enum(CASE_CONVERSION)
      .or(z.literal(false))
      .optional()
      .default(DEFAULT_VALUES.CASE_CONVERSION),
    enableSheetGroup: optionalBoolean(DEFAULT_VALUES.ENABLE_SHEET_GROUP),
    fallbackValue: z
      .string()
      .or(z.literal(false))
      .optional()
      .default(DEFAULT_VALUES.FALLBACK_VALUE),
    flattenOutput: optionalBoolean(DEFAULT_VALUES.FLATTEN_OUTPUT),
    overwriteDuplicateKey: optionalBoolean(DEFAULT_VALUES.OVERWRITE_DUPLICATE_KEY),
    parentLookUp: optionalBoolean(DEFAULT_VALUES.PARENT_LOOK_UP),
    separator: z.string().optional().default(DEFAULT_VALUES.SEPARATOR)
  })
  .optional()
  .default({
    allowIncompleteKey: DEFAULT_VALUES.ALLOW_INCOMPLETE_KEY,
    caseConversion: DEFAULT_VALUES.CASE_CONVERSION,
    enableSheetGroup: DEFAULT_VALUES.ENABLE_SHEET_GROUP,
    fallbackValue: DEFAULT_VALUES.FALLBACK_VALUE,
    flattenOutput: DEFAULT_VALUES.FLATTEN_OUTPUT,
    overwriteDuplicateKey: DEFAULT_VALUES.OVERWRITE_DUPLICATE_KEY,
    parentLookUp: DEFAULT_VALUES.PARENT_LOOK_UP,
    separator: DEFAULT_VALUES.SEPARATOR
  });

export default options;
