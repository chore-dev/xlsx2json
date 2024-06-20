interface Config {
  input: string;
  outputDir: string;
}

type Xlsx2JsonConfigs = Array<Config> | Config;
