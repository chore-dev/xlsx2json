import commandLineArgs from 'command-line-args';

import Schema from './config';
import { CONFIG_FILE_NAME } from './constants/global';
import configFileParser from './shared-utilities/config/parser';
import { pathsValidator } from './shared-utilities/config/validator';
import { PWD } from './shared-utilities/fs';
import { messagesConverter } from './shared-utilities/logger/messages';
import { CliArguments } from './types/global';
import application from './utilities/application';
import xlsx2json from './xlsx2json';

const commandLineArguments = commandLineArgs([
  { name: 'config', alias: 'C', type: String },
  { name: 'dry-run', alias: 'D', type: Boolean }
]) as CliArguments;

application.start();

(async () => {
  const configFileLocation = PWD(commandLineArguments.config || `./${CONFIG_FILE_NAME}`);
  const configs = await configFileParser(configFileLocation, application, Schema);

  pathsValidator(configs, ['input', 'outputDir'], invalidPaths => {
    application.exit(
      messagesConverter(invalidPaths, (paths, index) => {
        return paths.map(path => {
          return ['config:error:locationNotFound', { index, path }];
        });
      })
    );
  });

  configs.forEach((config, index) => {
    application.lineBreak();
    application.log('config:inProgress:atIndex', { index });

    xlsx2json(config, commandLineArguments);
  });

  application.completed();
})();
