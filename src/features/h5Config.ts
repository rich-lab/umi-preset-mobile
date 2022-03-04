import type { IApi } from '@umijs/types';

export default (api: IApi) => {
  const { deployMode } = api.userConfig;

  // 同时支持 deployMode: { mode: 'xxx } 和 deployMode: 'xxx'
  const mode = deployMode?.mode || deployMode;

  // 多页应用需要开启的配置
  let extraConfig: any = {
    // 输出 html 文件
    exportStatic: {
      htmlSuffix: true,
      dynamicRoot: true,
    },
    // dynamicRoot设置了true，runtimePublicPath也要跟着设置
    runtimePublicPath: true,
    // Bigfish 2 中对 h5 是默认开启动态加载
    dynamicImport: {
      // 默认给一个空 loading
      loading: require.resolve('../components/loading'),
    },
  };

  // 对于 assets 部署模式，需要使用SPA
  if (mode === 'assets') {
    extraConfig = {};
  }

  // 覆盖bigfish默认配置
  api.modifyDefaultConfig((memo) => {
    return {
      ...memo,
      ...extraConfig,
      hash: true,
      cssnano: {
        ...(memo.cssnano || {}),
        // ref: https://github.com/cssnano/cssnano/issues/578
        // ref: https://github.com/postcss/postcss-calc
        calc: false,
        // 同步 umi 关于 normalizeUrl 的配置：https://github.com/umijs/umi/issues/955
        normalizeUrl: false,
      },
      targets: {
        ios: 8,
        android: 4,
      },
    };
  });
};
