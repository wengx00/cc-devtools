import Param from './param';

import { Pipeline } from '@/utils';

export default function Query(
  id?: string,
  options?: {
    pipelines?: Pipeline[];
  },
): ParameterDecorator {
  return Param('query', id, options);
}
