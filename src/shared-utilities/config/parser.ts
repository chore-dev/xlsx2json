import { defaults } from 'lodash-es';
import { z, ZodObject } from 'zod';
import { ZodRawShape } from 'zod/lib/types';

import { arrayWrap } from '../common/array';
import { messagesConverter } from '../logger/messages';
import { isObject } from '../common/is';
import { Application } from '../node/application';
import { Messages } from '../node/logger/shared';
import { flattenIssues, getZodIssueMessage } from '../zod';

import { touchConfigFile } from './';

const configFileParser = async <Schema extends ZodObject<ZodRawShape>>(
  path: string,
  application: Application,
  zodSchema: Schema,
  options?: ReadConfigFileOptions
): Promise<Array<z.input<Schema>>> => {
  let configs = await touchConfigFile(path, application);

  const { allowMultiple } = defaults(options, { allowMultiple: true });

  const results: Array<z.input<Schema>> = [];

  if (!Array.isArray(configs) && !isObject(configs)) {
    application.exit('config:error:invalidType');
    return results;
  }

  if (!allowMultiple && Array.isArray(configs)) {
    application.exit('config:error:noMultiple');
    return results;
  }

  configs = arrayWrap(configs);

  if (!configs.length) {
    application.exit('config:error:emptyConfig');
    return results;
  }

  let schemaIssues: Messages = [];

  for (let i = 0; i < configs.length; i++) {
    const config = configs[i];

    const { success, ...remaining } = zodSchema.safeParse(config);

    if (success && remaining.data) {
      results.push(remaining.data as z.input<Schema>);
    } else {
      schemaIssues = schemaIssues.concat(
        messagesConverter(flattenIssues(remaining.error?.issues || []), issue => {
          return [['config:error:invalidSchema', { index: i, issue: getZodIssueMessage(issue) }]];
        })
      );
    }
  }

  if (schemaIssues.length) application.exit(schemaIssues);
  return results;
};

export default configFileParser;

interface ReadConfigFileOptions {
  allowMultiple?: boolean;
}
