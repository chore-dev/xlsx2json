import * as changeCase from 'change-case';

import type { Config } from '../configs';
import type { Row } from '../types/global';

export const keyComposer = (config: Config) => {
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
    // NOTE: This function returns an array because outputStore take the array for further processing
    return [...(enableSheetGroup ? [sheetName] : []), ...merged];
  };
};

export const stringifyKey = (_segments: KeySegments, options: Config['options'] = {}) => {
  const { allowIncompleteKey, caseConversion, flattenOutput, separator } = options;

  if (!allowIncompleteKey && (_segments.includes(undefined) || _segments.includes(null))) {
    return undefined;
  }

  const segments = _segments.filter(Boolean);

  const finalize = (result: string) => {
    if (!caseConversion) return result;
    return changeCase[caseConversion](result) as typeof result;
  };

  if (flattenOutput && separator === '') return finalize(segments.join('.'));

  return segments.map(finalize).join(flattenOutput ? separator : '.');
};

export type KeySegments = ReturnType<ReturnType<typeof keyComposer>>;
