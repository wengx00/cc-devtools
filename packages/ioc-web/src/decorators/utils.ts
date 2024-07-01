import { Constructor, Pipeline } from '@/utils';

export interface ParameterInfo {
  index: number;
  group: string;
  constructor: Constructor<any>;
  pipelines: Pipeline[];
  id?: any;
}
