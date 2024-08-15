import { z } from 'zod';

import Schema from '../config/schema';

export type Arguments = { config?: string; 'dry-run'?: boolean };

export type Columns = ConfigOptions['keys'] & ConfigOptions['values'];

export type ConfigOptions = z.input<typeof Schema>;

export type Row = Record<string, unknown>;
