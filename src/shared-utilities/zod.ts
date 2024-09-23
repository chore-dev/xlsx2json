import { z, ZodIssue } from 'zod';
import { ZodIssueBase } from 'zod/lib/ZodError';

import { replacePlaceholders } from './common/string';

const SOMETHING_WENT_WRONG = 'Something went wrong(code: {{code}})!';

const ISSUE_CODES: Record<ZodIssueCode, string> = {
  custom: SOMETHING_WENT_WRONG,
  invalid_arguments: SOMETHING_WENT_WRONG,
  invalid_date: 'Invalid date',
  invalid_enum_value: 'Expected `{{options}}` but got `{{received}}`',
  invalid_intersection_types: SOMETHING_WENT_WRONG,
  invalid_literal: SOMETHING_WENT_WRONG,
  invalid_return_type: SOMETHING_WENT_WRONG,
  invalid_string: 'Invalid {{validation}}',
  invalid_type: 'Expected `{{expected}}` but got `{{received}}`',
  invalid_union: SOMETHING_WENT_WRONG,
  invalid_union_discriminator: SOMETHING_WENT_WRONG,
  not_finite: 'Expected a finite number, but got Infinity or -Infinity',
  not_multiple_of: 'Expected the number to be multiple of {{multipleOf}}',
  too_big: 'The number is too big',
  too_small: 'The number is too small',
  unrecognized_keys: 'Unexpected keys in object: {{keys}}'
};

const createPath = (paths: ZodIssueBase['path']) => {
  return paths
    .map((path, i) => {
      const isNumber = typeof path === 'number';
      const needDot = !isNumber && i !== 0;

      return `${needDot ? '.' : ''}${isNumber ? `[${path}]` : path}`;
    })
    .join('');
};

export const flattenIssues = (issues: Array<ZodIssue>): Array<ZodIssue> => {
  return issues
    .map(issue => {
      if (issue.code !== 'invalid_union') return issue;

      return issue.unionErrors.map(({ issues }) => flattenIssues(issues)).flat();
    })
    .flat();
};

export const getZodIssueMessage = (issue: ZodIssue) => {
  const { code, path, ...remaining } = issue;

  const message = ISSUE_CODES[code] || SOMETHING_WENT_WRONG;

  let pathString = createPath(path);
  pathString = pathString ? ` at \`${pathString}\`` : '';

  return `${replacePlaceholders(message, { code, ...remaining })}${pathString}`;
};

type ZodIssueCode = (typeof z.ZodIssueCode)[keyof typeof z.ZodIssueCode];
