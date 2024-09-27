// NOTE: Following are codes that haven't been customized will fall back to the general message
// + Related to ZodFunction.implement()
//   - ZodIssueCode.invalid_arguments (Related to ZodFunction.implement())
//   - ZodIssueCode.invalid_return_type (Related to ZodFunction.implement())
// + Unable to locate in doc
//   - ZodIssueCode.invalid_intersection_types
//   - ZodIssueCode.invalid_union_discriminator
// + Won't customize
//   - ZodIssueCode.custom

import type { ZodIssue } from 'zod';
import { ZodIssueCode } from 'zod';

import { isFunction } from '../../is.js';
import { isKeyOf } from '../../object.js';

import getInvalidStringIssueMessage from './types/string.js';
import get2BigOr2SmallIssueMessage from './types/tooBigOrTooSmall.js';

const GENERAL_MESSAGE = '[{{code}}] Something went wrong!';

const CUSTOMIZED_MESSAGES = {
  [ZodIssueCode.invalid_date]: 'Expected a valid date',
  [ZodIssueCode.invalid_enum_value]: 'Expected `{{options}}` but got `{{received}}` instead',
  [ZodIssueCode.invalid_literal]: 'Expected `{{expected}}` but got `{{received}}` instead',
  [ZodIssueCode.invalid_string]: issue => {
    if (issue.code !== ZodIssueCode.invalid_string) return;
    return getInvalidStringIssueMessage(issue);
  },
  [ZodIssueCode.invalid_type]: 'Expected `{{expected}}` but got `{{received}}` instead',
  [ZodIssueCode.invalid_union]: 'Error(s) detected. See `unionErrors` for specifics',
  [ZodIssueCode.not_finite]: 'Expected a finite number',
  [ZodIssueCode.not_multiple_of]: 'Expected the number to be a multiple of `{{multipleOf}}`',
  [ZodIssueCode.too_big]: issue => {
    if (issue.code !== ZodIssueCode.too_big) return;
    return get2BigOr2SmallIssueMessage(issue);
  },
  [ZodIssueCode.too_small]: issue => {
    if (issue.code !== ZodIssueCode.too_small) return;
    return get2BigOr2SmallIssueMessage(issue);
  },
  [ZodIssueCode.unrecognized_keys]: issue => {
    if (issue.code !== ZodIssueCode.unrecognized_keys) return;
    return `Unrecognized key(s) detected: ${issue.keys.map(k => `"${k}"`).join(', ')}`;
  }
} as const satisfies Partial<Record<ZodIssueCode, string | Composer>>;

export const getCustomizedMessage = (code: ZodIssueCode, issue: ZodIssue) => {
  if (!isKeyOf(CUSTOMIZED_MESSAGES, code)) return issue.message || GENERAL_MESSAGE;

  const message = CUSTOMIZED_MESSAGES[code];
  const result = isFunction<Composer>(message) ? message(issue) : message;
  return result || issue.message || GENERAL_MESSAGE;
};

type Composer = (issue: ZodIssue) => string | undefined;
