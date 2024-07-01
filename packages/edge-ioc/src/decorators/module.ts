import metaType from './meta-type';

import { Constructor } from '@/utils';

export interface ModuleOptions {
  controllers?: Constructor<any>[];
  providers?: Constructor<any>[];
  modules?: Constructor<any>[];
  base?: string;
}

export default function Module(options: ModuleOptions): ClassDecorator {
  return (target) => {
    Reflect.defineMetadata(metaType.moduleOptions, options, target);
  };
}
