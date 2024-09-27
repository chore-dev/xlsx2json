import { CONFIG_FILE_NAME } from '../constants/global.js';
import createCliStore from '../shared-utilities/node/stores/cli/index.js';

const cliStore = createCliStore<{
  config: string;
  'dry-run': boolean;
}>([
  { name: 'config', alias: 'C', type: String, defaultValue: `./${CONFIG_FILE_NAME}` },
  { name: 'dry-run', alias: 'D', type: Boolean, defaultValue: false }
]);

export default cliStore;

export type CliArguments = ReturnType<typeof cliStore.getAll>;
