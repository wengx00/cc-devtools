# Scaffold APP

## 语义化版本

Scaffold 使用了 Vite 插件来注入虚拟模块，将 `packge.json` 中的 `version` 字段注入到虚拟模块 `app-version` 中。

所以语义化版本的唯一事实来源就是 `packge.json` 中的 `version` 字段，想要获取当前的版本，可以使用 `@/config` 来访问

```ts
import config from '@/config';

console.log(config.version);
```
