import { constantCase } from 'change-case';

import { isKeyOf } from '../object';
import { replaceByPairs } from '../string';

import { LoggerMessages } from './';

export const declareAlertMessage = (type: string, issue: string, message: string) => {
  return `[${constantCase(type)}] [${constantCase(issue)}] ${message}`;
};

export const MESSAGE_SUFFIX = {
  AT_CONFIG_INDEX: 'at config index {{index}}'
};

export const MESSAGE_TYPES = {
  INVALID_CONFIG: 'INVALID_CONFIG'
};

const COMMON_MESSAGES = {
  // Application Level
  'application:completed': 'All Task(s) Completed!',
  'application:exit': 'Exit with error(s)...',
  'application:pwd': 'Working directory: {{path}}',
  'application:start': 'Application Initialized!',
  // Config File
  'config:error:emptyConfig': declareAlertMessage(
    MESSAGE_TYPES.INVALID_CONFIG,
    'EMPTY_CONFIG',
    'Config is empty'
  ),
  'config:error:invalidSchema': declareAlertMessage(
    MESSAGE_TYPES.INVALID_CONFIG,
    'INVALID_SCHEMA',
    `{{issue}} ${MESSAGE_SUFFIX.AT_CONFIG_INDEX}`
  ),
  'config:error:invalidType': declareAlertMessage(
    MESSAGE_TYPES.INVALID_CONFIG,
    'INVALID_TYPE',
    'Expect config to be an array or an object'
  ),
  'config:error:locationNotFound': declareAlertMessage(
    MESSAGE_TYPES.INVALID_CONFIG,
    'LOCATION_NOT_FOUND',
    `At \`{{path}}\` ${MESSAGE_SUFFIX.AT_CONFIG_INDEX}`
  ),
  'config:error:noMultiple': declareAlertMessage(
    MESSAGE_TYPES.INVALID_CONFIG,
    'NOT_ALLOW_MULTIPLE',
    'No multiple configs allowed'
  ),
  'config:error:notFound': declareAlertMessage(
    MESSAGE_TYPES.INVALID_CONFIG,
    'CONFIG_NOT_FOUND',
    'At {{path}}'
  ),

  'config:inProgress:atIndex': 'Processing config at index {{index}}...'
} as const;

export const messagesConverter = <Input>(
  inputs: Array<Input>,
  processor: (input: Input, index: number, inputs: Array<Input>) => LoggerMessages
): LoggerMessages => {
  return inputs.map(processor).flat();
};

export const getCommonMessage = (
  message: keyof typeof COMMON_MESSAGES | string,
  variables: Record<string, unknown> = {}
) => {
  return replaceByPairs(
    isKeyOf(COMMON_MESSAGES, message) ? COMMON_MESSAGES[message] : message,
    variables
  );
};

export default COMMON_MESSAGES;
