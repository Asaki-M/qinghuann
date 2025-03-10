---
title: Vue3+Express实现视频分片传输播放
description: 案例使用Vue3 + Vite + Express搭建的项目，由于Vue3是刚学不久，代码写的就不是很优雅，甚至有点粗暴，因此看看实现方案的原理就好了......
date: 2022-04-18
---

# 1. 前言
---

案例使用Vue3 + Vite + Express搭建的项目，由于Vue3是刚学不久，代码写的就不是很优雅，甚至有点粗暴，因此看看实现方案的原理就好了......

这是在刷b站视频时候看到鼠标移上去就有自动播放，后面打开控制台看到，视频是分片传输的（应该是这样），后面就去了解一下这种方案，所以现在来实现一下。

源码地址：https://github.com/Asaki-M/practice/tree/main/profession/videoPlayer

# 2. 项目概述
---

### 2.1
视频以上传的方式上传的后端，考虑到视频通常会很大，所以选用分片上传的形式上传，分片上传的功能使用到[easy-file-uploader](https://github.com/shadowings-zy/easy-file-uploader)的库实现。

假如只实现视频分片播放的可以不用管上传的步骤了，看视频分片的那块逻辑就好了。

那么问题来了，视频该怎么样进行分片呢？

可以使用**FFmpeg**这款工具将视频进行一个分片，然后生成一个m3u8的索引文件，然后通过**hls.js**来读取索引文件然后实现视频流式播放。

[FFmpeg官网](https://ffmpeg.org/)

[FFmpeg入门-阮一峰](https://www.ruanyifeng.com/blog/2020/01/ffmpeg.html)这个包含了很多场景的使用，可以通过文章来阅读了解FFmpeg的使用。

[hlsjs](https://github.com/dailymotion/hls.js)
> **MDN里面对hls的介绍**
>
> HLS(HTTP Live Streaming)是由苹果公司研发的协议，支持在IOS、Safari及安卓上最新版本的浏览器/Chrome浏览器。HLS也是自适应的。
> 
> HLS也能被JavaScript解码，这意味着我们能在最新版本的Firefox，Chrome和IE10+浏览器上使用。看这个 [HTTP Live Streaming JavaScript player](https://github.com/dailymotion/hls.js).
>
> 在流式会话的开始阶段， [extended M3U (m3u8) playlist](https://en.wikipedia.org/wiki/M3U8#Extended_M3U_directives) 已经下载完成。它包含了所提供的各个子流的元数据。

### 2.2

FFmpeg是一款可以对视频、音频进行转换，切割等等功能的跨平台工具，所以在视频分片的实现中需要用到。在项目中我只是以命令的形式简单使用，更好的使用方法可以用WebAssembly来进行使用FFmpeg。但是WebAssembly我还没接触使用过，只还停留在了解的层面上，所以这次的项目Demo就不使用Webssembly。

> FFmpeg: A complete, cross-platform solution to record, convert and stream audio and video.
> 
> FFmpeg：一个完整的跨平台记录和转换音视频流的解决方案。

> [WebAssembly-MDN介绍](https://developer.mozilla.org/zh-CN/docs/WebAssembly)
> 
> WebAssembly是一种新的编码方式，可以在现代的网络浏览器中运行 － 它是一种低级的类汇编语言，具有紧凑的二进制格式，可以接近原生的性能运行，并为诸如C / C ++等语言提供一个编译目标，以便它们可以在Web上运行。它也被设计为可以与JavaScript共存，允许两者一起工作。


# 3. 目录结构
---
前面说了这么多，现在开始进入项目解析，首先先了解项目结构，结构如下，前端结构没什么好说的，用vite构建的一看就能知道目录存放的是什么。
```
videoPlayer
├── server(服务端代码目录)
│   ├── utils(工具函数)
│   │   └── index.js
│   ├── service(逻辑代码目录)
│   │   ├── upload.js(上传视频逻辑)
│   │   └── video.js(读取视频逻辑)
│   ├── public(存放静态资源)
│   │   ├── mergedUploadFile(视频分片合并后存放目录)
│   │   └── tempUploadFile(上传视频分片存放目录)
│   └── index.js(入口文件)
├── video-view(网页端代码目录)
│   ├── public
│   ├── src
│   │   ├── components(页面组件)
│   │   ├── router(路由)
│   │   ├── index.css
│   │   ├── main.js
│   │   └── App.vue
└──—————————————————————————————————————————————————————————————
```

# 4. 后端部分
---
### 4.1 分片上传功能

这块不实现上传的可以跳过，看下面进行视频分片的逻辑既可。引入模块，创建模块实例对象，并传入分片保存空间和合并文件空间目录

```js
const { FileUploaderServer } = require('easy-file-uploader-server')

const fileUploader = new FileUploaderServer({
  tempFileLocation: path.join(__dirname, '../public/tempUploadFile'),
  mergedFileLocation: path.join(__dirname, '../public/mergedUploadFile')
})
```

根据**easy-file-uploader**的库使用创建对应的接口
```js
// 上传初始化接口，用来创建上传文件分片存储目录
router.post('/api/initUpload', urlencodedParser, async (req, res) => {
  const { name } = req.body
  const uploadId = await fileUploader.initFilePartUpload(name)
  res.status(200)
  res.json({ uploadId })
})

// 接收分片
router.post('/api/uploadPart', upload.single('partFile'), async (req, res) => {
  const { buffer } = req.file
  const { uploadId, partIndex } = req.body
  const partFileMd5 = await fileUploader.uploadPartFile(
    uploadId,
    partIndex,
    buffer
  )
  res.status(200)
  res.json({ partFileMd5 })
})

// 合并分片
router.post('/api/finishUpload', bodyParser.json(), async (req, res) => {
  const { uploadId, name, md5 } = req.body
  const { path: filePathOnServer } = await fileUploader.finishFilePartUpload(
    uploadId,
    name,
    md5
  )
  // 在合并分片后，将合并的视频文件进行分片
  let suffix = await sliceVideoFromFFmpeg(filePathOnServer)
  // 返回分片后生成的m3u8索引地址
  let m3u8Path = suffix.split('public')[1].replaceAll('\\', '/').slice(1)
  res.status(200)
  res.json({ path: m3u8Path })
})
```

### 4.2 视频切片逻辑

首先先安装上**FFmpeg**这个程序，[下载地址](https://www.ffmpeg.org/download.html)

> 配置环境变量，打开我的电脑找到环境变量
> 
> 然后将安装好的FFmpeg目录的bin配置到Path里面

然后是视频进行切片的逻辑，这里我将代码封装到**utils/index.js**，代码基本每行都有注释，就不多赘述了

```js
// 引入的node内置包
const exec = require('child_process').exec
const path = require('path')
const fs = require('fs')
```

```js
/**
 * 视频切片方法
 * @param {string} inputPath 输入视频文件路径
 * @returns string
 */
async function sliceVideoFromFFmpeg(inputPath) {
  // 将视频路径使用path.sep进行分割成数组，path.sep兼容window和linux的路径分隔符
  const pathlist = inputPath.split(path.sep)
  // 获取视频路径目录
  const pathDir = pathlist.slice(0, pathlist.length - 1).join(path.sep)
  // 获取视频名字
  const tempName = pathlist.at(-1).slice(0, pathlist.at(-1).lastIndexOf('.'))

  // 转换成ts格式的视频文件路径
  const outputPath = path.resolve(`${pathDir}/${tempName}.ts`)
  // 生成视频的索引文件路径
  const m3u8Path = path.resolve(`${pathDir}/chunk/index.m3u8`)
  // 视频切片后每个切片的文件路径
  const videoPath = path.resolve(`${pathDir}/chunk/${tempName}-%04d.ts`)
  // 切片命令
  const command = `ffmpeg -i ${outputPath} -c copy -map 0 -f segment -segment_list ${m3u8Path} -segment_time 10 ${videoPath}`
  // 先执行转换格式的方法
  await VideoToTs(inputPath, outputPath)
  // 创建切片和索引文件存放的目录
  fs.mkdir(path.join(`${pathDir}`, 'chunk'), (err) => {
    if (err) {
      console.log(err)
    }
    // 执行切片命令
    exec(command, (err, stdout, stderr) => {
      if (err) {
        console.log(err)
      }
    })
  })
  return m3u8Path
}
```

```js
/**
 * 将视频格式转换成ts格式
 * @param {string} input 需要转换视频的路径
 * @param {string} output 转换后输出的路径
 * @returns
 */
function VideoToTs(input, output) {
  return new Promise((res, rej) => {
    // 定义转换视频的命令
    const command = `ffmpeg -y -i ${input} -vcodec copy -acodec copy -vbsf h264_mp4toannexb ${output}`
    exec(command, (err) => {
      // 执行命令
      if (err) {
        rej(err)
      }
      res()
    })
  })
}
```
### 4.3 返回视频索引接口逻辑

```js
// 方案三：通过m3u8索引文件来读取
router.get('/video3', async (req, res) => {
  let plist = await getAllVideoIdxPath()
  res.status(200)
  res.json({
    plist
  })
})

/**
 * 读取mergedUploadFile目录下的所有视频索引文件
 * 返回这些索引文件路径的数组
 */
function getAllVideoIdxPath() {
  return new Promise((res, rej) => {
    let vpath = path.resolve(__dirname, '../public/mergedUploadFile')
    fs.readdir(vpath, (err, files) => {
      if (err) {
        rej(err)
      }
      let plist = files.map((item) => {
        return `mergedUploadFile/${item}/chunk/index.m3u8`
      })
      res(plist)
    })
  })
}
```

以此后端的视频上传以及视频分片核心代码就到这了，完整代码就阅读项目里面的吧。

# 5. 前端部分
---
相比后端前端的代码就相对简单一些了，主要还是看两个组件就好了，**Home.vue**和**Upload.vue**，当然跟后端一样对上传不感兴趣的可以跳过**Upload.vue**这个组件。

### 5.1 Upload.vue

因为是用vue3了，所以可以不用写根组件包裹了，这是vue3的一个新特性，还挺好。上传的组件结构就如下啦。

```html
<template>
  <input type="file" ref="fileInput">

  <el-button type="success" @click="upload">
    upload to server
  </el-button>
</template>
```

下面上传的逻辑贴的不是全部代码，而是核心代码，完整的代码可以到项目里面去看。

```js
// 引入easy-uploader分片上传的前端模块功能
import { FileUploaderClient } from 'easy-file-uploader-client'

// 实例化模块对象
const fileUploaderClient = new FileUploaderClient({
  // 传入的分片大小
   chunkSize: 2 * 1024 * 1024,
   requestOptions: {
      // 上传失败重新上传的次数 
      retryTimes: 2,
      // 初始化上传目录的函数
      initFilePartUploadFunc: async () => {
        const fileName = fileInput.value.files[0].name
        const { data } = await axios.post(`${HOST}api/initUpload`, {
          name: fileName,
        })
        uploadId = data.uploadId
        console.log('初始化上传完成')
      },
      // 上传分片的函数
       uploadPartFileFunc: async (chunk, index) => {
        const formData = new FormData()
        formData.append('uploadId', uploadId)
        formData.append('partIndex', index.toString())
        formData.append('partFile', chunk)

        await axios.post(`${HOST}api/uploadPart`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        console.log(`上传分片 ${index}完成`)
      },
      // 上传完分片后的合并文件函数
      finishFilePartUploadFunc: async (md5) => {
        const fileName = fileInput.value.files[0].name
        const { data } = await axios.post(`${HOST}api/finishUpload`, {
          name: fileName,
          uploadId,
          md5,
        })
        console.log(`上传完成，存储地址为：${HOST}${data.path}`)
      }
   }
})
```
上传按钮点击后触发的事件
```js
const upload = () => {
    fileUploaderClient.uploadFile(fileInput.value.files[0])
}
```

### 5.2 Home.vue

展示视频的组件，首先访问后端接口获取视频的索引文件数组，然后通过**hls.js**将索引路径赋值到`video`上

页面结构如下
```html
<template>
  <div>
    <video 
        v-for="item in vpathlist" 
        :key="item" class="player" 
        :data-src="item" 
        :ref="videos" 
        controls
    ></video>
  </div>
</template>
```
页面逻辑如下

```js
// 视频索引路径数组
const vpathlist = ref([])
// video标签dom节点数组
const players = ref([])

onMounted(async () => {
  // 发送请求获取所有的视频索引文件
  const plist = await axios.get(`${HOST}/video3`)
  vpathlist.value = plist.data.plist

  nextTick(() => {
    // 遍历players数组
    // 通过hls.js的模块给每一个video都赋值一个索引文件
    players.value.forEach(el => {
      if(HLS.isSupported()) {
        const hls = new HLS()
        hls.loadSource(`${HOST}/${el.dataset.src}`)
        hls.attachMedia(el)
      } else if (el.canPlayType('application/vnd.apple.mpegurl')) {
        el.src = `${HOST}/${el.dataset.src}`
      }
    })
  })
})
```

# 6. 效果查看

然后自己对视频切片的FFmpeg还是一个入门状态，还没有很深入的学习，对于一些视频的编码知识也还没有很深入的学习，只是对视频分片播放这功能感兴趣，所以进行一个实现尝试。

首页视频预览，可以看到控制台上的索引文件读取，然后每一个视频切片的加载以及进度条跳动会跳过中间的一些切片节约网络资源。

![test2.gif](/content/11.webp)

上传的就是通过一个分片上传的形式，因为上传的还是比较小的文件，所以就只切割了一个分片，相对来说一些小文件就可以不用使用分片上传的方式，直接上传就好了，但这里只是演示。


![test3.gif](/content/12.webp)

# 7. 参考文章
[前端+Nodejs视频传输方案](https://juejin.cn/post/6996844957772283935#heading-5)

[ffmpeg + node 实现流式视频处理](https://juejin.cn/post/6844904200439087111)

这篇文章用到Webssembly使用FFmpeg，推荐一看：[如何在web浏览器中使用ffmpeg进行音视频转码，以avi转码成mp4为例](https://juejin.cn/post/6952729332854816775)