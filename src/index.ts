import Schema from './config';
import configFileParser from './shared-utilities/config/parser';
import { pathsValidator } from './shared-utilities/config/validator';
import { PWD } from './shared-utilities/fs';
import { messagesConverter } from './shared-utilities/logger/messages';
import cliStore from './stores/cli';
import application from './utilities/application';
import xlsx2json from './xlsx2json';

(async () => {
  application.start();

  const configFile = PWD(cliStore.get('config'));

  const configs = await configFileParser(configFile, application, Schema);

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

    xlsx2json(config);
  });

  application.completed();
})();
