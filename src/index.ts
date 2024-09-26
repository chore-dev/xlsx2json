import Schema from './configs';
import readConfigFile from './shared-utilities/node/config';
import { PWD } from './shared-utilities/node/fs';
import cliStore from './stores/cli';
import application from './utilities/application';
import xlsx2json from './xlsx2json';

(async () => {
  application.start();

  const configFilePath = PWD(cliStore.get('config'));
  const { configs, errors: configErrors } = await readConfigFile(configFilePath, Schema, {
    pathFields: ['input', 'outputDir']
  });

  if (configErrors.length) application.exit(configErrors);

  configs.forEach((config, index) => {
    application.log([['\n'], ['config:inProgress:atIndex', { index }]]);

    xlsx2json(config);
  });

  application.completed();
})();
