import type { IApi, IRoute, IScriptConfig, IStyleConfig } from '@umijs/types';

// import { IHtmlConfig, IScript } from '@umijs/core/lib/Html/types';
import { getScripts, getStyles, getScriptsContent, IHTMLTag } from './utils';

export interface ExtensionRoute extends IRoute {
  headScripts?: IScriptConfig;
  scripts?: IScriptConfig;
  styles?: IStyleConfig;
  links?: Partial<HTMLLinkElement>[]; // @see IHtmlConfig
  metas?: IHTMLTag[];
}

// route 级别的脚本、样式表等扩展配置
// @see umi/core/Html
export default (api: IApi) => {
  api.modifyHTML(($, { route }: { route: ExtensionRoute }) => {
    const { headScripts, scripts, styles, links = [], metas } = route;
    const [linkArr = [], styleArr = []] = getStyles(styles || []);
    const newLinks = links.concat(...linkArr);

    // route插入metas
    if (metas?.length) {
      const metasContent = metas.map((meta) => {
        return [
          '<meta',
          ...Object.keys(meta).reduce((memo, key) => {
            return memo.concat(`${key}="${meta[key]}"`);
          }, [] as string[]),
          '/>',
        ].join(' ');
      });

      $('meta').last().after(metasContent.join('\n'));
    }

    // route插入links
    const linksContent = newLinks.map((link) => {
      return [
        '<link',
        ...Object.keys(link).reduce((memo, key) => {
          return memo.concat(`${key}="${link[key]}"`);
        }, [] as string[]),
        '/>',
      ].join(' ');
    });
    $('head').eq(0).append(linksContent.join('\n'));

    // route插入styles
    const stylesContent = styleArr.map((style) => {
      const { content = '', ...attrs } = style;
      const newAttrs = Object.keys(attrs).reduce((memo, key) => {
        return memo.concat(`${key}="${attrs[key]}"`);
      }, [] as string[]);

      return [
        `<style${newAttrs.length ? ' ' : ''}${newAttrs.join(' ')}>`,
        content
          .split('\n')
          .map((line) => `  ${line}`)
          .join('\n'),
        '</style>',
      ].join('\n');
    });
    $('head').eq(0).append(stylesContent.join('\n'));

    // route插入head scripts
    if (headScripts?.length) {
      $('head')
        .eq(0)
        .append(getScriptsContent(getScripts(headScripts)));
    }

    // route插入body scripts
    if (scripts?.length) {
      const mountElementId = api.config.mountElementId || 'root';
      const scriptsContent = getScriptsContent(getScripts(scripts.reverse()));

      $(`#${mountElementId}`).after(scriptsContent);
      // $('body').eq(0).append(getScriptsContent(getScripts(scripts)));
    }

    return $;
  });
};
