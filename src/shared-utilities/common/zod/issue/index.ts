import type { ZodIssue } from 'zod';
import { ZodIssueCode } from 'zod';

import { arrayWrap, stringifyBracketDotNotation } from '../../array.js';
import { replacePlaceholders } from '../../string.js';

import { getCustomizedMessage } from './messages.js';

const translator = (issue: ZodIssue, options: Options) => {
  const { path: _path, ...remaining } = issue;
  const { details, flatten } = options;

  const code = issue.code;

  const message = replacePlaceholders(getCustomizedMessage(code, issue), remaining, {
    array: ' | '
  });
  const path = stringifyBracketDotNotation(_path);

  // Start constructing the return object
  const base = {
    message: `${message}${details ? ` at \`${path}\`` : ''}`,
    path
  };
  if (code === ZodIssueCode.invalid_union) {
    const unionErrors = issue.unionErrors.map(({ issues }) => translateZodIssues(issues, options));

    return [{ code, ...base, unionErrors }, ...(flatten ? unionErrors.flat() : [])];
  } else {
    return [{ code, ...base }];
  }
};

export const translateZodIssues = (
  _issues: ZodIssue | Array<ZodIssue> | undefined,
  options: Options = {}
) => {
  const translated: Array<Translated> = [];

  if (!_issues) return translated;

  arrayWrap(_issues).forEach(issue => translated.push(...translator(issue, options)));

  return translated;
};

type InvalidUnion = typeof ZodIssueCode.invalid_union;

type Options = {
  details?: boolean;
  flatten?: boolean;
};

type Translated = {
  message: string;
  path: string;
} & (
  | {
      code: Exclude<keyof typeof ZodIssueCode, InvalidUnion>;
    }
  | {
      code: InvalidUnion;
      unionErrors: Array<Array<Translated>>;
    }
);
