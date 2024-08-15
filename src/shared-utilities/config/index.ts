import { Application } from '../application';
import { pathExists } from '../fs';

export const touchConfigFile = async (path: string, application: Application) => {
  if (!pathExists(path)) application.exit('config:error:notFound', { path });

  return (await import(path)).default;
};
