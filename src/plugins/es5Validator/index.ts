import type { IApi, webpack } from '@umijs/types';
import { extname } from 'path';
import { chalk } from '@umijs/utils';

class ES5ValidateWebpackPlugin {
  constructor(private api: IApi) {}

  apply(compiler: webpack.Compiler) {
    const acorn = require('acorn');
    const { codeFrameColumns } = require('@babel/code-frame');

    const api = this.api;
    const conf = api.config.es5Validator;
    // const isWebpack5 = !!api.config.webpack5;
    // const hook = isWebpack5 ? 'afterCompile' : 'afterEmit';

    compiler.hooks.emit.tap('ES5Validator', (compilation) => {
      const fileNames = Object.keys(compilation.assets);

      api.logger.debug(`got files: ${fileNames.join(', ')}`);

      fileNames.forEach((fileName) => {
        if (extname(fileName) === '.js') {
          api.logger.debug(`validate es5 for ${fileName}`);
          const asset = compilation.assets[fileName];
          const source = asset.source();

          try {
            acorn.parse(source, {
              ecmaVersion: 5,
              ...conf.acorn,
            });
            api.logger.debug(`parse success ${fileName}`);
          } catch (e) {
            api.logger.debug(`parse failed ${fileName}`);
            const errMsg = [
              chalk.red(
                `Error: ECMAScript 5 validate failed when parsing ${chalk.green.bold(
                  fileName,
                )} (${e.loc.line}, ${e.loc.column})`,
              ),
            ];
            if (
              e.loc.line === 1 &&
              process.env.NODE_ENV === 'production' &&
              process.env.COMPRESS !== 'none'
            ) {
              errMsg.push('');
              errMsg.push(
                `It's hard to locate the problem when code if compressed, try to disable compression and run again.`,
              );
              errMsg.push('');
              errMsg.push(`   COMPRESS=none umi build`);
            } else {
              errMsg.push('');
              errMsg.push(
                codeFrameColumns(
                  source,
                  {
                    start: e.loc,
                  },
                  {
                    highlightCode: true,
                    forceColor: true,
                    message: 'Invalid ECMAScript 5 syntax',
                    linesAbove: 10,
                    linesBelow: 2,
                    ...conf.codeFrame,
                  },
                ),
              );
            }
            errMsg.push('');
            errMsg.push(
              chalk.cyan(
                `Please submit a PR for the problematic package at https://github.com/umijs/es5-imcompatible-versions`,
              ),
            );
            errMsg.push(
              chalk.cyan(
                `For more information: https://github.com/sorrycc/blog/issues/68`,
              ),
            );
            compilation.errors.push(new Error(errMsg.join('\n')));
          }
        }
      });
    });
  }
}

export default (api: IApi) => {
  api.describe({
    key: 'es5Validator',
    config: {
      default: {
        acorn: {},
        codeFrame: {},
      },
      schema(joi) {
        return joi.object({
          codeFrame: joi.object({
            highlightCode: joi.boolean(),
            linesAbove: joi.number(),
            linesBelow: joi.number(),
            forceColor: joi.boolean(),
            message: joi.string(),
          }),
          acorn: joi.object(),
        });
      },
    },
    // 配置开启
    // enableBy: api.EnableBy.config,
  });

  // CI时跳过 validator，不然跑CI会卡住
  if (!!process.env.CI || process.env.__FROM_UMI_TEST) {
    return console.log('[es5Validator] ci跳过检查');
  }

  api.chainWebpack((memo) => {
    memo.plugin('ecma5-validate').use(ES5ValidateWebpackPlugin, [api]);
    return memo;
  });
};
