import XLSX from 'xlsx';

import application from '../application';
import { Columns, Row } from '../types/global';

const getPendingRows = (sheet: XLSX.WorkSheet, targets: Columns) => {
  const rows = XLSX.utils.sheet_to_json<Row>(sheet, {
    defval: null
  });

  if (!rows || !rows.length) {
    application.warn('xlsx:warning:nothingToProcess', {
      name: 'Row(s)',
      parent: 'Sheet'
    });
    return rows;
  }

  const missingColumns: Columns = [];
  const columns = targets.filter(target => {
    const exist = Object.keys(rows[0] || {}).includes(target);

    if (!exist) missingColumns.push(target);
    return exist;
  });

  if (columns.length) {
    application.log('xlsx:inProgress:process', {
      items: columns,
      name: 'Column(s)',
      noOfItems: columns.length
    });
  }
  if (missingColumns.length) {
    application.warn('xlsx:inProgress:missing', {
      items: missingColumns,
      name: 'Column(s)',
      noOfItems: missingColumns.length
    });
  }
  if (columns.length === 0) {
    application.warn('xlsx:warning:nothingToProcess', {
      name: 'Column(s)',
      parent: 'Sheet'
    });
    return [];
  }

  return rows;
};

export default getPendingRows;
