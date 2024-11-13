---
title: 一文带你了解 Vite 插件编写
description: 一篇文章搞懂 VIte 插件开发，如果还没看过官网的文档，那么我建议你先看下官网文档，有个基本了解，我会在文中用一个插件来讲解
date: 2024-11-13
---

如果还没看过官网的文档，那么我建议你先看下官网文档，有个基本了解，我会在文中用一个插件来讲解。

## 介绍

在 Vite 插件中多数情况下我们只需要关注 Vite 独有的几个钩子函数：

*   config： 返回一个被合并到现在的配置一个对象
*   configResolved：获取最终的一个配置对象
*   configureServer：用于配置开发服务器的钩子，用于监听文件系统，搭建websocket通讯
*   configurePreviewServer：与 configureServer 类似，但是会在内部中间件注入后调用
*   transformIndexHtml：转换 `index.html` 的专用钩子
*   handleHotUpdate：执行自定义 HMR 更新处理

假设你需要引入一个虚拟模块，可以用 rollup 的通用钩子来实现：

*   resolveId
*   load

这里以 [vite-plugin-vue-inspector](https://github.com/webfansplz/vite-plugin-vue-inspector) 为例：

```ts
async resolveId(importee: string) {
    if (importee.startsWith('virtual:vue-inspector-options')) {
      return importee
    }
    else if (importee.startsWith('virtual:vue-inspector-path:')) {
      const resolved = importee.replace('virtual:vue-inspector-path:', `${inspectorPath}/`)
      return resolved
    }
},

async load(id) {
    if (id === 'virtual:vue-inspector-options') {
      return `export default ${JSON.stringify({ ...normalizedOptions, base: config.base })}`
    }
    else if (id.startsWith(inspectorPath)) {
      const { query } = parseVueRequest(id)
      if (query.type)
        return
      // read file ourselves to avoid getting shut out by vites fs.allow check
      const file = idToFile(id)
      if (fs.existsSync(file))
        return await fs.promises.readFile(file, 'utf-8')
      else
        console.error(`failed to find file for vue-inspector: ${file}, referenced by id ${id}.`)
    }
},
```

`virtual:vue-inspector-options` 这个虚拟模块很好理解，就是匹配这个模块的名字然后导出一些属性

`virtual:vue-inspector-path:` 这个就稍微难一点，就是将 `virtual:vue-inspector-path:` 的名字替换成插件绝对路径的 src，然后在 `load` 钩子里获取引用的文件 id

```js
// vite-plugin-vue-inspector/packages/core/src/load.js

import App from 'virtual:vue-inspector-path:Overlay.vue'
```

load 钩子里面的 `id.startsWith(inspectorPath)` 就是匹配到了这个 Overlay.vue 文件然后返回他的文件内容，最后在挂载到你的 Vue 项目里面，想了解 vite-plugin-vue-inspector 实现的可以去看源码，很好的学习项目。

## 实践

下面我们写一个管理本地项目的 `assets/*.svg` 的插件

在这个项目中只需要用到两个钩子函数 `configResolved，configureServer`

先获取项目的配置

```ts
async configResolved(resolvedConfig) {
  config = resolvedConfig
},
```

然后在 `configureServer` 里面编写我们的功能，因为我们展示 assets/ 目录下的所有 svg，那么就需要一个 client 和获取 assets/ 的所有 svg 路径

客户端就是用 vue3 来编写，获取所有的 svg 路径就可以使用 `fast-glob` 这个库来扫描项目的 svg

理清这两点后我们的插件目录就如下:

![image.png](/content/vite-plugin-svg-manage.png)

在 `configureServer` 中开启 client 的服务，使用中间件开启一个访问项目地址 `localhost:port/__svg-manage` 的应用，也就是我们展示 svg 的客户端

```ts
const base = (server.config.base) || '/'
    server.middlewares.use(`${base}__svg-manage`, sirv(DIR_CLIENT, {
        single: true,
        dev: true,
    }
))

```

因为我们需要和客户端进行通信，那么就使用到了 websocket 进行通讯，官网也有例子，

插件端：server.ws.send 和 server.ws.on 来接受和发送消息

客户端：import.meta.hot.on 和 import.meta.hot.send，但是实践下来，我们会发现客户端的 import.meta.hot 是没有的，所以可以使用 vite-hot-client 这个库来帮助

```ts
// client/src/components/SvgManageCMP/index.vue

import { createHotContext } from 'vite-hot-client'


const svglist = ref([])

const hot = await createHotContext('/___', `${location.pathname.split('/__svg-manage')[0] || ''}/`.replace(/\/\//g, '/'))
if (hot) {
  hot.on('vite-plugin-svg-manage:initData', ({ assetsSvgs }) => {
    if (assetsSvgs) {
      svglist.value = assetsSvgs
      console.log(assetsSvgs)
    }
  })
}

```

这样就收到插件端那边扫描的 assets/\*.svg

插件端发送扫描好的 svg 数据

```ts
// context.ts

export class VitePluginSvgManageContext {
  private static instance: VitePluginSvgManageContext | null = null;
  private server: ViteDevServer;
  private root: string;
  private alias: Array<Alias>
  public assetsSvgs: Array<SvgFileInfosOpions>

  constructor(server: ViteDevServer) {
    if (VitePluginSvgManageContext.instance) {
      return VitePluginSvgManageContext.instance;
    }

    this.server = server;
    VitePluginSvgManageContext.instance = this;
  }

  public async init(alias: Array<Alias>, root: string) {
    this.root = root
    this.alias = alias
    await this.getSvgList(alias, root);
  }

  private async getSvgList(alias: Array<Alias>, root: string) {
    const filesList = await getAssetsSvg(alias, root)
    this.assetsSvgs = filesList
  }

  public sendData() {
    this.server.ws.send(prefix + 'initData', { assetsSvgs: this.assetsSvgs })
  }
}
```

```ts
// index.ts
async configureServer(server) {
  const ctx = new VitePluginSvgManageContext(server)
  await ctx.init(config.resolve.alias, config.root)

  const base = (server.config.base) || '/'
  server.middlewares.use(`${base}__svg-manage`, sirv(DIR_CLIENT, {
    single: true,
    dev: true,
  }))

  server.ws.on('connection', () => {
    ctx.sendData()
  })
}
```

既然已经实现了双方通讯，那么对于上传 svg ，改名 svg 以及删除 svg 就都是这个原理了，感兴趣的可以源码的实现，可以的话给项目点点 star

项目地址：<https://github.com/Asaki-M/vite-plugin-svg-manage>

![preview.gif](/content/svg-manage-preview.gif)
