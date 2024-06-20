const COMMON_MESSAGES = {
  'application:completed': 'Completed!',
  'application:exit': 'Exiting...',
  'application:start': 'Initializing...',
  'config:error:configNotFound': 'Unable to find the config file at {{path}}',
  'config:error:fixAndRetry': 'Please fix the config file and try again',
  'config:error:notAllowMultiple': 'Expected the config to be an object, but got an array',
  'config:error:unexpectedRootType':
    'Expected the config to be an array or an object, but got neither'
} as const;

export default COMMON_MESSAGES;
