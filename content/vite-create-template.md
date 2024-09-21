---
title: 基于 vite 搭建 vue3-ts-pinia-elementplus 项目
description: 本文用于记录下 Vite 搭建 Vue3 + TS 项目并且添加 Element Plus UI 库以及 Pinia 管理数据状态并对其初始化一个配置 
date: 2022-06-22
---

## 文章创建的项目地址
https://github.com/Asaki-M/vue3template

## 使用Vite创建项目
根据Vite文档介绍安装方式创建vue-ts模板项目，在这里我使用的包管理工具为`pnpm`
```
pnpm create vite
```
这样安装可以根据提示来选择对应的模板搭建项目，或者直接选择搭建项目的模板，不需要通过提示来完成。
```
pnpm create vite projectName --template vue-ts
```

### 解释一下为什么使用`pnpm`
**npm v1-v2**之前都是讲所有的依赖包都下载下来，比如下面的图一样，A包里面的依赖包含B，C两个包，那么在安装B，C时候安装依赖时候就会在B，C目录下安装，依赖目录层级会越来越深，并且还会出现重复安装依赖的情况。

![npmv1-2.png](/content/8.webp)

而在**npm v3**之后给出的解决办法是同级安装所有依赖，遇到重复的依赖包就不再重复安装，从而解决下载重复包以及依赖层级过深的情况，而**yarn**同样也使用了这种方法，比如下图

![npm v3.png](/content/9.webp)

但这样同时也会带来一些其他的问题，所以**pnpm**就使用了软链接的方式来安装依赖，这样就没有了依赖扁平化的算法以及包空间占用更小。像下图，[图片来源](https://developer.51cto.com/article/702067.html)


![f1a984784cc4f415464644f0e48003526b662f.png](/content/10.webp)

包管理器之间的详细区别：
- https://developer.51cto.com/article/702067.html
- https://www.cnblogs.com/cangqinglang/p/14448329.html

## 安装相应依赖
### 安装Element-Plus
```
pnpm install element-plus
```
这种全局引入，需要按需引入的可以参考**element-plus**文档
```ts
// main.ts
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

const app = createApp(App)
app.use(ElementPlus)
```

### 安装Pinia
```
pnpm install pinia
```
首先是先引入注册**pinia**
```ts
// main.ts
import { createPinia } from 'pinia'

const pinia = createPinia()
app.use(pinia)
```
然后就是在src目录下创建**store**目录，里面创建**store.ts**
> tips: 命名最好见名之意，这里为单个因此简单命名为store
```ts
// src/store.ts
import { defineStore } from 'pinia'

export const useStore = defineStore('main', {
  state: () => {
    return {
      counter: 0,
      name: 'vue3template'
    }
  },
  getters: {
    double: (state) => state.counter * 2
  },
  actions: {
    increment() {
      this.counter++
    },
    decrease() {
      this.counter--
    }
  }
})
```
在组件中使用
```ts
import { useStore } from '../store/store';
const store = useStore()
console.log(store.double) // 0
console.log(store.name) // vue3template
```

项目到这里基本搭建完成了，后续再配置**vue-router**以及一些**eslint**等等东西就算比较完整的项目模板了。

## 推荐一些第三方库

- [vueuse](https://vueuse.org/guide/)：里面封装了许多常用hook函数，并且也是由vue团队开源的，可以使用减少平常的代码copy-------OvO！

- [unplugin-vue-components](https://github.com/antfu/unplugin-vue-components)：里面自动引入多个流行常见的样式库。
> Use components in templates as you would usually do, it will import components on demand, and there is no `import` and `component registration` required anymore!

## 相关文档官网
- Vite：https://cn.vitejs.dev/
- Vue3：https://v3.cn.vuejs.org/
- TypeScript：https://www.tslang.cn/index.html
- Pinia：https://pinia.vuejs.org/
- ELement-Plus：https://element-plus.gitee.io/