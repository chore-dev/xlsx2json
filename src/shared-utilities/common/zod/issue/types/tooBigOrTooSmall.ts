import { ZodIssueCode, type ZodTooBigIssue, type ZodTooSmallIssue } from 'zod';

import { isKeyOf } from '../../../object';

const UNIT = {
  array: 'length',
  set: 'size',
  string: 'length'
};

const getBody = (exact: boolean, inclusive: boolean, isDate: boolean, tooBig: boolean) => {
  if (exact) return 'exactly';

  const inclusiveSuffix = ` ${isDate ? 'or on' : 'or equal to'}`;

  let body;

  if (isDate) {
    if (tooBig) {
      body = 'after';
    } else {
      body = 'before';
    }
  } else {
    if (tooBig) {
      body = 'less than';
    } else {
      body = 'greater than';
    }
  }

  return `${body}${inclusive ? inclusiveSuffix : ''}`;
};

const get2BigOr2SmallIssueMessage = (issue: RangeIssue) => {
  const { code, exact, inclusive, type } = issue;
  const isTooBig = code === ZodIssueCode.too_big;

  const body = getBody(exact || false, inclusive, type === 'date', isTooBig);
  const value = isTooBig ? issue.maximum : issue.minimum;

  return [
    `Expected ${type}`,
    ...(isKeyOf(UNIT, type) ? [UNIT[type]] : []),
    `to be ${body} \`${value}\``
  ].join(' ');
};

export default get2BigOr2SmallIssueMessage;

type RangeIssue = ZodTooBigIssue | ZodTooSmallIssue;
