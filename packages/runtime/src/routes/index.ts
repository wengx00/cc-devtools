import { lazy, LazyExoticComponent } from 'react';

export interface LazyModule {
  default: (props: any) => JSX.Element;
  [key: string]: (props: any) => JSX.Element;
}

export interface Route {
  path: string;
  children: Route[];
  lazyComponent?: LazyExoticComponent<any> | null;
  layout?: LazyExoticComponent<any>;
}

export function progressiveInsertRoute(
  target: Route,
  path: string[],
  parent: string,
  lazyModule: () => Promise<LazyModule>,
) {
  if (path.length === 1) {
    if (path[0] === 'page.tsx') {
      // eslint-disable-next-line no-param-reassign
      target.lazyComponent = lazy(lazyModule);
      return;
    }
    if (path[0] === 'layout.tsx') {
      // eslint-disable-next-line no-param-reassign
      target.layout = lazy(lazyModule);
      return;
    }
    return;
  }
  const currentPath = `${parent}/${path[0]}`;
  let targetIndex = target.children.findIndex(
    ({ path: p }) => p === currentPath,
  );
  if (targetIndex === -1) {
    target.children.push({
      path: currentPath,
      children: [],
      lazyComponent: null,
    });
    targetIndex = target.children.length - 1;
  }
  progressiveInsertRoute(
    target.children[targetIndex],
    path.slice(1),
    currentPath,
    lazyModule,
  );
}

export function getRoutes(pages: Record<string, () => Promise<any>>) {
  const routes: Route = {
    path: '/',
    children: [],
    lazyComponent: null,
  };
  Object.entries(pages).forEach(([path, loadModule]) => {
    const currentPath = path.slice('/src/pages/'.length).split('/');
    progressiveInsertRoute(routes, currentPath, '', loadModule as any);
  });

  return routes;
}
