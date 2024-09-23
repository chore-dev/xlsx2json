export const isKeyOf = <Target extends ObjectLike>(
  object: Target,
  input: Key
): input is keyof Target => {
  return input in object;
};

export const isObject = (input: unknown): input is ObjectLike => {
  return typeof input === 'object' && !Array.isArray(input) && input !== null;
};

type Key = string | number | symbol;

type ObjectLike = Record<Key, unknown>;
