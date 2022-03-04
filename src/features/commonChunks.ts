import type { IApi } from '@umijs/types';

export default (api: IApi) => {
  // 如果一个模块被两个 chunk 依赖那就打入 common.js
  api.chainWebpack((memo, { mfsu }) => {
    // 针对 mfsu 预编译依赖的配置不开启
    if (mfsu) return memo;

    memo.optimization.splitChunks({
      cacheGroups: {
        commons: {
          name: 'commons',
          chunks: 'async',
          minChunks: 2,
          minSize: 0,
        },
      },
    });

    return memo;
  });
};
