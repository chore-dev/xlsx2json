import chalk, { ChalkInstance } from 'chalk';
import { PWD } from '../../fs';
import { arrayWrap } from '../../common/array';
import { isKeyOf } from '../../common/object';
import { replacePlaceholders } from '../../common/string';
import PRESET_MESSAGES from './presets';
import { Message, MessageCollection, Messages, Variables } from './shared';

const CONSOLE = console;
const DEFAULT_OPTIONS: Options = {
  horizontalLine: '─',
  verticalLine: '│'
};
const INDENTATION_DEPTH = 4;

const line = (sign: string) => Array.from(new Array(5)).fill(`${sign}`.repeat(10)).join(' ');

const logger = <CustomMessages extends MessageCollection = Record<never, never>>(
  namespace: string,
  customMessages: CustomMessages,
  _options: Options = {}
) => {
  const collections: MessageCollection = {
    ...PRESET_MESSAGES,
    ...customMessages
  } as const;
  const options = Object.assign(DEFAULT_OPTIONS, _options);

  let indentation = 0;
  let lineBroken = false;
  let wrapping = false;

  const builder = (level: Level, chalk?: ChalkInstance) => {
    type Presets = keyof typeof collections;

    function fn(message: Message<Presets>, variables?: Variables): Array<Array<string>>;
    function fn(messages: Messages<Presets>): Array<Array<string>>;
    function fn(messages: unknown, variables?: unknown): Array<Array<string>> {
      if (!messages || (Array.isArray(messages) && messages.length === 0)) return [];

      lineBroken = false;

      const results: Messages<Presets> = [];

      // NOTE: Make sure messages is an array for easier processing
      if (Array.isArray(messages)) {
        results.push(...messages);
      } else {
        results.push([messages as Message<Presets>, variables as Variables]);
      }

      return results.map(([message, _variables = {}]) => {
        const { prefix = '', suffix = '', ...variables } = _variables;

        const contents = arrayWrap(
          isKeyOf(collections, message) ? collections[message] : message
        ).filter(Boolean) as Array<string>;
        const replaced = contents.map(content =>
          replacePlaceholders(content, {
            namespace,
            pwd: PWD(),
            now: new Date().toISOString(),
            ...variables
          })
        );

        if (level !== 'get') {
          replaced.forEach(line => {
            const formattedLine = `[${namespace}] ${wrapping ? `${options.verticalLine} ` : ''}${prefix}${' '.repeat(indentation * INDENTATION_DEPTH)}${line}${suffix}`;

            if (chalk) {
              CONSOLE[level](chalk(formattedLine));
            } else {
              CONSOLE[level](formattedLine);
            }
          });
        }

        return replaced;
      });
    }

    return fn;
  };

  // NOTE: This is the final instance, DO NOT add any code between this and the return statement
  const logs = {
    error: builder('error', chalk.bold.red),
    info: builder('info', chalk.bold.cyan),
    log: builder('log'),
    warn: builder('warn', chalk.bold.yellow)
  };
  return {
    ...logs,
    // Formatting functions
    indent: {
      clear: () => (indentation = 0),
      decrease: () => (indentation -= 1),
      increase: () => (indentation += 1)
    },
    lineBreak: () => {
      if (lineBroken) return;

      lineBroken = true;
      CONSOLE.log('');
    },
    wrapper: {
      end: () => {
        logs.log('');
        logs.log(line(`${options.horizontalLine}`));
        wrapping = false;
      },
      start: () => {
        wrapping = true;
        logs.log(line(`${options.horizontalLine}`));
        logs.log('');
      }
    },
    // Getter functions
    messages: {
      get: builder('get')
    }
  };
};

export default logger;

type Level = Extract<keyof typeof console, 'info' | 'log' | 'warn' | 'error'> | 'get';

type Options = {
  horizontalLine?: string;
  verticalLine?: string;
};
