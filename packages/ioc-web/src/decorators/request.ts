import metaType from './meta-type';

export default function Request(path: string, method: string): MethodDecorator {
  return (target, key) => {
    const migrateRoutes =
      Reflect.getMetadata(metaType.requestHandlers, target) ?? {};
    const routes = {
      ...migrateRoutes,
      [path]: [
        ...(migrateRoutes[path] ?? []),
        {
          method,
          key,
        },
      ],
    };
    Reflect.defineMetadata(metaType.requestHandlers, routes, target);
  };
}
