import Param from './param';

import { Pipeline } from '@/utils';

export default function File(
  id?: string,
  options?: {
    pipelines?: Pipeline[];
  },
): ParameterDecorator {
  return Param('file', id, options);
}
