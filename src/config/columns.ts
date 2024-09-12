import { z } from 'zod';

const columns = z.array(z.string()).min(1);

export default columns;
