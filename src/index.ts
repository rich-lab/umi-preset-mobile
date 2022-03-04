import type { IApi } from '@umijs/types';
import getPlugins from './utils/getPlugins';

export default (api: IApi) => {
  // 非h5应用，则下面的插件都不注册
  if (api.userConfig.appType !== 'h5') return;

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
