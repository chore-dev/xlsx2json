import { z } from 'zod';

import Schema from '../config';

export type Columns = ConfigOptions['keys'] & ConfigOptions['values'];

export type ConfigOptions = z.input<typeof Schema>;

export type Row = Record<string, unknown>;
