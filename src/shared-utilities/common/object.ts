import { ObjectKey, ObjectLike } from '../types/common';

export const isKeyOf = <Target extends ObjectLike>(
  object: Target,
  input: ObjectKey
): input is keyof Target => {
  return input in object;
};
