## 使用

route 级别的配置增强，通过 `headScripts`, `scripts`, `styles`, `metas`, `links` 配置页面单独依赖的脚本、样式等。

```js
// .umirc.js
{
  routes: [
    {
      path: '/foo',
      component: 'foo',
      styles: [
        'https://a.com/b.css',
        'body { color: red; }',
      ],
      headScripts: [
        'https://a.com/b.js',
        'console.log("Inject head script");',
        { content: `console.log('hello!');`, charset: 'utf-8' }
      ],
      scripts: [
        'https://c.com/d.js',
        'console.log("Inject body script");',
        { content: `console.log('world!');`, charset: 'utf-8' }
      ],
      metas: [
        {
          name: 'foo',
          content: 'bar'
        }
      ],
      links: [
        {
          rel: 'stylesheet',
          href: 'https://c.com/d.css'
        },
        {
          rel: 'dns-prefetch',
          href: 'https://render-pre.alipay.com'
        }
      ],
    }
  ],
}
```
