import XLSX from 'xlsx';

import application from '../application';
import type { Config } from '../configs';

const getPendingSheets = (
  workBook: ReturnType<typeof XLSX.readFile>,
  blackList: NonNullable<Config['ignores']>['sheets'] = []
) => {
  const sheetNames = workBook.SheetNames;

  const ignoredSheets: typeof sheetNames = [];
  const sheets = sheetNames.filter(name => {
    const blacklisted = blackList.includes(name);

    if (blacklisted) ignoredSheets.push(name);
    return !blacklisted;
  });

  if (sheets.length) {
    application.log('xlsx:inProgress:process', {
      items: sheets,
      name: 'Sheet(s)',
      noOfItems: sheets.length
    });
  }
  if (ignoredSheets.length) {
    application.log('xlsx:inProgress:ignore', {
      items: ignoredSheets,
      name: 'Sheet(s)',
      noOfItems: ignoredSheets.length
    });
  }
  if (sheets.length === 0) {
    application.warn('xlsx:warning:nothingToProcess', {
      name: 'Sheet(s)',
      parent: 'WorkBook'
    });
  }

  return sheets;
};

export default getPendingSheets;
