import commandLineArgs from 'command-line-args';

import { DEFAULT_DEFINITIONS, DefaultDefinitions } from './definitions';
import { OptionDefinitions } from './shared';

const createCliStore = <CustomDefinitions extends Record<string, unknown> = Record<never, never>>(
  customDefinitions: OptionDefinitions,
  options?: commandLineArgs.ParseOptions
) => {
  type Store = DefaultDefinitions & CustomDefinitions;

  const store = commandLineArgs([...DEFAULT_DEFINITIONS, ...customDefinitions], options) as Store;

  return {
    get: <Key extends keyof Store>(key: Key) => store[key],
    getAll: () => store
  };
};

export default createCliStore;
