## 使用

离线包 React 引入方案，使用全局资源离线包加速。

插件全局配置

```
// .umirc.js
{
  appType: 'h5',
  reactExternal: {
    version: '16.8.6',  // 只支持 16.8.6，17，省略默认为 16.8.6
  }
}
```

基于 route 定制

```
routes: [
  { path: '/index', component: './index/index.js', },
  { path: '/user', component: './user/index.js', reactVersion: '17' },
],
```

## 依赖

- React

## WHAT

为了减少离线包体积，React 这种公用程度极高而又庞大的库不会打入业务包内

因此这个插件做了两件事

- 修改 webpack 配置将 React external 出来
- 修改 HTML 插入 <script> ，将 React 引入

另外由于 React 16.x 依赖了 Map, Set 这两个新 API，因此如果引入的版本是 16.x 时，为了避免兼容性问题，会先引入一个 polyfill

## 已知问题

- polyfill 内对于 undefind.toString 处理有 bug，导致 apbridge 某些 API 有问题，[详细 issue](https://github.com/Financial-Times/polyfill-service/issues/1741)
