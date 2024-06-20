import chalk, { ChalkInstance } from 'chalk';

import { isKeyOf } from '../object';
import { replaceByPairs } from '../string';

import COMMON_MESSAGES from './messages';

const CONSOLE = console;

const logger = <CustomMessages extends Record<string, string>>(
  namespace: string,
  customMessages: Readonly<CustomMessages>
) => {
  let lineBroke = false;

  const presetMessages = { ...COMMON_MESSAGES, ...customMessages } as const;

  const builder = (
    namespace: string,
    type: Extract<keyof typeof console, 'info' | 'log' | 'warn' | 'error'>,
    chalk?: ChalkInstance
  ) => {
    return (
      messages: keyof typeof presetMessages | Array<string> | string,
      variables: Record<string, unknown> = {}
    ) => {
      lineBroke = false;

      (Array.isArray(messages) ? messages : [messages]).forEach(message => {
        const content = isKeyOf(message, presetMessages) ? presetMessages[message] : message;
        const scopedMessage = `[${namespace}] ${replaceByPairs(content as string, variables)}`;

        if (chalk) {
          CONSOLE[type](chalk(scopedMessage));
        } else {
          CONSOLE[type](scopedMessage);
        }
      });
    };
  };

  return {
    error: builder(namespace, 'error', chalk.bold.red),
    info: builder(namespace, 'info', chalk.bold.cyan),
    lineBreak: () => {
      if (!lineBroke) {
        lineBroke = true;
        CONSOLE.log('');
      }
    },
    log: builder(namespace, 'log'),
    warn: builder(namespace, 'warn', chalk.bold.yellow)
  };
};

export default logger;
