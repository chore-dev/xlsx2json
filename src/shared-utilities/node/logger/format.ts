import { constantCase } from 'change-case';

export const formatAlertMessage = (type: string, issue: string, message: string) => {
  return `[${constantCase(type)}] [${constantCase(issue)}] ${message}`;
};
