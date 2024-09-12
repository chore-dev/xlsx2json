import { declareAlertMessage } from '../shared-utilities/logger/messages';
import { Row } from '../types/global';

import application from './application';
import { KeyBuilderOutput } from './key';

const SKIPPED = 'SKIPPED';
const OVERWRITE = 'OVERWRITE';

const messageBuilder = (
  logger: (typeof application)['error'] | (typeof application)['warn'],
  type: string,
  issue: string,
  message: string,
  additionalInformation?: string
) => {
  application.lineBreak();
  logger(declareAlertMessage(type, issue, message));
  if (additionalInformation) {
    application.indent.increase();
    logger(`└ ${additionalInformation}`);
    application.indent.decrease();
  }
  application.lineBreak();
};

export const promptDuplicateKeyMessage = (key: string, overwrite?: boolean) => {
  if (overwrite) {
    messageBuilder(
      application.warn,
      OVERWRITE,
      'DUPLICATE_KEY',
      key,
      'Set `overwriteDuplicateKey` to false to disallow duplicate key'
    );
  } else {
    messageBuilder(application.error, SKIPPED, 'DUPLICATE_KEY', key);
  }
};

export const promptIncompleteKeyMessage = (segments: KeyBuilderOutput, row: Row) => {
  if (segments.filter(Boolean).length === 0) {
    messageBuilder(application.error, SKIPPED, 'MISSING_KEY', `${JSON.stringify(row)}`);
  } else {
    messageBuilder(
      application.error,
      SKIPPED,
      'INCOMPLETE_KEY',
      segments.map(s => (!s ? 'undefined' : s)).join(', '),
      'Set `allowIncompleteKey` to true to allow this incomplete key'
    );
  }
};

export const promptMissingValueMessage = (key: string) => {
  messageBuilder(
    application.error,
    SKIPPED,
    'MISSING_VALUE',
    key,
    'Remove `fallbackValue`: false or set `fallbackValue` to a string to preserve a key with no value'
  );
};
