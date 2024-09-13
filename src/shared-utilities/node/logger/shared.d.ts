export type Message<Presets extends keyof MessageCollection = never> = string | Presets;

export type Messages<Presets extends keyof MessageCollection = never> = Array<
  [Message<Presets>, Variables?]
>;

export type MessageCollection = Record<string, string | Array<string>>;

export type Variables = Record<string, unknown>;
