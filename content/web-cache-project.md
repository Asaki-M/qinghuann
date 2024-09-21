---
title: 关于强缓存/协商缓存的实践
description: 本文主要探讨一下关于强缓存和协商缓存的使用实践，基础概念就不展开说。基础概念我之前写过有关的文章了，之前部署的服务器没续费了文章也丢了这里就不贴了。
date: 2022-03-29
---


# 前言
---
本文主要探讨一下关于强缓存和协商缓存的使用实践，基础概念就不展开说。基础概念我之前写过有关的文章了，之前部署的服务器没续费了文章也丢了这里就不贴了。

主要从nodejs实践强缓存与协商缓存以及webpack项目的更新策略来展示。

# NodeJs实践强缓存协商缓存

强缓存和协商缓存该用哪一种，用在哪里，其实很好分辨，通常我们访问网站，首先进入html文件，html文件里面引用的js，css，图片，音频等等通过这些给到我们看的一个网站。

那么html使用强缓存行吗？

想都不用想，不行，为什么，假设html使用了强缓存，当我有需求需要改某个地方的样式，我改完之后重新上线css文件，html文件(因为css改变了，所以html要重新引入css文件，因此html也要改并且重新上线)，但是html使用的是强缓存，在缓存期间浏览器直接从强缓存中读取html文件，以至于你重新上线了但是还是原来的html，内容还是原来，必须要用户强制刷新才会有新内容出现，这合理吗，这就不合理。

所以html应该使用的是协商缓存，而css，js等用强缓存就好了。

> 例子引用[cache-control-nodejs-demo](https://github.com/BlackGoldTeam/cache-control-nodejs-demo)

### 代码解析

代码使用的是nodejs搭建的一个服务器，并且通过设置`header`来设置缓存，使用了`etag`和`fresh`两个npm包来计算协商缓存的etag值以及判断有没有过期。

下面是index.html文件，里面引用了js，css
```html
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>node demo</title>
  <link rel="stylesheet" href="/index.css">
</head>

<body>
  <h1>hello world</h1>
  <script src="/index.js"></script>
</body>
```
index.css
```css
h1 {
  color: skyblue;
}
```
js
```js
console.log('node cache demo')
```

下面是nodejs搭的服务代码：首先判断url是否是进入根目录的，然后返回index.html文件路径
```js
const pathname = url.parse(req.url, true).pathname
//根据请求路径取文件绝对路径
    if (pathname === '/') {
    filePath = path.join(__dirname, '/index.html')
isHtml = true
} else {
    filePath = path.join(__dirname, 'static', pathname)
    isHtml = false
}
```
然后通过fs.stat读取刚刚的路径，如果没有则返回404，文件存在就根据上面判断的是否是进入html的，然后给html设置协商缓存，也就是设置`Last-Modified`和`ETag`响应头，其中的`etag()`方法是Etag包的方法，`fresh()`是用来判断协商缓存是否过期。这篇文章讲解了这两个方法的源码，有兴趣的朋友可以阅读一下：[前端缓存最佳实践](https://juejin.cn/post/6844903737538920462#heading-8)
```js
fs.stat(filePath, function (err, stat) {
    if (err) {
      res.writeHead(404, 'not found')
      res.end('<h1>404 Not Found</h1>')
    } else {
      if (isHtml) {
        // html文件使用协商缓存
        const lastModified = stat.mtime.toUTCString()
        const fileEtag = etag(stat)
        res.setHeader('Cache-Control', 'public, max-age=0')
        res.setHeader('Last-Modified', lastModified)
        res.setHeader('ETag', fileEtag)

        // 根据请求头判断缓存是否是最新的
        isFresh = fresh(req.headers, {
          etag: fileEtag,
          'last-modified': lastModified
        })
      } else {
        // 其他静态资源使用强缓存
        res.setHeader('Cache-Control', 'public, max-age=3600')
      }

      fs.readFile(filePath, 'utf-8', function (err, fileContent) {
        if (err) {
          res.writeHead(404, 'not found')
          res.end('<h1>404 Not Found</h1>')
        } else {
          if (isHtml && isFresh) {
            //如果缓存是最新的 则返回304状态码
            //由于其他资源使用了强缓存 所以不会出现304
            res.writeHead(304, 'Not Modified')
          } else {
            res.write(fileContent, 'utf-8')
          }

          res.end()
        }
      })
    }
  })
```
效果图：可以看到下面第一次进来都是200状态码

![1648533257(1).jpg](/content/13.webp)

刷新一遍就可以看到设置的缓存生效了，响应头也有刚刚设置的：

![1648533336(1).jpg](/content/14.webp)

![1648533410(1).jpg](/content/15.webp)

### 缓存更新的问题

现在突然来一个需求，需要将h1的字体颜色修改为红色。我将index.css修改了，但是在访问网站时候并没有看到想看的效果，字体还是蓝色，因为除了html文件，其余资源使用的是强缓存，所以每次访问都是访问强缓存里面的资源(强缓存没过期期间)，得强制刷新才能跳过缓存重新请求拿到最新的文件。

这样显然是不合理，那么该如何做呢？

之前html不是设置了协商缓存嘛，所以每次访问都会询问html文件是否是最新的，所以只要修改html文件里面的css引入地址就行了

比如：`<link rel="stylesheet" href="/index.css?v=1.0.2">`在后面加个版本号，因为每次html都会发送请求询问是否过期，所以就可以达到效果了。

这样确实可行，但是开发不可能就引用一个css文件，往往是多个的，我每次修改一个css文件，其余的版本也要跟着升级但其余的css根本没有改动啊，所以这种方式就不大行，只适用于这种简单的网站应用。

对于复杂一点的就可以用文件的摘要信息来对资源文件进行重命名实现一个精确的缓存控制，更多详细的可以阅读一下这篇文章，里面写的十分详细：[前端静态资源缓存与更新](https://juejin.cn/post/6844903566943977486)

# webpack实践

webpack搭建项目就可以使用文件的摘要信息来对资源文件进行重命名实现一个精确的缓存控制，下面就做一个小Demo来学习。[源码地址](https://github.com/Asaki-M/practice/tree/main/browser/Cache-2/webpack-demo)

下面是一个简单搭建的react项目：
```
webpack-demo
├── yarn.lock
├── package.json
├── public
│   └── index.html
├── src
│   ├── app.css
│   ├── index.js
│   └── app.jsx
└── webpack.config.js
```
主要关注`webpack.config.js`配置

打包输出配置：在后面插入了一个hash值，实现重命名；然后对css也进行一个拆分并且使用hash进行重命名实现精确控制缓存。

```js
output: {
    path: path.join(__dirname, './dist'),
    filename: 'bundle.[chunkhash].js'
},
plugins: [
    new HtmlWebpackPlugin({
      title: 'webpack cache demo',
      template: './public/index.html'
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[hash].css'
    })
],
```
这里我上传到服务器来看效果，第一次都是新请求都没问题，第二次访问也是html是走协商缓存，css，js等资源走强缓存。

![1648535312(1).jpg](/content/16.webp)

![1648536147(1).jpg](/content/17.webp)

还没修改前的app.css文件
```css
body {
  background-color: #f5f5f5;
}

h1 {
  color: skyblue;
}

p {
  color: pink;
}
```
修改后app.css文件，将h1的颜色和p的颜色进行一个互换

```css
body {
  background-color: #f5f5f5;
}

h1 {
  color: pink;
}

p {
  color: skyblue;
}
```
打包出来的css文件如图，html文件也改变了引用地址

![1648536326(1).jpg](/content/18.webp)

这样就可以实现对资源文件进行重命名实现一个精确的缓存控制。

### 简单说一下配置里面的[chunkhash]

webpack提供了三种哈希值计算方式，分别是hash、chunkhash和contenthash。

> `[hash]` 替换可以用于在文件名中包含一个构建相关(build-specific)的 hash，但是更好的方式是使用 `[chunkhash]` 替换，在文件名中包含一个 chunk 相关(chunk-specific)的哈希。`[contenthash]` substitution(可替换模板字符串) 将根据资源内容创建出唯一 hash。当资源内容发生变化时，`[contenthash]` 也会发生变化。

通过webpack的文档中能知道这三种方式的不同，hash是根据整个项目相关，只要项目某个地方更改了，整体的hash都会更改。

chunkhash是根据入口文件进行依赖文件解析、构建对应的chunk，生成对应的hash值，所以更改了css内容，js引用了这个css也会跟着更改hash值。

contenthash就根据文件内容来生成的hash了，内容更改hash就更改，其他引用的不会引起hash更改。

# 参考文章
[前端静态资源缓存与更新](https://juejin.cn/post/6844903566943977486)

[前端缓存最佳实践](https://juejin.cn/post/6844903737538920462#heading-6)

[Webpack缓存](https://webpack.docschina.org/guides/caching/#output-filenames)