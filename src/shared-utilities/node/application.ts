import loggerBuilder from './logger/index.js';
import type { Message, Messages, Variables } from './logger/shared.js';

const applicationBuilder = (
  namespace: string,
  customMessages: Parameters<typeof loggerBuilder>[1],
  options?: Parameters<typeof loggerBuilder>[2]
) => {
  const logger = loggerBuilder(namespace, customMessages, options);

  function exit(message: Message, variables?: Variables): void;
  function exit(messages: Messages): void;
  function exit(messages: unknown, variables?: unknown) {
    logger.error([
      ['\n'],
      ...(Array.isArray(messages) ? messages : [[messages, variables]]),
      ['application:exit'],
      ['\n']
    ]);
    process.exit(1);
  }

  return {
    completed: () => {
      logger.log([['\n'], ['application:completed'], ['\n']]);
      process.exit(1);
    },
    exit,
    start: () => {
      logger.log([['\n'], ['application:start'], ['application:pwd'], ['\n']]);
    },
    ...logger
  };
};

export default applicationBuilder;

export type Application = ReturnType<typeof applicationBuilder>;
