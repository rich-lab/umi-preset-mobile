/**
 * H5 引入 React 的方案
 */
import { BundlerConfigType } from '@umijs/types';
import type { IApi, IRoute } from '@umijs/types';

export const REACT_URL = {
  '17': {
    dev: [
      'https://unpkg.com/react@17/umd/react.development.js',
      'https://unpkg.com/react-dom@17/umd/react-dom.development.js',
    ],
    prod: [
      'https://unpkg.com/react@17/umd/react.production.min.js',
      'https://unpkg.com/react-dom@17/umd/react-dom.production.min.js',
    ],
  },
  '16.8.6': {
    dev: [
      'https://unpkg.com/react@16.8.6/umd/react.development.js',
      'https://unpkg.com/react-dom@16.8.6/umd/react-dom.development.js',
    ],
    prod: [
      'https://unpkg.com/react@16.8.6/umd/react.production.min.js',
      'https://unpkg.com/react-dom@16.8.6/umd/react-dom.production.min.js',
    ],
  },
};

type ReactEnv = 'dev' | 'prod';
type VersionType = keyof typeof REACT_URL;
function getReactURL(version: VersionType, env: ReactEnv) {
  return REACT_URL[version][env];
}

export interface H5ReactExternalOpt {
  version?: VersionType;
}

export default (api: IApi) => {
  api.describe({
    key: 'reactExternal',
    config: {
      default: {
        version: '16.8.6',
      },
      schema(joi) {
        return joi.object({
          version: joi
            .string()
            .valid(...Object.keys(REACT_URL))
            .error(
              new Error(
                `React version 只支持 ${Object.keys(REACT_URL).join(', ')}`,
              ),
            ),
        });
      },
    },
    enableBy: api.EnableBy.config, // 配置开启
  });

  // 设置 React external
  api.chainWebpack((memo, { type }) => {
    // SSR 下不做 external，因为预渲染环境没有 HTML，需要把依赖打包
    if (type === BundlerConfigType.ssr) {
      api.logger.warn(
        '该项目开启了 ssr 配置，将生成用于服务端渲染的 umi.server.js，但服务端渲染产物无法使用自动 external，请确保项目中已安装期望的 React 及 ReactDOM 版本，否则将使用 Umi 内置的版本；注：用于客户端渲染的构建产物不受影响',
      );

      return memo;
    }

    memo.merge({
      externals: {
        react: 'React',
        'react-dom': 'ReactDOM',
        '@umijs/react': 'React',
        '@umijs/react-dom': 'ReactDOM',
      },
    });
    return memo;
  });

  // HTML 中插入 React 外链
  api.modifyHTML(($, { route }: { route: IRoute }) => {
    const version = api.config.h5ReactExternal?.version || '16.8.6';
    const env = process.env.NODE_ENV === 'development' ? 'dev' : 'prod';
    const reactURL = route?.reactVersion
      ? getReactURL(route.reactVersion, env)
      : getReactURL(version, env);
    const mountElementId = api.config.mountElementId || 'root';

    reactURL
      .slice()
      .reverse()
      .forEach((url) => {
        $(`#${mountElementId}`).after(`<script src="${url}"></script>`);
      });

    return $;
  });
};
