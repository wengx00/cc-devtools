import { ReactNode } from 'react';

import { Route } from 'react-router-dom';

import { Route as RouteType } from '@/routes';

const EmptyLayout = (): any => import('./EmptyRoute');

export function routesRenderer(route: RouteType): ReactNode {
  return (
    <Route
      path={route.path}
      key={route.path}
      lazy={route.layout || EmptyLayout}
    >
      {route.lazyComponent && (
        <Route
          key={`${route.path}/`}
          path={`${route.path}/`}
          lazy={route.layout || EmptyLayout}
        />
      )}
      {route.children.map(child => routesRenderer(child))}
    </Route>
  );
}
