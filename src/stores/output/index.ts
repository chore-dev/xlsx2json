import { has, set } from 'lodash-es';

import application from '../../application';
import { Config } from '../../configs';
import { Row } from '../../types/global';
import { KeySegments, stringifyKey } from '../../xlsx2json/key';
import cliStore from '../cli';

import { duplicateKeyMessage, incompleteKeyMessage, missingValueMessage } from './messages';

let prompted = false;

const prompt = (fn: (...args: Array<unknown>) => void) => {
  if (!prompted) {
    fn();
    prompted = true;
  }
};

const createOutputStore = (config: Config) => {
  const { options = {}, values: columns } = config;
  const { fallbackValue, flattenOutput, overwriteDuplicateKey } = options;

  const output = Object.fromEntries(columns.map(column => [column, {} as Record<string, unknown>]));

  return {
    get: () => output,
    set: (segments: KeySegments, row: Row) => {
      prompted = false;

      for (const column in output) {
        const key = stringifyKey(segments, options);
        const parent = output[column];

        if (!key) {
          prompt(() => incompleteKeyMessage(segments, row));
          continue;
        }

        if (!parent) continue;

        let value = row[column];
        if (!value && fallbackValue !== false) value = fallbackValue;

        if (value === null) {
          prompt(() => missingValueMessage(key));
          continue;
        }

        value = `${value}`;

        if (key in parent || has(parent, key)) {
          if (overwriteDuplicateKey) {
            prompt(() => duplicateKeyMessage(key, true));
          } else {
            prompt(() => duplicateKeyMessage(key, false));
            continue;
          }
        } else if (!cliStore.get('quiet')) {
          prompt(() => application.log(`[ADDED] ${key}`));
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

export default createOutputStore;
