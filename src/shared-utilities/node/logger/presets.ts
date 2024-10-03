import { formatAlertMessage } from './format';
import type { MessageCollection } from './shared';

export const COMMON = {
  AT_INDEX: 'at `config[{{index}}]`'
};

const configError = (issue: string, message: string) => {
  return formatAlertMessage('INVALID_CONFIG', issue, message);
};

const PRESET_MESSAGES = {
  /**
   * Application messages, order by flow
   */
  'application:start': ['Initializing {{namespace}}...', 'Application initialized!'],
  'application:pwd': 'Working directory: `{{pwd}}`',
  'application:exit': 'Exit with error(s)...',
  'application:completed': 'All Task(s) Completed!',
  /**
   * Config related messages
   */
  // In Progress
  'config:inProgress:atIndex': `Start processing configs ${COMMON.AT_INDEX}...`,
  // Error
  'config:error:empty': configError('EMPTY_CONFIG', 'Config is empty!'),
  'config:error:noMultiple': configError(
    'NO_MULTIPLE',
    'No multiple configs allowed, expect config to be an object'
  ),
  'config:error:notFound': configError('CONFIG_NOT_FOUND', 'At `{{path}}`'),
  'config:error:pathNotFound': configError('PATH_NOT_FOUND', `At \`{{path}}\` ${COMMON.AT_INDEX}`),
  'config:error:schema': configError('INVALID_SCHEMA', `{{issue}} ${COMMON.AT_INDEX}`),
  'config:error:type': configError('INVALID_TYPE', 'Expect config to be an array or an object')
} as const satisfies MessageCollection;

export default PRESET_MESSAGES;
