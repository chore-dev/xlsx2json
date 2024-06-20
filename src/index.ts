import commandLineArgs from 'command-line-args';
import { z } from 'zod';

import ConfigSchema from './constants/config.schema';
import { CONFIG_FILE_NAME } from './constants/global';
import { arrayWrap } from './shared-utilities/array';
import { touchConfigFile } from './shared-utilities/configs';
import { validateConfig } from './shared-utilities/configs/validate';
import { PWD } from './shared-utilities/fs';
import progress from './shared-utilities/progress';
import logger from './utilities/logger';

const options = commandLineArgs([
  { name: 'config', alias: 'C', type: String },
  { name: 'dry-run', alias: 'D', type: Boolean }
]);

progress.start(logger);

touchConfigFile(PWD(options.config || `./${CONFIG_FILE_NAME}`)).then(config => {
  const result = validateConfig(config, {
    zodSchema: ConfigSchema
  });

  if (!result.valid) {
    logger.error(result.messages);
    logger.error('config:error:fixAndRetry');
    progress.exit(logger);
  }

  const configs = arrayWrap(config as z.infer<typeof ConfigSchema>);

  configs.forEach((config, index) => {
    const c = console;
    c.log(config, index);
  });
});
