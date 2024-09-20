import * as changeCase from 'change-case';

import { Config } from '../configs';
import { Row } from '../types/global';

export const getStringifiedKey = (segments: KeyBuilderOutput, options: Config['options'] = {}) => {
  const { allowIncompleteKey, caseConversion, flattenOutput, separator } = options;

  if (!allowIncompleteKey && (segments.includes(undefined) || segments.includes(null))) {
    return undefined;
  }

  const validSegments = getValidSegments(segments);

  const finalize = (result: string) => {
    if (!caseConversion) return result;
    return changeCase[caseConversion](result) as typeof result;
  };

  if (flattenOutput && separator === '') return finalize(validSegments.join('.'));

  return validSegments.map(finalize).join(flattenOutput ? separator : '.');
};

export const getValidSegments = (segments: KeyBuilderOutput) => {
  return segments.filter(Boolean);
};

export const keyBuilderCreator = (config: Config) => {
  const { keys, options = {} } = config;
  const { enableSheetGroup, parentLookUp } = options;

  let previous = Array.from(new Array(keys.length));

  return (sheetName: string, row: Row) => {
    const current = keys.map(key => (row[key] as string) || undefined);

    if (!parentLookUp) return current;

    const lastIndexWithValue = current.findLastIndex(Boolean);

    let paused = false;
    const merged = previous.map((fallback, index) => {
      const next = current[index];

      if (!next && !paused && index < lastIndexWithValue) return fallback;

      if (next !== fallback) paused = true;
      return next;
    });

    // NOTE: Debug suggestion, using console.table is better than console.log
    //       e.g. console.table({ previous, current, merged });
    previous = merged;
    return [...(enableSheetGroup ? [sheetName] : []), ...merged];
  };
};

export type KeyBuilderOutput = ReturnType<ReturnType<typeof keyBuilderCreator>>;
