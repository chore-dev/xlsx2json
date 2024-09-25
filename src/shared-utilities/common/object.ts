export const isKeyOf = <Target extends ObjectLike>(
  object: Target,
  input: Key
): input is keyof Target => {
  return input in object;
};

type Key = string | number | symbol;

type ObjectLike = Record<Key, unknown>;
