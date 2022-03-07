import type { IApi } from '@umijs/types';
import getPlugins from './utils/getPlugins';

export default (api: IApi) => {
  // features，不开放配置的功能
  api.registerPlugins([
    require.resolve('./features/commonChunks'),
    require.resolve('./features/h5Config'),
    require.resolve('./features/routeExtension'),
  ]);

  return {
    plugins: [
      ...getPlugins({
        root: __dirname,
      }),
    ].filter(Boolean),
  };
};
