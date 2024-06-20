export const isString = (value: unknown): value is string => {
  return typeof value === 'string';
};

export const replaceByPairs = (input: string, pairs: Record<string, unknown> = {}) => {
  return Object.entries(pairs).reduce((replacedInput, [key, value]) => {
    let _value = value;
    if (Array.isArray(value)) _value = value.join(', ');
    if (!isString(value)) _value = JSON.stringify(value);

    return replacedInput.replace(new RegExp(`{{${key}}}`, 'g'), _value as string);
  }, input);
};
