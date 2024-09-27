import type { ObjectKey, ObjectLike } from '../types/common.js';

export const isKeyOf = <Target extends ObjectLike>(
  object: Target,
  input: ObjectKey
): input is keyof Target => {
  return input in object;
};
