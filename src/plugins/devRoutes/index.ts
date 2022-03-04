/**
 * 404插件，从umi2移植过来
 * @see https://github.com/umijs/umi/tree/2.5.x/packages/umi-build-dev/src/plugins/404
 */
import { join } from 'path';
import type { IApi, IRoute } from '@umijs/types';
import { winPath } from '@umijs/utils';

export default (api: IApi) => {
  if (process.env.NODE_ENV === 'development') {
    api.addBeforeMiddlewares(async () => {
      const genRoutes = await api.getRoutes();

      return (req, res, next) => {
        if (req.path === '/__umiDev/routes') {
          res.setHeader('Content-Type', 'text/json');
          res.send(JSON.stringify(genRoutes));
        } else {
          next();
        }
      };
    });

    api.modifyRoutes((routes: IRoute[]) => {
      const ROOT_PATH = '/';
      const hasRootPath = (routes: IRoute[]) =>
        routes.find((route) => route.path === ROOT_PATH && !!route.component);
      const rootPath = {
        path: ROOT_PATH,
        component: winPath(join(__dirname, 'routes.js')),
      };

      function addRootPath(route: IRoute) {
        if (!route.routes) {
          return;
        }
        route.routes.forEach((_r) => addRootPath(_r));
        if (!hasRootPath(route.routes)) route.routes.push(rootPath);
      }

      routes.forEach((r) => addRootPath(r));

      if (!hasRootPath(routes)) routes.push(rootPath);

      return routes;
    });
  }
};
