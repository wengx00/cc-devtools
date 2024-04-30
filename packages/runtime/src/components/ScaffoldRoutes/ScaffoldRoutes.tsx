import { ReactNode, useMemo } from 'react';

import { Outlet, Route, Routes } from 'react-router-dom';

import { Route as RouteType } from '@/routes';

function EmptyLayout() {
  return <Outlet />;
}

export function routesRenderer(route: RouteType): ReactNode {
  return (
    <Route
      path={route.path}
      key={route.path}
      Component={route.layout || EmptyLayout}
    >
      {route.lazyComponent && (
        <Route path="/" Component={route.lazyComponent} />
      )}
      {route.children.map(child => routesRenderer(child))}
    </Route>
  );
}

export function ScaffoldRoutes(props: { routes: RouteType }) {
  const routes = useMemo(() => routesRenderer(props.routes), [props.routes]);
  return <Routes>{routes}</Routes>;
}
