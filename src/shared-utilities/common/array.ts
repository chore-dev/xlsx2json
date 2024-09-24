export const arrayWrap = <Input>(input: Input | Array<Input>): Array<Input> => {
  return Array.isArray(input) ? input : [input];
};

export const isArray = (input: unknown): input is Array<unknown> => {
  return Array.isArray(input);
};
