import { Constructor } from '@/utils';

export interface ParameterInfo {
  index: number;
  group: string;
  constructor: Constructor<any>;
  id?: any;
}
