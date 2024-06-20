import { existsSync } from 'fs';

import logger from '../../utilities/logger';
import progress from '../progress';

export const touchConfigFile = async (path: string) => {
  if (!existsSync(path)) {
    logger.error('config:error:configNotFound', { path });
    progress.exit(logger);
  }

  return (await import(path)).default;
};
