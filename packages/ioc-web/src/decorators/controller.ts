import metaType from './meta-type';

export default function Controller(path: string): ClassDecorator {
  return (target) => {
    Reflect.defineMetadata(metaType.controllerPath, path, target);
  };
}
