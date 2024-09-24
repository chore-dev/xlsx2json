export const isFunction = (input: unknown): input is FunctionLike => {
  return typeof input === 'function';
};

type FunctionLike = (...args: unknown[]) => unknown;
