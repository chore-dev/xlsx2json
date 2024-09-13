import { has, set } from 'lodash-es';

import cliStore from '../stores/cli';
import { ConfigOptions, Row } from '../types/global';

import application from './application';
import { getStringifiedKey, KeyBuilderOutput } from './key';
import {
  promptDuplicateKeyMessage,
  promptIncompleteKeyMessage,
  promptMissingValueMessage
} from './messages';

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
            promptIncompleteKeyMessage(segments, row);
            logged = true;
          }
          continue;
        }

        if (!parent) continue;

        let value = row[column];
        if (!value && fallbackValue !== false) value = fallbackValue;

        if (value === null) {
          if (!logged) {
            promptMissingValueMessage(key);
            logged = true;
          }
          continue;
        }

        value = `${value}`;

        if (key in parent || has(parent, key)) {
          if (overwriteDuplicateKey) {
            if (!logged) {
              promptDuplicateKeyMessage(key, true);
              logged = true;
            }
          } else {
            if (!logged) {
              promptDuplicateKeyMessage(key, false);
              logged = true;
            }
            continue;
          }
        } else if (!cliStore.get('quiet') && !logged) {
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
