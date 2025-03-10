---
title: Service Worker实现音乐播放离线缓存
description: Service Worker（以下简称为 sw ）本质上是充当一个代理服务器，旨在创建有效的离线体验，它可以将一些网络请求资源缓存起来以及在网络请求中拦截并且做出适当的动作。
date: 2022-03-17
---

# 介绍
---
Service Worker（以下简称为 sw ）本质上是充当一个代理服务器，旨在创建有效的离线体验，它可以将一些网络请求资源缓存起来以及在网络请求中拦截并且做出适当的动作。

sw是一个注册在指定源和路径下的worker，它没有办法能访问DOM，并且sw设计成完全异步的所以不会阻塞主线程和其他线程。但是这样就没有办法使用XHR和localstorage等API，这样就需要用到[Cache](https://developer.mozilla.org/zh-CN/docs/Web/API/Cache)或者[IndexedDB](https://developer.mozilla.org/zh-CN/docs/Web/API/IndexedDB_API)等API存储。

出于安全的考虑，sw只支持HTTPS、locahost的承载。

> **使用前浏览器的设置**
> 
> -   **Firefox Nightly**: 访问 `about:config` 并设置 `dom.serviceWorkers.enabled` 的值为 true; 重启浏览器；
> -   **Chrome Canary**: 访问 `chrome://flags` 并开启 `experimental-web-platform-features`; 重启浏览器 (注意：有些特性在Chrome中没有默认开放支持)；
> -   **Opera**: 访问 `opera://flags` 并开启` ServiceWorker 的支持`; 重启浏览器。

# sw的主要事件
---
- install：sw安装时机触发，通常在这个事件缓存资源文件。
- activate：sw激活时触发，通常在这个事件中更新资源缓存。
- fetch：sw在有HTTP请求时会触发，通常在这个事件拦截请求，做出适当的动作。


# 开始本文例子讲解
---
### 项目结构

```
serviceworker
    |- index.css  页面样式
    |- index.html 页面结构
    |- index.js   页面逻辑
    |- sw.js      sw逻辑
```

### 文件代码说明
index.html，简单的搭建音乐搜素播放页面，在页面提供一个输入框和搜索按钮，用以搜索音乐，并且展示搜索的音乐，点击播放将url赋值给audio。
```html
<body>
  <div>
    <input type="text" id="tmusic">
    <button id="sbtn">Search</button>
    <audio id="player" src="" controls></audio>
    <p id="history"></p>
  </div>
  <p id="restxt"></p>


  <script src="./index.js"></script>
</body>
```
index.css，简单的做出页面样式，但在这里定义了按钮的背景图，引用到了网络资源
```css
button {
  color: #fff;
  width: 100px;
  height: 30px;
  background-color: transparent;
  border: none;
  background-image: url('https://assets.asaki-m.com/button_1.png');
  background-size: cover;
}

button:active {
  background-image: url('https://assets.asaki-m.com/button_2.png');
}
```
index.js，封装一个register函数，在window的load事件中才注册sw，这样可以避免加载sw.js而影响到页面的其他加载渲染。

注册返回的是一个`Promise`对象，通过then和catch就能判断出sw注册成不成功。
```js
function register() {
  if ('serviceWorker' in navigator) {
    // 给service worker注册，scope为工作的作用域，默认为当前目录
    // 注册返回一个Promise对象
    navigator.serviceWorker
      .register('/browser/serviceworker/sw.js', {
        scope: '/browser/serviceworker/'
      })
      .then((reg) => {
        if (reg.installing) {
          console.log('Service worker installing')
        } else if (reg.waiting) {
          console.log('Service worker installed')
        } else if (reg.active) {
          console.log('Service worker active')
        }
      })
      .catch((err) => {
        console.log('register failed with: ' + err)
      })
  }
}
```
重点解释sw.js里面的内容，首先看install事件里面的逻辑，waitUtil函数是保证了函数里的代码能在sw安装完成前执行完。避免sw安装完了，资源还没添加到cache对象里面。
```js
self.addEventListener('install', function (evt) {
  // waitUtil 保证里面的代码在安装前执行完
  evt.waitUtil(
    // 将资源缓添加到名为 v1 的 Caches 里面
    caches.open('v1').then((cache) => {
      // 缓存所有需要的静态资源
      return cache.addAll([
        '/browser/serviceworker/assetsImg/button_1.png',
        '/browser/serviceworker/assetsImg/button_2.png'
      ])
    })
  )
})
```
然后在fetch事件中对HTTP请求拦截下来，并且做适当的操作。在`respondWith()`方法中劫持HTTP的响应，首先判断cache有没有请求的缓存，如果有就直接返回缓存的响应，不再发HTTP请求；

当cache里面没有缓存，则使用[fetch](https://developer.mozilla.org/zh-CN/docs/Web/API/Fetch_API/Using_Fetch)发起请求，这个Fetch发起请求的是用来代替XMLHttpRequest来发请求的方案；当请求响应了错误直接返回错误信息，当请求响应成功的情况，更新cache缓存，将新的响应存入cache缓存中，下次在访问就直接从缓存中读取。
```js
self.addEventListener('fetch', function (evt) {
  // 在发起请求时候会触发fetch事件
  evt.respondWith(
    caches.match(evt.request).then(function (response) {
      // 如果 sw 已经保存了请求的响应，直接返回响应，减少http请求
      if (response !== undefined) {
        return response
      }
      // 不存在需要发起请求
      return fetch(evt.request).then((httpRes) => {
        if (!httpRes || httpRes !== 200) {
          // 请求出错则直接返回错误信息
          return httpRes
        }
        // 将响应复制一份
        const httpResClone = httpRes.clone()
        // 并且保存到安装时候的缓存对象里
        caches.open('v1').then((cache) => {
          cache.put(evt.request, httpResClone)
        })
        return httpRes
      })
    })
  )
})
```

至此sw的简单实现离线功能就完成了，但是使用到的一些API还是希望能到MDN上看一下使用方法，而不是对着Demo来使用。[sw-mdn](https://developer.mozilla.org/zh-CN/docs/Web/API/Service_Worker_API/Using_Service_Workers)

### 效果图
第一次访问：在输入框搜索月球，点击搜索，将数据渲染到右边，然后点击第一个播放，再点击播放器的播放音乐，那么这次访问的静态资源，网络请求都会被sw所缓存下来。

![1647488393(1).jpg](/content/1.webp)

第二次访问（注意这次是断开网络的情况）：流程还是第一次的流程，但是资源是被sw缓存过了，所以能从缓存中读取，像是没有被缓存的是访问不到的。

![1647488998.jpg](/content/2.webp)

### 扩展
在fetch事件中，如果不想返回请求错误的信息也可以重定向到一个自定义的错误网页，不过这要在install安装时候就要将错误页缓存好。

比如现在有个例子，我想向上面这样重定向到一个错误页面：
```js
self.addEventListener('install', function (evt) {
  evt.waitUtil(
    caches.open('v1').then((cache) => {
      // 缓存所有需要的静态资源
      return cache.addAll([
        'sw-test/404/index.html'
      ])
    })
  )
})

self.addEventListener('fetch', function (evt) {
 evt.respondWith(
    caches.match(evt.request).then(function (response) {
      return fetch(evt.request).then((httpRes) => {
        if (!httpRes) {
          // 请求出错则返回缓存中的404页面
          return caches.match('sw-test/404/index.html')
        }
        return httpRes
      })
    })
  )
})
```

比较一下install事件和fetch事件：

install的优点就是只需要访问一次，第二次就可以离线访问了，缺点是将需要缓存的URL插入到脚本中缓存，这样就降低了代码的可维护性。

fetch的优点就是不用更改编译过程，其他的脚本发送请求都可以被拦截，就算修改了还是会拦截得到，缺点就是必须得发送过一次请求响应后才能缓存。

另外的一些使用场景：

关于使用sw也可以针对某些请求实现一些额外的操作，比如发请求获取数据时，这个请求失败，那么可以重定向到另一个请求获取相同的数据等

也可以实现一个预加载的效果，比如访问A页面时候，将后续需要访问的B页面缓存了，等到用户访问B页面时候，就会感觉到很快流畅，相当于优化体验。

### sw的更新
当sw需要更新时候，浏览器会读取修改过的sw.js(这里的sw.js指的是sw的逻辑文件)和之前的内容进行比对，然后就会触发install安装新版本的sw.js，如果旧的sw还在工作的话，新的sw会进入一个等待的状态，等页面关闭了，没有用到sw后，旧的sw才会被新的sw替代生效。

但是这样的话新版本的sw更新了，页面没有更新，显然这样是十分不符合逻辑的，所以就要跳过这个等待态，进入激活态，执行`skipWaiting()`方法来跳过等待，进入activate，然后更新客户端，清楚旧版本的缓存。
```js
self.addEventListener('install', (evt) => {
    evt.waitUtil(evt.skipWaiting())
})

self.addEventListener('activate', (evt) => {
    evt.waitUtil(
        Promise.all([
            // 更新客户端
            self.clients.claim(),
            // 清理旧版的缓存
            caches.keys().then(cachelist => {
                return Promise.all(
                    cachelist.map(cache => {
                        if(cache !== 'currentVersionName') {
                            return caches.delete(cache)
                        }
                    })
                )
            })
        ])
    )
})
```

caches里面缓存不手动删除是不会删除的，就像locastorage一样，需要手动删除。

还有一种就是在注册sw时候调用update方法来更新，如
```js
navigator.serviceWorker
      .register('/browser/serviceworker/sw.js', {
        scope: '/browser/serviceworker/'
      })
      .then((reg) => {
          // register success
          reg.update().then(() => {
              // do something
          })
      })
      .catch((err) => {
        console.log('register failed with: ' + err)
      })
```
## 开源的sw库
- [offline-plugin](https://github.com/NekR/offline-plugin)
- [workbox](https://developers.google.com/web/tools/workbox/guides/migrations/migrate-from-sw)


## 参考文章
[https://www.wenjiangs.com/doc/iv0jiydb#ed4048aee68ab43230526fb2036eeddc](https://www.wenjiangs.com/doc/iv0jiydb#ed4048aee68ab43230526fb2036eeddc)

[https://juejin.cn/post/6996901512462991374](https://juejin.cn/post/6996901512462991374)

[https://developer.mozilla.org/zh-CN/docs/Web/API/Service_Worker_API/Using_Service_Workers](https://developer.mozilla.org/zh-CN/docs/Web/API/Service_Worker_API/Using_Service_Workers)