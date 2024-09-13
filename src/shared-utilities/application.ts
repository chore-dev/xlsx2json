import { PWD } from './fs';
import loggerBuilder from './node/logger';
import { Message, Messages, Variables } from './node/logger/shared';

const applicationBuilder = (
  namespace: string,
  customMessages: Parameters<typeof loggerBuilder>[1]
) => {
  const logger = loggerBuilder(namespace, customMessages);

  return {
    completed: () => {
      logger.lineBreak();
      logger.log('application:completed');
      logger.lineBreak();
      process.exit(1);
    },
    exit: (messages: Message | Messages, variables?: Variables) => {
      logger.lineBreak();
      if (messages) {
        if (Array.isArray(messages)) {
          logger.error(messages);
        } else {
          logger.error(messages, variables);
        }
      }
      logger.error('application:exit');
      logger.lineBreak();
      process.exit(1);
    },
    start: () => {
      logger.lineBreak();
      logger.log([
        ['application:start'],
        [
          'application:pwd',
          {
            path: PWD()
          }
        ]
      ]);
      logger.lineBreak();
    },
    ...logger
  };
};

export default applicationBuilder;

export type Application = ReturnType<typeof applicationBuilder>;
