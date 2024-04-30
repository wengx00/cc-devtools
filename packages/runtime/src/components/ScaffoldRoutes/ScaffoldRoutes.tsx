import { lazy, ReactNode, useMemo } from 'react';

import { Route, Routes } from 'react-router-dom';

import { Route as RouteType } from '@/routes';

const EmptyLayout = lazy(() => import('./EmptyRoute'));

export function routesRenderer(route: RouteType): ReactNode {
  return (
    <Route
      path={route.path}
      key={route.path}
      Component={route.layout || EmptyLayout}
    >
      {route.lazyComponent && (
        <Route
          key={`${route.path}/`}
          path={`${route.path}/`}
          Component={route.layout || EmptyLayout}
        />
      )}
      {route.children.map(child => routesRenderer(child))}
    </Route>
  );
}

export function ScaffoldRoutes(props: { routes: RouteType }) {
  const routes = useMemo(() => routesRenderer(props.routes), [props.routes]);
  return <Routes>{routes}</Routes>;
}
