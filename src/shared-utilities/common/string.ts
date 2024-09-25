export const replacePlaceholders = (
  input: string,
  values: Record<string, unknown> = {},
  _delimiter?: { array?: string; prefix?: string; suffix?: string }
) => {
  const delimiter = Object.assign({ array: ', ', prefix: '{{', suffix: '}}' }, _delimiter);

  return Object.entries(values).reduce((replacedInput, [key, _value]) => {
    let value = _value;
    if (Array.isArray(value)) value = value.join(delimiter.array);

    return replacedInput.replace(
      new RegExp(`${delimiter.prefix}${key}${delimiter.suffix}`, 'g'),
      `${value}`
    );
  }, input);
};
