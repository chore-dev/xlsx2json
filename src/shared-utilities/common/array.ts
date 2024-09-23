export const arrayWrap = <Input>(input: Input | Input[]): Input[] => {
  return Array.isArray(input) ? input : [input];
};
