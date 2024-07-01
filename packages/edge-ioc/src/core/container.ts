import { metaType } from '@decorators';

import { Constructor } from '@/utils';

export default class Container {
  private readonly dependencies = new Map<Constructor<any>, any>();

  register<T>(constructor: Constructor<T>): void {
    const dependencies: Constructor<any>[] =
      Reflect.getMetadata(metaType.paramTypes, constructor) ?? [];
    const instances = dependencies.map((dependency) =>
      this.resolve(dependency),
    );
    this.dependencies.set(constructor, new constructor(...instances));
  }

  resolve<T>(constructor: Constructor<T>): T {
    let instance = this.dependencies.get(constructor);
    if (!instance) {
      try {
        this.register(constructor);
        instance = this.dependencies.get(constructor);
      } catch (e) {
        throw new Error(`Cannot resolve dependency: ${constructor}`);
      }
    }
    return instance;
  }

  entries() {
    return this.dependencies.entries();
  }

  forEach(
    callbackfn: (
      value: any,
      key: Constructor<any>,
      map: Map<Constructor<any>, any>,
    ) => void,
  ) {
    return this.dependencies.forEach(callbackfn);
  }
}
