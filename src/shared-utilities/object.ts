export const isKeyOf = <Object extends Record<string | number | symbol, unknown>>(
  object: Object,
  input: string | number | symbol
): input is keyof Object => {
  return input in object;
};

export const isObject = (input: unknown): input is Record<string, unknown> => {
  return typeof input === 'object' && !Array.isArray(input) && input !== null;
};
