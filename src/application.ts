import { NAMESPACE } from './constants/global';
import applicationBuilder from './shared-utilities/node/application';
import { MessageCollection } from './shared-utilities/node/logger/shared';

const CUSTOM_MESSAGES = {
  // In Progress - General
  'xlsx:inProgress:ignore': '{{noOfItems}} {{name}} has been ignored: {{items}}',
  'xlsx:inProgress:missing': '{{noOfItems}} {{name}} missing: {{items}}',
  'xlsx:inProgress:process': '{{noOfItems}} {{name}} to process: {{items}}',
  'xlsx:inProgress:title': '{{category}}: {{name}}',
  // In Progress - xlsx2json
  'xlsx:inProgress:readingXlsx': 'Reading XLSX file from {{path}}...',
  // Warning
  'xlsx:warning:nothingToProcess': 'No {{name}} to process in this {{parent}}, skipping...'
} as MessageCollection;

const application = applicationBuilder(NAMESPACE, CUSTOM_MESSAGES);

export default application;
