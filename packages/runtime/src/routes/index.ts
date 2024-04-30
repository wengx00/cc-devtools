import { lazy, LazyExoticComponent } from 'react';

const pages = import.meta.glob('/src/pages/**/*.tsx');

export interface LazyModule {
  default: (props: any) => JSX.Element;
  [key: string]: (props: any) => JSX.Element;
}

export interface Route {
  path: string;
  children: Route[];
  lazyComponent: LazyExoticComponent<any> | null;
  layout?: LazyExoticComponent<any>;
}

export function progressiveInsertRoute(
  target: Route,
  path: string[],
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
  let targetIndex = target.children.findIndex(({ path: p }) => p === path[0]);
  if (targetIndex === -1) {
    target.children.push({
      path: path[0],
      children: [],
      lazyComponent: null,
    });
    targetIndex = target.children.length - 1;
  }
  progressiveInsertRoute(
    target.children[targetIndex],
    path.slice(1),
    lazyModule,
  );
}

const routes: Route = {
  path: '/',
  children: [],
  lazyComponent: null,
};
Object.entries(pages).forEach(([path, loadModule]) => {
  const currentPath = path.slice('/src/pages/'.length).split('/');
  progressiveInsertRoute(routes, currentPath, loadModule as any);
});

export default routes;
