import { get, has } from 'lodash-es';
import type { ZodRawShape } from 'zod';
import { z, ZodObject } from 'zod';

import { arrayWrap } from '../../common/array.js';
import { isObject } from '../../common/is.js';
import { translateZodIssues } from '../../common/zod/issue/index.js';
import { pathExists } from '../fs.js';
import type { Messages } from '../logger/shared.js';

const readConfigFile = async <Schema extends ZodSchema>(
  path: string,
  schema?: Schema,
  _options?: Options
) => {
  const results: Result<Schema> = {
    configs: [],
    errors: []
  };

  if (!pathExists(path)) {
    results.errors.push(['config:error:notFound', { path }]);
    return results;
  }

  let configs = (await import(path)).default;

  const { allowMultiple, pathFields } = Object.assign(
    {
      allowMultiple: true,
      pathFields: []
    },
    _options
  );

  if (!Array.isArray(configs) && !isObject(configs)) {
    results.errors.push(['config:error:type']);
    return results;
  }

  if (!allowMultiple && Array.isArray(configs)) {
    results.errors.push(['config:error:noMultiple']);
    return results;
  }

  configs = arrayWrap(configs);

  if (!configs.length) {
    results.errors.push(['config:error:empty']);
    return results;
  }

  if (schema) {
    for (let i = 0; i < configs.length; i++) {
      const config = configs[i];

      const { success, ...remaining } = schema.safeParse(config);

      if (success && remaining.data) {
        results.configs.push(remaining.data as z.input<Schema>);

        if (pathFields.length) {
          pathFields.forEach(path => {
            if (!has(config, path) || !pathExists(get(config, path))) {
              results.errors.push(['config:error:pathNotFound', { index: i, path }]);
            }
          });
        }
      } else {
        const issues = translateZodIssues(remaining.error?.issues, {
          details: true,
          flatten: true
        });

        results.errors.push(
          ...issues.map(({ message }) => {
            return ['config:error:schema', { index: i, issue: message }] as Messages[number];
          })
        );
      }
    }
  }

  return results;
};

export default readConfigFile;

type Options = {
  allowMultiple?: boolean;
  pathFields?: Array<string>;
};

type Result<Schema extends ZodSchema> = {
  configs: Array<z.input<Schema>>;
  errors: Messages;
};

type ZodSchema = ZodObject<ZodRawShape>;
