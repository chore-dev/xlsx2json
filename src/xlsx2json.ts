import { writeFileSync } from 'fs';
import { pick } from 'lodash-es';
import XLSX from 'xlsx';

import { Config } from './configs';
import { isObject } from './shared-utilities/common/object';
import cliStore from './stores/cli';
import application from './utilities/application';
import { keyBuilderCreator } from './utilities/key';
import outputBuilderCreator from './utilities/output';
import getValidRows from './utilities/validator/sheet';
import getValidSheets from './utilities/validator/workBook';

const xlsx2json = (config: Config) => {
  const { ignores = {}, input, keys, outputDir, values } = config;

  application.log('xlsx:inProgress:readingXlsx', { path: input });
  application.lineBreak();
  application.log('xlsx:inProgress:title', { category: 'WorkBook', name: input });
  application.wrapper.start();

  const workBook = XLSX.readFile(input);
  const sheets = getValidSheets(workBook, ignores.sheets);

  const output = outputBuilderCreator(config);

  sheets.forEach(name => {
    const sheet = workBook.Sheets[name];
    const keyBuilder = keyBuilderCreator(config);

    if (!sheet) return;

    application.log('');
    application.log('xlsx:inProgress:title', { category: 'Sheet', name });

    const rows = getValidRows(sheet, [...keys, ...values]);

    application.log('');
    application.indent.increase();

    rows.forEach(row => {
      if (!isObject(row)) return;

      // NOTE: Remove unnecessary columns from the row
      const _row = pick(row, [...keys, ...values]);
      output.set(keyBuilder(name, _row), _row);
    });

    application.indent.decrease();

    const result = output.get();

    if (cliStore.get('dry-run')) {
      // Ignore the console linting for dry-run
      // eslint-disable-next-line no-console
      console.log(JSON.stringify(result, null, 2));
    } else {
      for (const section in result) {
        writeFileSync(`${outputDir}/${section}.json`, JSON.stringify(result[section], null, 2));
      }
    }
  });

  application.wrapper.end();
};

export default xlsx2json;
