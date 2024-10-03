import application from '../../application';
import { formatAlertMessage } from '../../shared-utilities/node/logger/format';
import type { Row } from '../../types/global';
import type { KeySegments } from '../../xlsx2json/key';

const SKIPPED = 'SKIPPED';
const OVERWRITE = 'OVERWRITE';

const messageBuilder = (
  logger: (typeof application)['error'] | (typeof application)['warn'],
  type: string,
  issue: string,
  message: string,
  additionalInformation?: string
) => {
  logger([['\n'], [formatAlertMessage(type, issue, message)]]);
  if (additionalInformation) {
    application.indent.increase();
    logger(`└ ${additionalInformation}`);
    application.indent.decrease();
  }
  application.lineBreak();
};

export const duplicateKeyMessage = (key: string, overwrite?: boolean) => {
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

export const incompleteKeyMessage = (segments: KeySegments, row: Row) => {
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

export const missingValueMessage = (key: string) => {
  messageBuilder(
    application.error,
    SKIPPED,
    'MISSING_VALUE',
    key,
    'Remove `fallbackValue`: false or set `fallbackValue` to a string to preserve a key with no value'
  );
};
