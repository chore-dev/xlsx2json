import chalk, { ChalkInstance } from 'chalk';

import { isKeyOf } from '../object';
import { replaceByPairs } from '../string';

import COMMON_MESSAGES from './messages';

const CONSOLE = console;

const logger = <CustomMessages extends Record<string, string>>(
  namespace: string,
  customMessages: Readonly<CustomMessages>,
  options?: {
    horizontalWrapper?: string;
    verticalWrapper?: string;
  }
) => {
  let indentation = 0;
  let lineBroke = false;
  let wrapped = false;

  const _options = Object.assign(
    {
      horizontalLine: '─',
      verticalLine: '│'
    },
    options || {}
  );

  const presetMessages = { ...COMMON_MESSAGES, ...customMessages } as const;

  const builder = (
    namespace: string,
    type: 'get' | Extract<keyof typeof console, 'info' | 'log' | 'warn' | 'error'>,
    chalk?: ChalkInstance
  ) => {
    type Presets = keyof typeof presetMessages;

    function fn(message: LoggerMessage<Presets>, variables?: MessageVariables): Array<string>;
    function fn(messages: LoggerMessages<Presets>): Array<string>;
    function fn(messages: unknown, variables?: unknown): Array<string> {
      if (!messages || (Array.isArray(messages) && messages.length === 0)) return [];

      lineBroke = false;

      const _messages: LoggerMessages<Presets> = [];

      if (Array.isArray(messages)) {
        _messages.push(...messages);
      } else {
        _messages.push([messages as LoggerMessage<Presets>, variables as MessageVariables]);
      }

      return _messages.map(([message, variables = {}]) => {
        const { prefix = '', suffix = '', ...remainingVariables } = variables;
        const content = isKeyOf(presetMessages, message) ? presetMessages[message] : message;
        const replaced = replaceByPairs(content as string, remainingVariables);

        if (type !== 'get') {
          const scopedMessage = `[${namespace}] ${wrapped ? `${_options.verticalLine} ` : ''}${prefix}${' '.repeat(indentation * 4)}${replaced}${suffix}`;

          if (chalk) {
            CONSOLE[type](chalk(scopedMessage));
          } else {
            CONSOLE[type](scopedMessage);
          }
        }

        return replaced;
      });
    }

    return fn;
  };

  const instance = {
    error: builder(namespace, 'error', chalk.bold.red),
    getMessages: builder(namespace, 'get'),
    indent: {
      clear: () => {
        indentation = 0;
      },
      decrease: () => {
        indentation -= 1;
      },
      increase: () => {
        indentation += 1;
      }
    },
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
  return {
    ...instance,
    wrapper: {
      end: () => {
        instance.log('');
        instance.log(Array.from(new Array(5)).fill(_options.horizontalLine.repeat(10)).join(' '));
        wrapped = false;
      },
      start: () => {
        wrapped = true;
        instance.log(Array.from(new Array(5)).fill(_options.horizontalLine.repeat(10)).join(' '));
        instance.log('');
      }
    }
  };
};

export default logger;

export type LoggerMessage<Extras = string> = string | Extras;

export type LoggerMessages<Extras = string> = Array<[LoggerMessage<Extras>, MessageVariables?]>;

export type MessageVariables = Record<string, unknown>;
