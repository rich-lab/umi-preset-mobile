// h5v1 默认加的 umi-plugin-react/hd 的插件，这个插件是给非 h5v1 使用的
import path from 'path';
import { BundlerConfigType } from '@umijs/types';
import type { IApi, IRoute } from '@umijs/types';
import px2rem, { IOpts } from 'postcss-plugin-px2rem';

const All_MODES = ['flex', 'vw', '750'];

export type HdOptions = {
  theme?: object;
  px2rem?: IOpts;
  mode?: 'flex' | 'vw' | '750';
};

// 递归遍历routes配置，获取hd配置
export const getModeRecursion = (routes: IRoute[], initialMode: string) => {
  const r = [initialMode];
  const getRoutesMode = (childRoutes: IRoute[]) => {
    for (const route of childRoutes) {
      const mode = route.hdMode;

      if (mode && All_MODES.includes(mode) && !r.includes(mode)) {
        r.push(mode);
      }

      if (Array.isArray(route.routes)) {
        getRoutesMode(route.routes);
      }
    }
  };

  getRoutesMode(routes);

  return r;
};

export default (api: IApi) => {
  api.describe({
    key: 'hd',
    config: {
      default: { mode: 'vw' },
      schema(joi) {
        return joi.object({
          theme: joi.object(),
          px2rem: joi.object(),
          mode: joi
            .string()
            .valid(...All_MODES)
            .error(new Error(`hd mode 只支持 ${All_MODES.join('|')}`)),
        });
      },
    },
    // enableBy: api.EnableBy.config,
  });

  function getOptMode() {
    return api.config.hd?.mode || 'vw';
  }

  // HTML 头部插入 meta
  api.modifyHTML(($) => {
    const viewport = $('head meta[name="viewport"]'); // umi 默认 layout 有一个1倍缩放的 viewport

    viewport.after('<meta name="apple-mobile-web-app-capable" content="yes"/>');
    viewport.after(
      '<meta name="apple-mobile-web-app-status-bar-style" content="black"/>',
    );
    viewport.after('<meta name="format-detection" content="telephone=no"/>');
    viewport.after('<meta name="format-detection" content="email=no"/>');
    viewport.after(
      '<meta name="viewport" content="width=device-width,initial-scale=0.5,maximum-scale=0.5,minimum-scale=0.5,user-scalable=no">',
    );
    viewport.remove();

    return $;
  });

  api.chainWebpack(async (memo, { type }) => {
    // SSR 用不到其他模式的 entry，所以不做生成
    if (type === BundlerConfigType.ssr) {
      return memo;
    }

    const routes = await api.getRoutes();
    // 递归获取route配置的hd mode
    const usedModes = getModeRecursion(routes, getOptMode());

    // 使用到的mode(s)，生成entry
    usedModes.forEach((m) => {
      memo.entry(m).add(path.join(__dirname, `./mode/${m}.js`));
    });

    return memo;
  });

  // 修改 HTML 内引入的 chunks，增加 hd
  api.modifyHTMLChunks((chunks, { route }) => {
    const mode = route.hdMode || getOptMode();
    return chunks.concat([{ name: mode, headScript: true }]);
  });

  // 修改配置，支持 px2rem
  api.modifyDefaultConfig((config) => {
    const draftConfig = Object.assign({}, config);
    const { theme, px2rem: configPx2rem } = api.userConfig?.hd || {};

    draftConfig.theme = {
      ...(draftConfig.theme || {}),
      '@hd': '2px',
      ...(theme || {}),
    };

    draftConfig.extraPostCSSPlugins = [
      ...(draftConfig.extraPostCSSPlugins || []),
      px2rem({
        rootValue: 100,
        minPixelValue: 2,
        ...(configPx2rem || {}),
      }),
    ];

    return draftConfig;
  });
};
