import LoggerBuilder from './logger';

const completed = (logger: Logger) => {
  logger.lineBreak();
  logger.log('application:completed');
  logger.lineBreak();
  process.exit(1);
};

const exit = (logger: Logger) => {
  logger.lineBreak();
  logger.log('application:exit');
  logger.lineBreak();
  process.exit(1);
};

const start = (logger: Logger) => {
  logger.lineBreak();
  logger.log('application:start');
  logger.lineBreak();
};

export default { completed, exit, start };

type Logger = ReturnType<typeof LoggerBuilder>;
