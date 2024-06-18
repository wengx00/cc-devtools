import metaType from './meta-type';
import { ParameterInfo } from './utils';

export default function Param(group: string, id?: any): ParameterDecorator {
  return (target, propKey, index) => {
    const params: ParameterInfo[] =
      Reflect.getMetadata(metaType.injectParam, target, propKey as any) ?? [];
    const types =
      Reflect.getMetadata(metaType.param, target, propKey as any) ?? [];
    params.unshift({
      index,
      id,
      constructor: types[index],
      group,
    });
    Reflect.defineMetadata(
      metaType.injectParam,
      params,
      target,
      propKey as any,
    );
  };
}
