import application from './application.js';
import Schema from './configs/index.js';
import readConfigFile from './shared-utilities/node/config/index.js';
import { PWD } from './shared-utilities/node/fs.js';
import cliStore from './stores/cli.js';
import xlsx2json from './xlsx2json/index.js';

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
