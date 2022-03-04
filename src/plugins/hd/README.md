## 使用

给页面引入 umi-hd，可以定制 hd 的模式

支持两种配置方式

插件全局配置

```
// .umirc.js
{
  appType: 'h5',
  hd: {
    mode: 'vw', // 支持三种模式: vw, flex, 750
  }
}
```

基于 route 定制

```
routes: [
  { path: '/index', component: './index/index.js', },
  { path: '/user', component: './user/index.js', hdMode: 'vw' },
],
```

## 依赖

- umi-hd
- lodash
- postcss-plugin-px2rem

## WHAT

umi-hd 是通过修改 viewport 缩放 + rem 单位来实现的高清与多尺寸屏幕适配
