import XLSX from 'xlsx';

import { Config } from '../../configs';
import application from '../application';

const getValidSheets = (
  workBook: ReturnType<typeof XLSX.readFile>,
  blackList: NonNullable<Config['ignores']>['sheets'] = []
) => {
  const sheetNames = workBook.SheetNames;

  const ignoredSheets: typeof sheetNames = [];
  const sheets = workBook.SheetNames.filter(name => {
    const blacklisted = blackList.includes(name);

    if (blacklisted) ignoredSheets.push(name);
    return !blacklisted;
  });

  if (sheets.length) {
    application.log('xlsx:inProgress:process', {
      items: sheets.join(', '),
      name: 'Sheet(s)',
      noOfItems: sheets.length
    });
  }
  if (ignoredSheets.length) {
    application.log('xlsx:inProgress:ignore', {
      items: ignoredSheets.join(', '),
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

export default getValidSheets;
