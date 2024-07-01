import metaType from './meta-type';
import { ParameterInfo } from './utils';

export default function Param(
  group: string,
  id?: any,
  options?: {
    pipelines?: ((x: any) => any)[];
  },
): ParameterDecorator {
  return (target, propKey, index) => {
    const { pipelines = [] } = options ?? {};
    const params: ParameterInfo[] =
      Reflect.getMetadata(metaType.injectParam, target, propKey as any) ?? [];
    const types =
      Reflect.getMetadata(metaType.paramTypes, target, propKey as any) ?? [];
    params.unshift({
      index,
      id,
      constructor: types[index],
      pipelines,
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
