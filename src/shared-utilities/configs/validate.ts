import { ZodObject } from 'zod';
import { ZodRawShape } from 'zod/lib/types';

import { isObject } from '../object';
import { flattenIssues, getZodIssueMessage } from '../zod';

export const validateConfig = <Configs = unknown>(
  configs: Array<Configs> | Configs,
  options?: ValidateConfigOptions
) => {
  const { allowMultiple, zodSchema } = Object.assign(
    {
      allowMultiple: false
    },
    options
  );

  const result = {
    config: configs,
    messages: [] as Array<string>,
    valid: false
  };

  if (!allowMultiple && Array.isArray(configs)) {
    result.messages.push('config:error:notAllowMultiple');
    return result;
  }

  if (!Array.isArray(configs) && !isObject(configs)) {
    result.messages.push('config:error:unexpectedRootType');
    return result;
  }

  const _configs = Array.isArray(configs) ? configs : [configs];

  if (zodSchema) {
    for (let i = 0; i < _configs.length; i++) {
      const config = _configs[i] as Configs;
      const { success, ...remaining } = zodSchema.safeParse(config);

      if (!success) {
        flattenIssues(remaining.error?.issues || []).forEach(issue => {
          result.messages.push(`${getZodIssueMessage(issue)} under config index ${i}`);
        });
      }
    }
  }

  result.valid = result.messages.length === 0;
  return result;
};

interface ValidateConfigOptions {
  allowMultiple?: boolean;
  zodSchema?: ZodObject<ZodRawShape>;
}
