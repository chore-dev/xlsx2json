import type { OptionDefinitions } from './shared';

// NOTE: Remember to update `DefaultDefinitions` type when adding new definitions
export const DEFAULT_DEFINITIONS = [
  {
    name: 'quiet',
    alias: 'Q',
    type: Boolean,
    defaultValue: false
  }
] as const satisfies OptionDefinitions;

// TODO: Implement `DefaultDefinitions` type automatically based on `DEFAULT_DEFINITIONS`
export type DefaultDefinitions = { quiet: boolean };
