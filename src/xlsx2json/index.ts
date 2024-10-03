import { writeFileSync } from 'fs';
import { pick } from 'lodash-es';
import XLSX from 'xlsx';

import application from '../application';
import type { Config } from '../configs';
import { isObject } from '../shared-utilities/common/is';
import cliStore from '../stores/cli';
import createOutputStore from '../stores/output';

import { keyComposer } from './key';
import getPendingRows from './rows';
import getPendingSheets from './sheets';

const xlsx2json = (config: Config) => {
  const { ignores = {}, input, keys, outputDir, values } = config;

  application.log([
    ['xlsx:inProgress:readingXlsx', { path: input }],
    ['\n'],
    ['xlsx:inProgress:title', { category: 'WorkBook', name: input }]
  ]);
  application.wrapper.start();

  const compose = keyComposer(config);
  const outputStore = createOutputStore(config);

  const workBook = XLSX.readFile(input);
  const sheets = getPendingSheets(workBook, ignores.sheets);

  sheets.forEach(name => {
    const sheet = workBook.Sheets[name];

    if (!sheet) return;

    application.log([['\n'], ['xlsx:inProgress:title', { category: 'Sheet', name }]]);

    const rows = getPendingRows(sheet, [...keys, ...values]);

    application.log('\n');
    application.indent.increase();

    rows.forEach(row => {
      if (isObject(row)) {
        // NOTE: Remove unnecessary columns from the row
        const _row = pick(row, [...keys, ...values]);
        outputStore.set(compose(name, _row), _row);
      }
    });

    application.indent.decrease();

    const result = outputStore.get();

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
