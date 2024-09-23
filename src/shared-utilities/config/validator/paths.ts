import { pathExists } from '../../fs';
import { arrayWrap } from '../../common/array';
import { isFunction } from '../../function';

export const pathsValidator = <
  Config extends Record<string | number | symbol, unknown>,
  TargetFields extends Array<keyof Config>
>(
  configs: Array<Config> | Config,
  targetFields: TargetFields,
  invalidCallback?: (result: Array<Array<keyof Config>>) => void
) => {
  let allValid = true;

  const invalidPaths = arrayWrap(configs).map(config => {
    return targetFields.filter(field => {
      const valid = pathExists(config[field]);

      if (!valid) allValid = false;
      return !valid;
    });
  });

  if (!allValid && invalidCallback && isFunction(invalidCallback)) {
    invalidCallback(invalidPaths);
  }
};
