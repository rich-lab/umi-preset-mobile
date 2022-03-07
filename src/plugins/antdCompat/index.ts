import type { IApi } from '@umijs/types';

import { dirname } from 'path';

/**
 * 关闭@umijs/plugin-antd插件，但开启antd-mobile
 */
export default (api: IApi) => {
  api.describe({
    key: 'antdCompat',
    config: {
      schema: (joi) =>
        joi.object({
          version: joi.alternatives(2, 5),
        }),
      default: {
        version: 2,
      },
    },
    // enableBy: api.EnableBy.config, // 用户配置开启
  });

  // 跳过antd插件
  api.skipPlugins(['@umijs/plugin-antd']);

  // 禁用antd，防止request插件引入相关样式
  // @see https://github.com/umijs/plugins/blob/master/packages/plugin-request/src/index.ts#L65
  api.modifyDefaultConfig((memo) => ({ antd: false, ...memo }));

  // 下面是开启antd-mobile的功能，保证antd-mobile@2的使用不受影响
  if (api.userConfig?.antdCompat?.version === 2) {
    api.chainWebpack((memo) => {
      // set resolve alias if has aliasName existed
      const setResolveAlias = (aliasName: string, moduleName: string): void => {
        if (memo.resolve.alias.has(moduleName)) {
          memo.resolve.alias.set(aliasName, moduleName);
        }
      };

      setResolveAlias('@umijs/antd-mobile', 'antd-mobile');

      return memo;
    });

    api.modifyBabelPresetOpts((opts) => {
      return {
        ...opts,
        import: (opts.import || []).concat([
          { libraryName: 'antd-mobile', libraryDirectory: 'es', style: true },
        ]),
      };
    });

    api.addProjectFirstLibraries(() => [
      {
        name: 'antd-mobile',
        path: dirname(require.resolve('antd-mobile/package.json')),
      },
    ]);
  }
};
