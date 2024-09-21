---
title: 参考 create-vue 搭建自己的脚手架 cli 工具项目
description: 当我想要开发一款脚手架工具，而不知道该怎么创建项目的时候，我突然灵机一动（真是个小机灵鬼 OvO ），去参考一下 create-vue 的项目有什么依赖、目录结构是怎么样的之类。然后参考这个做一个比较简单的脚手架项目模板，方便我后续使用以及快速开发工具。
date: 2022-08-07  
---

## 前言

当我想要开发一款脚手架工具，而不知道该怎么创建项目的时候，我突然灵机一动（真是个小机灵鬼 OvO ），去参考一下 [create-vue](https://github.com/vuejs/create-vue) 的项目有什么依赖、目录结构是怎么样的之类。然后参考这个做一个比较简单的脚手架项目模板，方便我后续使用以及快速开发工具。

这里是我自己参考弄的 [template](https://github.com/Asaki-M/cli-template)，比较简单，可以直接 clone 下来进行开发使用，希望能给个 star :)

下面开始讲解一下从零开始的构建项目以及逐步注解一下每一个配置是做什么的。

## 初始化项目

这里我使用的是 `pnpm` 依赖管理工具，要是你使用 `yarn` or `npm`，从使用语法上大体都一致，应该不会有人看不懂的吧，所以下面代码还是用 `pnpm` 来演示。

```sh
mkdir project-name

cd project-name

pnpm init
```

pnpm init 初始化 package.json 信息，顺便补充项目额外的信息：

在 [create-vue](https://github.com/vuejs/create-vue) 项目里面的 package.json 是下面这样的（像scripts，devDependencies）：
```
{
  "name": "create-vue",
  "version": "3.3.1",
  "description": "An easy way to start a Vue project",
  "type": "module",
  "bin": {
    "create-vue": "outfile.cjs"
  },
  "files": [
    "outfile.cjs",
    "template"
  ],
  "engines": {
    "node": "^14.18.0 || >=16.0.0"
  },
  "scripts": {...},
  "repository": {
    "type": "git",
    "url": "git+https://github.com/vuejs/create-vue.git"
  },
  "keywords": [],
  "author": "Haoqun Jiang <haoqunjiang+npm@gmail.com>",
  "license": "MIT",
  "bugs": {
    "url": "https://github.com/vuejs/create-vue/issues"
  },
  "homepage": "https://github.com/vuejs/create-vue#readme",
  "devDependencies": {...},
  "lint-staged": {
    "*.{js,ts,vue,json}": [
      "prettier --write"
    ]
  }
}
```

然后对比我们初始化的 package.json 就会发现少了不少的项目信息，所以补充一下：
```json
{
  "name": "project-name",
  "version": "0.0.1",
  "description": "description",
  "type": "module",
  "bin": {
    "cli": "outfile.cjs"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/xxx/xxx"
  },
  "keywords": [
    "cli"
  ],
  "author": "author-name <email>",
  "license": "MIT",
  "bugs": {
    "url": "https://github.com/xxx/xxx/issues"
  },
  "homepage": "https://github.com/xxx/xxx#readme"
}

```
这里添加了 `type`, `bin`, `repository`, `keywords`, `author`, `bugs`, `homepage`等信息，`type`是说明这个文件是以 ESM 模块来写，`bin`是让这个项目包以命令行形式去执行，至于其他新增的都是对项目注明信息，比如项目开源地址，项目主页等等信息。

> 上面的信息补充完了之后，记得新增个 README.md 文件对项目进行简介以及编写一些使用安装步骤等等信息

## 安装依赖

针对项目安装依赖如下：
- [esbuild](https://github.com/evanw/esbuild#readme)：将入口文件（`*.js, *.ts, *.mjs, *.cjs`）打包成`cjs` or `mjs`文件
- [husky](https://www.npmjs.com/package/husky)：用来规范提交代码，检查提交信息是否符合规范
- [lint-staged](https://www.npmjs.com/package/lint-staged)：对暂存区的文件进行检测操作，比如代码格式化，规范代码风格一致（使用 prettier ）
- [prettier](https://www.npmjs.com/package/prettier)：对代码进行统一风格规范
- [prompts](https://www.npmjs.com/package/prompts)：在命令行使用这个 cli 工具时输入的处理
- [zx](https://www.npmjs.com/package/zx)：在 nodejs 里面更加方便的编写 shell，能执行 mjs 文件方便 `await` 写在顶层而不用 `async` 包着，另外还提供需要简化的功能，有兴趣的可以进去 npm 里面看

## 配置项目

新增入口文件（`index.ts`）在项目里，到了这里我们的项目目录应该是这样的：
```
project-name
├── index.ts
├── pnpm-lock.yaml 
├── package.json 
├── node_modules 
└── README.md
```

### 编写 esbuild 打包配置：

在项目创建 scripts 目录，然后在创建 build.mjs 文件编写 esbuild 的打包配置，目录如下：
```
project-name
├── scripts
│   └── build.mjs 
├── index.ts
├── pnpm-lock.yaml 
├── package.json 
├── node_modules 
└── README.md
```
```js
// project-name/scripts/build.mjs

import * as esbuild from 'esbuild'

await esbuild.build({
  bundle: true,
  entryPoints: ['index.ts'],
  outfile: 'outfile.cjs',
  format: 'cjs',
  platform: 'node'
})
```
打包配置文件编写完之后还需要给 package.json 新增执行语句：
```json
{
  ...
  "scripts": {
    "build": "zx ./scripts/build.mjs"
  },
  ...
}
```
这样项目打包就只需要执行 build 命令就好了。

### 配置提交规范

因为上面安装依赖的时候已经装过 husky，prettier，lint-staged 这三个包，现在就来配置一下：

首先在 package.json 里面添加 husky 的执行：
```json
{
  ...
  "scripts": {
    "prepare": "husky install",
    "build": "zx ./scripts/build.mjs"
  },
  ...
}
```
然后运行一次 prepare 命令，`pnpm prepare`，运行完了 husky 会创建一个 .husky 文件夹在项目，我们需要在 commit 前对文件进行格式化

执行下面的命令：
```shell
npx husky add .husky/pre-commit "pnpm exec lint-staged"
```
执行完了会在 `.husky` 目录生成一个 `pre-commit` 文件，里面的内容：
```
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

pnpm exec lint-staged

```
这样我们在 commit 代码的时候会先执行 `pnpm exec lint-staged` 这条命令，然后再来配置一下 lint-staged

这个配置就比较简单了，进入 package.json：
```json
{
  ...
  "lint-staged": {
    "*.{js,ts,json}": [
      "prettier --write"
    ]
  }
  ...
}
```
上面的配置就是将暂存区的 js，ts，json 文件使用 prettier 进行一个格式化，这里需要配置一下 prettier 要对代码怎么格式化

首先创建 `.prettierrc` 文件编写格式化配置：
```
{
  "semi": false,
  "tabWidth": 2,
  "singleQuote": true,
  "printWidth": 100,
  "trailingComma": "none"
}
```
这配置挺简单的，每个属性都能见名知意，如果有额外的配置或者新增其他的配置可以参考文档里面的来进行配置：[prettier options](https://prettier.io/docs/en/options.html)

> 这上面是我参考 create-vue 搭建的一个比较简单 cli 项目模板，但是 create-vue 里面还配置了一些额外的配置
> 
>  `esbuild-plugin-license`: 有关开源信息的配置
>
>  `kolorist`：stdin/stdout 字体颜色
>
>  `minimist`：stdin/stdout 中的 args 参数获取
>
>  `npm-run-all`：多个 script 一起执行或者并行执行
>
> 这些我没将配置到模板上是因为这些按需安装就好了，如果你的 cli 工具比较简单用不上就没必要装了，所以需要自己按需安装这些吧

## 最后

自己根据 create-vue 搭建的 [cli-template](https://github.com/Asaki-M/cli-template) 项目模板比较简单能够直接用，给孩子一个 star 吧（嘤嘤嘤）