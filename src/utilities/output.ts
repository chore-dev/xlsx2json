import { has, set } from 'lodash-es';

import { ConfigOptions, Row } from '../types/global';

import application from './application';
import { getStringifiedKey, KeyBuilderOutput } from './key';

const outputBuilderCreator = (config: ConfigOptions) => {
  const { options = {}, values: columns } = config;
  const { fallbackValue, flattenOutput, overwriteDuplicateKey } = options;

  const output = Object.fromEntries(columns.map(column => [column, {} as Record<string, unknown>]));

  return {
    get: () => output,
    set: (segments: KeyBuilderOutput, row: Row) => {
      let logged = false;

      for (const column in output) {
        const key = getStringifiedKey(segments, options);
        const parent = output[column];

        if (!key) {
          if (!logged) {
            application.lineBreak();
            application.error(
              `[SKIPPED] [ERROR_INCOMPLETE_KEY] ${segments.map(s => (!s ? 'undefined' : s)).join(', ')}`
            );
            application.indent.increase();
            application.error('└ Set `allowIncompleteKey` to true to allow this incomplete key');
            application.indent.decrease();
            application.lineBreak();
            logged = true;
          }
          continue;
        }

        if (!parent) continue;

        let value = row[column];
        if (!value && fallbackValue !== false) value = fallbackValue;

        if (value === null) {
          if (!logged) {
            application.lineBreak();
            application.warn(`[SKIPPED] [MISSING_VALUE] ${key}`);
            application.indent.increase();
            application.warn(
              '└ Remove `fallbackValue`: false or set `fallbackValue` to a string to preserve a key with no value'
            );
            application.indent.decrease();
            application.lineBreak();
            logged = true;
          }
          continue;
        }

        value = `${value}`;

        if (key in parent || has(parent, key)) {
          if (overwriteDuplicateKey) {
            if (!logged) {
              application.lineBreak();
              application.warn(`[OVERWROTE] [DUPLICATE_KEY] ${key}`);
              application.indent.increase();
              application.warn('└ Set `overwriteDuplicateKey` to false to disallow duplicate key');
              application.indent.decrease();
              application.lineBreak();
              logged = true;
            }
          } else {
            if (!logged) {
              application.lineBreak();
              application.error(`[SKIPPED] [DUPLICATE_KEY] ${key}`);
              application.lineBreak();
              logged = true;
            }
            continue;
          }
        } else if (!logged) {
          application.log(`[ADDED] ${key}`);
          logged = true;
        }

        if (flattenOutput) {
          parent[key] = value;
        } else {
          set(parent, key, value);
        }
      }
    }
  };
};

export default outputBuilderCreator;
