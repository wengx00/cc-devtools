import { Constructor } from '@/utils';

export interface ParameterInfo {
  index: number;
  group: string;
  constructor: Constructor<any>;
  pipelines: ((value: any) => any)[];
  id?: any;
}
