import { NAMESPACE } from '../constants/global';
import applicationBuilder from '../shared-utilities/application';

const CUSTOM_MESSAGES = {
  // In Progress
  'xlsx:inProgress:ignore': '{{noOfItems}} {{name}} has been ignored: {{items}}',
  'xlsx:inProgress:missing': '{{noOfItems}} {{name}} missing: {{items}}',
  'xlsx:inProgress:process': '{{noOfItems}} {{name}} to process: {{items}}',
  'xlsx:inProgress:title': '{{category}}: {{name}}',
  // Warning
  'xlsx:warning:nothingToProcess': 'No {{name}} to process in this {{parent}}, skipping...',
  'xlsx:warning:row:missingPartsInKey1':
    'Found missing part(s) in the key: `{{key}}`, consider the following:',
  'xlsx:warning:row:missingPartsInKey2':
    '- Unable to look up parent due to missing parent or `parentLookUp` is disabled',
  'xlsx:warning:row:missingPartsInKey3':
    '- Set `allowIncompleteKeys` to `true` to allow missing part(s) in keys',
  'xlsx:warning:row:missingPartsInKey4': 'Skipping...',
  //
  'xlsx:inProgress:readingXlsx': 'Reading XLSX file from {{path}}...',
  'xlsx:warning:incompleteSheet1': 'There are missing key(s) or value(s) column(s)',
  'xlsx:warning:incompleteSheet2':
    'Please add the missing key(s) or value(s) column(s) to the sheet, or',
  'xlsx:warning:incompleteSheet3':
    'remove the corresponding key(s) or value(s) from the config, skipping...'
} as const;

const application = applicationBuilder(NAMESPACE, CUSTOM_MESSAGES);

export default application;
