import commandLineArgs from 'command-line-args';

import { CliArguments } from '../types/global';

const commandLineArguments = commandLineArgs([
  { name: 'config', alias: 'C', type: String },
  { name: 'dry-run', alias: 'D', type: Boolean },
  { name: 'quiet', alias: 'Q', type: Boolean }
]) as CliArguments;

export default commandLineArguments;
