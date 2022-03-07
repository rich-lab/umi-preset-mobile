import type { IApi } from '@umijs/types';

export default (api: IApi) => {
  // 多页应用需要开启的配置
  let extraConfig: any = {
    // 输出 html 文件
    exportStatic: {
      htmlSuffix: true,
      dynamicRoot: true,
    },
    // dynamicRoot设置了true，runtimePublicPath也要跟着设置
    runtimePublicPath: true,
    // h5 默认开启动态加载
    dynamicImport: {
      // 默认给一个空 loading
      loading: require.resolve('../components/loading'),
    },
  };

  // 覆盖默认配置
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
