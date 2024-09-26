import { defaults } from 'lodash-es';
import { z, ZodObject, ZodRawShape } from 'zod';

import { arrayWrap } from '../common/array';
import { isObject } from '../common/is';
import { translateZodIssues } from '../common/zod/issue';
import { Application } from '../node/application';
import { Messages } from '../node/logger/shared';

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
      const zodMessages = translateZodIssues(remaining.error?.issues, {
        details: true,
        flatten: true
      });

      schemaIssues = schemaIssues.concat(
        zodMessages.map(({ message }) => {
          return ['config:error:schema', { index: i, issue: message }];
        })
      );
      // schemaIssues = schemaIssues
      //   .concat
      //   // messagesConverter(flattenIssues(remaining.error?.issues || []), issue => {
      //   //   return [['config:error:invalidSchema', { index: i, issue: getZodIssueMessage(issue) }]];
      //   // })
      //   ();
    }
  }

  if (schemaIssues.length) application.exit(schemaIssues);
  return results;
};

export default configFileParser;

interface ReadConfigFileOptions {
  allowMultiple?: boolean;
}
