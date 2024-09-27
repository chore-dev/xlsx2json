import type { StringValidation, ZodInvalidStringIssue } from 'zod';

import { isObject } from '../../../is.js';
import { isKeyOf } from '../../../object.js';
import { replacePlaceholders } from '../../../string.js';

const VALIDATION_MESSAGES = {
  endsWith: 'to end with `{{endsWith}}`',
  includes: 'to include `{{includes}}`',
  startsWith: 'to start with `{{startsWith}}`'
} as const satisfies Partial<Record<Extract<Validation, string>, string>>;

const getInvalidStringIssueMessage = (issue: ZodInvalidStringIssue) => {
  const { message, validation: variables } = issue;

  const hasVariables = isObject(variables);
  const type = hasVariables ? Object.keys(variables)[0] : variables;

  if (!hasVariables) return `Expected a valid \`${type}\``;

  if (type && isKeyOf(VALIDATION_MESSAGES, type)) {
    let message = `Expected the value ${VALIDATION_MESSAGES[type]}`;

    if (hasVariables && 'position' in variables) {
      message += ` at position \`${variables.position}\``;
    }

    return replacePlaceholders(message, hasVariables ? variables : {});
  }

  return message;
};

export default getInvalidStringIssueMessage;

type UnionToIntersection<U> = (U extends unknown ? (k: U) => void : never) extends (
  k: infer I
) => void
  ? I
  : never;

type Validation =
  | Extract<StringValidation, string>
  | Exclude<keyof UnionToIntersection<Exclude<StringValidation, string>>, 'position'>;
