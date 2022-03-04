## 说明

这个插件是为了适配修复`@umijs/plugin-antd`插件，antd 插件开启的情况下，会在应用引入 antd 的样式文件，被引入的全局样式会污染应用，同时由于 antd 参与的构建会导致 h5 离线包体积膨胀。

开启`antdCompat`插件，则会剔除 antd，但保留 antd-mobile 的相关功能。
