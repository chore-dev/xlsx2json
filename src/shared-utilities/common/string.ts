export const isString = (input: unknown): input is string => {
  return typeof input === 'string';
};

export const replacePlaceholders = (
  input: string,
  values: Record<string, unknown> = {},
  _delimiter?: { prefix: string; suffix: string }
) => {
  const delimiter = Object.assign({ prefix: '{{', suffix: '}}' }, _delimiter);

  return Object.entries(values).reduce((replacedInput, [key, _value]) => {
    let value = _value;
    if (Array.isArray(_value)) value = _value.join(', ');
    if (!isString(_value)) value = JSON.stringify(_value);

    return replacedInput.replace(
      new RegExp(`${delimiter.prefix}${key}${delimiter.suffix}`, 'g'),
      `${value}`
    );
  }, input);
};
