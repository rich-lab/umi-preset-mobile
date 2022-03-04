import type { IScriptConfig, IStyleConfig } from '@umijs/types';
import { IScript, IStyle } from '@umijs/core/lib/Html/types';
import { lodash } from '@umijs/utils';

// ts申明有bug
// export { getScripts, getStyles } from '@umijs/preset-built-in/lib/plugins/features/html/utils';

export interface IHTMLTag {
  [key: string]: string;
}

const EXP_URL = /^(http:|https:)?\/\//;

/**
 * copy from preset-built-in/src/plugins/features/html/utils.ts
 * 格式化 script => object
 * @param option Array<string | IScript>
 */
export const getScripts = (option: IScriptConfig): IScript[] => {
  if (Array.isArray(option) && option.length > 0) {
    return option
      .filter((script) => !lodash.isEmpty(script))
      .map((aScript) => {
        if (typeof aScript === 'string') {
          return EXP_URL.test(aScript)
            ? { src: aScript }
            : { content: aScript };
        }
        // [{ content: '', async: true, crossOrigin: true }]
        return aScript;
      });
  }
  return [];
};

/**
 * copy from preset-built-in/src/plugins/features/html/utils.ts
 * 格式化 styles => [linkObject, styleObject]
 * @param option Array<string | ILink>
 */
export const getStyles = (option: IStyleConfig): [IHTMLTag[], IStyle[]] => {
  const linkArr: IHTMLTag[] = [];
  const styleObj: IStyle[] = [];
  if (Array.isArray(option) && option.length > 0) {
    option.forEach((style) => {
      if (typeof style === 'string') {
        if (EXP_URL.test(style)) {
          // is <link />
          linkArr.push({
            charset: 'utf-8',
            rel: 'stylesheet',
            type: 'text/css',
            href: style,
          });
        } else {
          styleObj.push({
            content: style,
          });
        }
      }
      if (typeof style === 'object') {
        // is style object
        styleObj.push(style);
      }
    });
  }
  return [linkArr, styleObj];
};

// copy from umi/core/Html
export const getScriptsContent = (scripts: IScript[]) => {
  return scripts
    .map((script: any) => {
      const { content, ...attrs } = script;
      if (content && !attrs.src) {
        const newAttrs = Object.keys(attrs).reduce((memo: any, key: string) => {
          return [...memo, `${key}="${attrs[key]}"`];
        }, []);
        return [
          `<script${newAttrs.length ? ' ' : ''}${newAttrs.join(' ')}>`,
          content
            .split('\n')
            .map((line: any) => `  ${line}`)
            .join('\n'),
          '</script>',
        ].join('\n');
      } else {
        const newAttrs = Object.keys(attrs).reduce((memo: any, key: any) => {
          return [...memo, `${key}="${attrs[key]}"`];
        }, []);
        return `<script ${newAttrs.join(' ')}></script>`;
      }
    })
    .join('\n');
};
