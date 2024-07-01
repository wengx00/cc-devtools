import { Pipeline } from '@/core/factory';
import { Constructor } from '@/utils';

export interface ParameterInfo {
  index: number;
  group: string;
  constructor: Constructor<any>;
  pipelines: Pipeline[];
  id?: any;
}
