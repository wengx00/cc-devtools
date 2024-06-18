import { ModuleOptions, ParameterInfo, metaType } from '@decorators';

import { IApplication, IRequest } from './application';
import Container from './container';

import { Constructor, NotFoundException, constants } from '@/utils';

export type IocRequest = IRequest & { query: URLSearchParams };

export type IHandler = { key: string; method: string };

export type IRoutes = Map<
  string,
  {
    handlers: Record<string, IHandler[] | undefined>;
    controller: Constructor<any>;
  }
>;

export type IParamsHandler = (
  info: ParameterInfo & { request: IocRequest },
) => any | Promise<any>;

function handlerDispatcher(
  request: IocRequest,
  routes: IRoutes,
  iocContainer: Container,
) {
  const { path, method } = request;
  const splitPath = path.split('/').filter((item) => item.trim().length > 0);
  // 探测路由
  const pathSegment = [];
  let controller: Constructor<any> | null = null;
  let handler: IHandler | null = null;
  for (let i = 0; i < splitPath.length; i += 1) {
    pathSegment.push(splitPath[i]);
    if (routes.has(pathSegment.join('/'))) {
      const route = routes.get(pathSegment.join('/'))!;
      if (!route) {
        continue;
      }
      const { handlers, controller: targetController } = route;
      const targetHandler = (
        handlers[splitPath.slice(i + 1).join('/')] ?? []
      ).find(({ method: targetMethod }) => targetMethod === method);
      if (!targetHandler) {
        // 有controller但没有handler直接退出
        break;
      }
      handler = targetHandler;
      controller = targetController;
      break;
    }
  }
  if (!controller || !handler) {
    throw new NotFoundException();
  }
  const instance = iocContainer.resolve(controller);
  return {
    controller,
    instance,
    handler: instance[handler.key] as (...args: any[]) => any,
    key: handler.key,
  };
}

function generateRoutesMap(
  iocContainer: Container,
  rootModule: Constructor<any>,
) {
  const routes: IRoutes = new Map();
  const moduleOptions: ModuleOptions = Reflect.getMetadata(
    metaType.moduleOptions,
    rootModule,
  ) ?? { controllers: [] };
  const { controllers } = moduleOptions;

  controllers.forEach((controller) => {
    iocContainer.register(controller);
    const path: string = Reflect.getMetadata(
      metaType.controllerPath,
      controller,
    );
    if (routes.has(path)) {
      throw new Error(`Duplicate controller path: ${path}`);
    }
    routes.set(path, {
      handlers: Reflect.getMetadata(metaType.requestHandlers, controller) ?? {},
      controller,
    });
  });
  return routes;
}

export default class IocFactory implements IApplication {
  private paramsHandler: IParamsHandler[] = [];

  private routes: IRoutes;

  private container = new Container();

  private constructor(rootModule: Constructor<any>) {
    // 生成路由和Controller的映射关系
    this.routes = generateRoutesMap(this.container, rootModule);
  }

  async handleHttpRequest(request: IRequest) {
    const { routes, container, paramsHandler } = this;
    const { url } = request;
    const iocRequest: IocRequest = {
      ...request,
      query: new URL(url).searchParams,
    };
    const { controller, handler, key, instance } = handlerDispatcher(
      iocRequest,
      routes,
      container,
    );

    // 注入params
    const paramsInjectInfo: ParameterInfo[] =
      Reflect.getMetadata(metaType.injectParam, controller, key) ?? [];
    const paramsInjectData: any[] = [];
    for (let i = 0; i < paramsInjectInfo.length; i += 1) {
      const { index, group, id, constructor } = paramsInjectInfo[i];
      if (group === constants.parameterGroup.query) {
        // 处理QS
        if (id) {
          paramsInjectData.push(iocRequest.query.get(id));
          continue;
        }
        paramsInjectData.push(Object.fromEntries(iocRequest.query.entries()));
        continue;
      }
      if (group === constants.parameterGroup.body) {
        // 处理body
        if (request.headers.get('content-type')?.includes('application/json')) {
          // JSON包体
          const body: Record<string, any> = await request.json();
          if (id) {
            paramsInjectData.push(body[id]);
            continue;
          }
          paramsInjectData.push(body);
          continue;
        }
        if (
          request.headers.get('content-type')?.includes('multipart/form-data')
        ) {
          // form-data包体
          const body = await request.formData();
          if (id) {
            paramsInjectData.push(body.get(id));
            continue;
          }
          paramsInjectData.push(body);
          continue;
        }
      }
      for (let i = 0; i < paramsHandler.length; i += 1) {
        const handler = paramsHandler[i];
        const result = await handler({
          request: iocRequest,
          index,
          id,
          group,
          constructor,
        });
        if (result !== null) {
          paramsInjectData.push(result);
          break;
        }
      }
      paramsInjectData.push(undefined);
    }
    // 执行处理方法
    return handler.apply(instance, paramsInjectData);
  }

  getContainer() {
    return this.container;
  }

  addParamsHandler(handler: IParamsHandler) {
    this.paramsHandler.push(handler);
  }

  static create(rootModule: Constructor<any>): IocFactory {
    return new IocFactory(rootModule);
  }
}
