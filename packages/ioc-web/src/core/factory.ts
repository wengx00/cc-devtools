import { nextTick } from 'process';

import { ModuleOptions, ParameterInfo, metaType } from '@decorators';

import { IApplication, IRequest } from './application';
import Container from './container';

import {
  Constructor,
  NotFoundException,
  Pipeline,
  constants,
  formatLog,
} from '@/utils';

export type IocRequest = IRequest & { query: URLSearchParams; path: string };

export type IHandler = {
  controller: Constructor<any>;
  handler: (...args: any[]) => any;
  path: string;
  method: string;
  key: string;
};

export type IRoutes = Map<string, Map<string, IHandler>>;

export type IParamsHandler = (
  info: ParameterInfo & { request: IocRequest },
) => any | Promise<any>;

function handlerDispatcher(
  request: IocRequest,
  routes: IRoutes,
  iocContainer: Container,
) {
  const { path, method } = request;
  console.log(formatLog(method, path));
  // 探测路由
  const targetRoute = routes.get(path);
  const targetHandler = targetRoute?.get(method);
  if (!targetHandler) {
    throw new NotFoundException();
  }
  const { controller, handler, key } = targetHandler;
  const instance = iocContainer.resolve(controller);
  return {
    controller,
    instance,
    handler,
    key,
  };
}

function generateRoutesMap(
  iocContainer: Container,
  rootModule: Constructor<any>,
) {
  const routes: IRoutes = new Map();
  const moduleOptions: ModuleOptions =
    Reflect.getMetadata(metaType.moduleOptions, rootModule) ?? {};
  const {
    controllers = [],
    providers = [],
    base = '',
    modules = [],
  } = moduleOptions;

  providers.forEach((provider) => {
    iocContainer.register(provider);
  });

  controllers.forEach((controller) => {
    iocContainer.register(controller);
    const instance = iocContainer.resolve(controller);
    const rootPath: string = Reflect.getMetadata(
      metaType.controllerPath,
      controller,
    );
    // Get Handlers
    const handlers =
      Reflect.getMetadata(metaType.requestHandlers, controller.prototype) ?? {};
    Object.entries(handlers).forEach(
      ([postPath, handlerInfos]: [string, any]) => {
        const requestHandlers: { method: string; key: string }[] =
          handlerInfos || [];
        if (handlerInfos.length === 0) {
          return;
        }
        let path = `${base}/${rootPath}/${postPath}`;
        if (path[path.length - 1] === '/') {
          path = path.slice(0, -1);
        }
        if (path[0] !== '/') {
          path = `/${path}`;
        }
        if (!routes.has(path)) {
          routes.set(path, new Map());
        }
        requestHandlers.forEach(({ method, key }) => {
          if (instance[key] instanceof Function) {
            routes.get(path)!.set(method, {
              method,
              path,
              controller,
              handler: instance[key],
              key,
            });
          }
        });
      },
    );
  });

  // 子模块生成路由
  modules.forEach((module) => {
    const subroutes = generateRoutesMap(iocContainer, module);

    subroutes.forEach((handlers, path) => {
      const fullPath = `/${base}${path}`;
      routes.set(fullPath, handlers);
    });
  });

  return routes;
}

function logRoutes(routes: IRoutes) {
  for (const [path, handlers] of routes) {
    handlers.forEach(({ method }) => {
      console.log(formatLog('Mapping:===>', `${method} ${path}`));
    });
  }
}

export default class IocFactory implements IApplication {
  private paramsHandler: IParamsHandler[] = [];

  private globalPipelines: Pipeline[] = [];

  private routes: IRoutes;

  private container = new Container();

  private constructor(rootModule: Constructor<any>) {
    // 生成路由和Controller的映射关系
    this.routes = generateRoutesMap(this.container, rootModule);
    logRoutes(this.routes);
    nextTick(() => {
      // 执行 OnModuleInit 生命周期
      this.container.forEach((instance) => {
        if (instance.onModuleInit instanceof Function) {
          instance.onModuleInit();
        }
      });
    });
  }

  async handleHttpRequest(request: IRequest) {
    const { routes, container, paramsHandler } = this;
    const { url } = request;
    const urlEntity = new URL(url);
    const { searchParams } = urlEntity;
    let { pathname } = urlEntity;
    if (pathname[pathname.length - 1] === '/') {
      pathname = pathname.slice(0, -1);
    }
    if (pathname[0] !== '/') {
      pathname = `/${pathname}`;
    }
    const iocRequest: IocRequest = {
      ...request,
      query: searchParams,
      path: pathname,
      method: request.method.toUpperCase(),
    };
    const { handler, instance, key } = handlerDispatcher(
      iocRequest,
      routes,
      container,
    );

    // 注入params
    const paramsInjectInfo: ParameterInfo[] =
      Reflect.getMetadata(metaType.injectParam, instance, key) ?? [];
    const paramsInjectData: any[] = [];
    for (let i = 0; i < paramsInjectInfo.length; i += 1) {
      const {
        index,
        group,
        id,
        constructor,
        pipelines: localPipelines,
      } = paramsInjectInfo[i];
      const pipelines = [...this.globalPipelines, ...localPipelines];
      if (group === constants.parameterGroup.query) {
        // 处理QS
        let targetValue: any;
        if (id) {
          targetValue = iocRequest.query.get(id);
        } else {
          targetValue = Object.fromEntries(iocRequest.query.entries());
        }
        for (const pipeline of pipelines) {
          targetValue = await pipeline(targetValue, constructor);
        }
        paramsInjectData.push(targetValue);
        continue;
      }
      if (group === constants.parameterGroup.body) {
        // 处理body
        let targetValue: any;
        if (request.headers.get('content-type')?.includes('application/json')) {
          // JSON包体
          const body: Record<string, any> = await request.json();
          if (id) {
            targetValue = body[id];
          } else {
            targetValue = body;
          }
          for (const pipeline of pipelines) {
            targetValue = await pipeline(targetValue, constructor);
          }
          paramsInjectData.push(targetValue);
          continue;
        }
        if (
          request.headers.get('content-type')?.includes('multipart/form-data')
        ) {
          // form-data包体
          const body = await request.formData();
          if (id) {
            targetValue = body.get(id);
          } else {
            targetValue = Object.fromEntries(body.entries());
          }
          for (const pipeline of pipelines) {
            targetValue = await pipeline(targetValue, constructor);
          }
          paramsInjectData.push(targetValue);
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
          pipelines,
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

  addGlobalPipeline(pipeline: Pipeline) {
    this.globalPipelines.push(pipeline);
  }

  static create(rootModule: Constructor<any>): IocFactory {
    return new IocFactory(rootModule);
  }
}
