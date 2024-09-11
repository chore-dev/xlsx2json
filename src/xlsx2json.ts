import { writeFileSync } from 'fs';
import XLSX from 'xlsx';

import { isObject } from './shared-utilities/object';
import { CliArguments, ConfigOptions } from './types/global';
import application from './utilities/application';
import { keyBuilderCreator } from './utilities/key';
import outputBuilderCreator from './utilities/output';
import getValidRows from './utilities/validator/sheet';
import getValidSheets from './utilities/validator/workBook';

const xlsx2json = (config: ConfigOptions, commandLineArguments: CliArguments) => {
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

      output.set(keyBuilder(name, row), row);
    });

    application.indent.decrease();

    const result = output.get();

    if (commandLineArguments['dry-run']) {
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
