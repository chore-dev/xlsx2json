import { ZodIssue, ZodIssueCode } from 'zod';

import { arrayWrap, stringifyBracketDotNotation } from '../../array';
import { isKeyOf } from '../../object';
import { replacePlaceholders } from '../../string';

import { CUSTOMIZED_MESSAGES, GENERAL_MESSAGE, getMessage } from './messages';

const translator = (issue: ZodIssue, options: Options) => {
  const { message: _message, path: _path, ...remaining } = issue;
  const { details, flatten } = options;

  const code = issue.code;
  const path = stringifyBracketDotNotation(_path);

  let message = _message;
  if (isKeyOf(CUSTOMIZED_MESSAGES, code)) {
    message = replacePlaceholders(getMessage(code, issue), remaining, { array: ' | ' });
  }

  const base = {
    message: `${message || GENERAL_MESSAGE}${details ? ` at \`${path}\`` : ''}`,
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
