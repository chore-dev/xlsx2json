import { isNumber } from './is';

export const arrayWrap = <Input>(input: Input | Array<Input>): Array<Input> => {
  return Array.isArray(input) ? input : [input];
};

export const stringifyBracketDotNotation = (path: Array<string | number>) => {
  return path
    .map((segment, index) => {
      const isIndex = isNumber(segment);
      const separator = isIndex || index === 0 ? '' : '.';

      return `${separator}${isIndex ? `[${segment}]` : segment}`;
    })
    .join('');
};
