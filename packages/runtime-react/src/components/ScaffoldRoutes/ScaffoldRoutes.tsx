import { ReactNode, Suspense, useMemo } from 'react';

import { Route, Routes } from 'react-router-dom';

import EmptyRoute from './EmptyRoute';

import { Route as RouteType } from '@/routes';

export function routesRenderer(route: RouteType): ReactNode {
  const {
    layout: Layout,
    lazyComponent: Page,
    loadingComponent: Loading,
  } = route;
  return (
    <Route
      path={route.path}
      key={route.path}
      element={
        <Suspense fallback={Loading && <Loading />}>
          {Layout ? <Layout /> : <EmptyRoute />}
        </Suspense>
      }
    >
      {Page && (
        <Route
          key={`${route.path}/`}
          path=""
          element={
            <Suspense fallback={Loading && <Loading />}>
              <Page />
            </Suspense>
          }
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
