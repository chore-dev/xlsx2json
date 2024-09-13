import { Messages } from '../node/logger/shared';

export const messagesConverter = <Input>(
  inputs: Array<Input>,
  processor: (input: Input, index: number, inputs: Array<Input>) => Messages
): Messages => {
  return inputs.map(processor).flat();
};
