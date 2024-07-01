import Param from './param';

import { Pipeline } from '@/utils';

export default function Body(
  id?: string,
  options?: {
    pipelines?: Pipeline[];
  },
): ParameterDecorator {
  return Param('body', id, options);
}
