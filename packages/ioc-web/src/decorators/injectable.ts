import metaType from './meta-type';

export default function Injectable(): ClassDecorator {
  return (target) => {
    Reflect.defineMetadata(
      metaType.paramTypes,
      Reflect.getMetadata(metaType.paramTypes, target),
      target,
    );
  };
}
