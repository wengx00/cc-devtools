import metaType from './meta-type';

export default function Injectable(): ClassDecorator {
  return (target) => {
    Reflect.defineMetadata(
      metaType.param,
      Reflect.getMetadata(metaType.param, target),
      target,
    );
  };
}
