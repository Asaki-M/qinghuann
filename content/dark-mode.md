---
title: 前端暗色模式/换肤实现方案
description: 文章介绍了多个方案用来实现网站换肤、换色以及暗黑模式
date: 2022-03-21
---

# 多套CSS样式实现
---

通过编写多套CSS样式代码来实现，切换功能就通过动态修改`link`标签的`href`或者动态添加删除`link`标签。这方案就不贴代码了......

优点：简单

缺点：维护成本高


# CSS变量实现
---
在CSS里面定义颜色，字体，宽高等变量，通过使用这些变量来实现换肤功能，核心就是切换属性/类名来切换颜色值。

[项目源码](https://github.com/Asaki-M/practice/tree/main/profession/toggleTheme/css-variable)

下面贴出代码展示：

html结构如下：`main`标签里面是内容，上面的`div`是用来切换皮肤的

```html
<body>
  <div>
    <!-- 这里是切换的按钮 -->
    <img src="../icons/sum.svg" id="theme">
  </div>
  <main class="content">
    <h1>CSS variable</h1>
    <p>abcdefghijklmnopqrstuvwxyz,abcdefghijklmnopqrstuvwxyz</p>
    <p>abcdefghijklmnopqrstuvwxyz</p>
    <p>abcdefghijklmnopqrstuvwxyz</p>
    <p>abcdefghijklmnopqrstuvwxyz</p>
    <button>button</button>
  </main>
</body>
```
css代码如下：当前是使用给`Body`添加类名的方式来实现切换，定义变量
```css
:root {
  --bg-color-0: #fff;
  --bg-color-1: #fff;
  --text-color: #333;
  --grey-1: #1c1f23;
}

:root .dark {
  --bg-color-0: #16161a;
  --bg-color-1: #35363c;
  --text-color: #fff;
  --grey-1: #f9f9f9;
}
```
使用定义的变量：通过`var(param)`使用
```css
body {
  margin: 0;
  padding: 0;
  background-color: var(--bg-color-0);
  transition: all 0.3s;
}

.content {
  padding: 20px;
  background-color: var(--bg-color-1);
  color: var(--text-color);
}

.content button {
  width: 100px;
  height: 30px;
  background-color: var(--bg-color-1);
  color: var(--text-color);
  border: 1px solid var(--grey-1);
  outline: none;
}
```
通过js来对切换按钮进行一个给`Body`增加/删除类名的操作。
```js
 const themebtn = document.getElementById('theme')
  themebtn.addEventListener('click', () => {
    const body = document.body
    // 判断当前是否是黑夜模式，从而切换模式
    if (Array.from(body.classList).indexOf('dark') !== -1) {
      body.classList.remove('dark')
      themebtn.src = '../icons/sum.svg'
    } else {
      body.classList.add('dark')
      themebtn.src = '../icons/moon.svg'
    }
  })
```
效果图：

![1647849164(1).jpg](/content/3.webp)

![1647849516(1).jpg](/content/4.webp)

这种方式实现的一个优缺点

优点：简单易懂

缺点：存在兼容性问题，IE不支持，解决方法也有就是使用[css-vars-ponyfill](https://jhildenbiddle.github.io/css-vars-ponyfill/#/)

> A [ponyfill](https://ponyfill.com/) that provides client-side support for [CSS custom properties](https://developer.mozilla.org/en-US/docs/Web/CSS/--*) (aka “CSS variables”) in legacy and modern browsers.
> 
> 在旧版和现代浏览器中为 CSS 自定义属性（又称“CSS 变量”）提供客户端支持的 ponyfill。

[css变量兼容性-MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties#browser_compatibility)

# Sass/Less变量实现
---
实现方法跟用CSS变量差不多，也是通过给根元素添加属性/类名来达成切换的效果

[项目源码](https://github.com/Asaki-M/practice/tree/main/profession/toggleTheme/scss-variable)

简单的搭建一个React + SCSS的项目来实现，文件目录如下，主要看`_variable.scss`和`_handle.scss`两个文件

```
scss-variable
├── yarn.lock
├── package.json
├── public
│   └── index.html
├── src
│   ├── index.scss
│   ├── _variable.scss
│   ├── _handle.scss
│   ├── index.js
│   └── app.jsx
└── webpack.config.js
```
首先看`app.jsx`文件，里面编写了页面结构以及切换的逻辑

```jsx
import { useCallback, useState } from 'react'
import './index.scss'
const App = () => {
  // 定义切换按钮的文案，并且给html附上默认主题类型
  const [themeText, setThemeText] = useState(() => {
    document.documentElement.setAttribute('data-theme', 'light')
    return 'light'
  })
  // 切换逻辑
  const toggleTheme = useCallback(() => {
    if (themeText === 'light') {
      document.documentElement.setAttribute('data-theme', 'dark')
      setThemeText('dark')
    } else {
      document.documentElement.setAttribute('data-theme', 'light')
      setThemeText('light')
    }
  })
  return (
    <div className="content">
      <button onClick={toggleTheme}>{themeText}</button>
      <h1>SCSS variable</h1>
      <p>abcdefghijklmnopqrstuvwxyz,abcdefghijklmnopqrstuvwxyz</p>
      <p>abcdefghijklmnopqrstuvwxyz</p>
      <p>abcdefghijklmnopqrstuvwxyz</p>
      <p>abcdefghijklmnopqrstuvwxyz</p>
      <button>button</button>
    </div>
  )
}

export default App
```
然后就是`_variable.scss`和`_handle.scss`

`_variable.scss`：定义每个主题的变量

```scss
$themes: (
    light: (
        bg-color-0: #fff,
        bg-color-1: #fff,
        text-color: #333,
        grey-1: #1c1f23
    ),
    dark: (
        bg-color-0: #16161a,
        bg-color-1: #35363c,
        text-color: #fff,
        grey-1: #f9f9f9
    )
);
```
`_handle.scss`：定义mixin来将每个主题的对应颜色字体宽高等等绑定好，只要根据某个mixin来传入对应的key值就好
```scss
@mixin themeify {

  // 遍历_variable.scss定义的主题
  @each $theme-name,
  $theme-map in $themes {
    // 将每个主题提升为全局变量
    $theme-map: $theme-map !global;

    // 绑定某个主题下的样式内容
    [data-theme="#{$theme-name}"] & {
      @content
    }
  }
}

// 定义一个通过key获取主题变量的值函数
@function themed($key) {
  @return map-get($theme-map, $key)
}

// 下面这些mixin绑定在那个主题就那种颜色
@mixin bgColor($color) {
  @include themeify {
    background-color: themed($color);
  }
}

@mixin textColor($color) {
  @include themeify {
    color: themed($color);
  }
}

@mixin borderColor($color) {
  @include themeify {
    border-color: themed($color);
  }
}
```
这里我是已经将`_variable.scss`和`_handle.scss`两个文件在webpack里面配置了全局引入了，所以能在`index.scss`里面使用
`index.scss`：使用mixin来绑定
```scss
body {
  margin: 0;
  padding: 0;
  transition: all 0.3s;
  @include bgColor('bg-color-0');
}

.content {
  padding: 20px;
  @include bgColor('bg-color-1');
  @include textColor('text-color');


  button {
    width: 100px;
    height: 30px;
    border: 1px solid;
    outline: none;
    @include bgColor('bg-color-0');
    @include borderColor('grey-1');
    @include textColor('text-color');

  }
}
```
效果跟CSS变量一致

优点：因为使用webpack进行打包，所以兼容性问题可以解决

缺点：代码可读性不如CSS强

# 动态Style实现
---
这种核心原理就是通过给`style`标签里面的内容进行更改来实现，这种方案是参考了[ElementUI的换肤](https://github.com/ElemeFE/element/issues/3054)来实现。[ElementUI换肤DEMO的仓库地址](https://github.com/ElementUI/theme-preview)

[项目源码](https://github.com/Asaki-M/practice/tree/main/profession/toggleTheme/style-override)

参照着实现：原理就是读取CSS文件里面的样式，通过把颜色替换成关键字，再选择一种颜色将关键字再次替换，将关键字再将样式通过`style`标签插入DOM里面。

目录文件：`formula.json`编写颜色，`color.js`编写颜色转换的逻辑。
```
style-override
├── yarn.lock
├── package.json
├── public
│   └── index.html
├── src
│   ├── color.js
│   ├── formula.json
│   ├── index.js
│   └── app.jsx
└── webpack.config.js
```
`formula.json`文件定义颜色与关键字之间的对应关系，这里是用到[css-color-function](https://www.npmjs.com/package/css-color-function)的插件所以写成这样。
```json
{
  "bgColor0": "color(primary contrast(50%))",
  "bgColor1": "color(primary contrast(50%))",
  "textColor": "color(primary tint(50%))",
  "grey1": "color(primary tint(50%))"
}
```
`color.js`文件：通过[css-color-function](https://www.npmjs.com/package/css-color-function)将颜色替换到json里面的关键字，并且返回colors对象。
```js
import color from 'css-color-function'
import formula from './formula.json'
const generateColors = (primary) => {
  let colors = {}
  // 遍历formula里面的value，将关键字通过css-color-function换成rgb颜色
  Object.keys(formula).forEach((key) => {
    const value = formula[key].replace(/primary/g, primary)
    // css-color-function提供的convert转换颜色
    colors[key] = color.convert(value)
  })

  return colors
}
export default generateColors
```

`app.jsx`文件拆分讲解，页面结构如下：
```jsx
<div className="content">
  <input type="color" onChange={toggleTheme} />
  <h1>CSS variable</h1>
  <p>abcdefghijklmnopqrstuvwxyz,abcdefghijklmnopqrstuvwxyz</p>
  <p>abcdefghijklmnopqrstuvwxyz</p>
  <p>abcdefghijklmnopqrstuvwxyz</p>
  <p>abcdefghijklmnopqrstuvwxyz</p>
  <button>button</button>
</div>
```
等组件一渲染就通过fetch发请求来读取CSS文件，然后将颜色转换成关键字，最后生成一个CSS模板。
```jsx
const [styleTemplate, setStyleTemplate] = useState('')
useEffect(() => {
const colorMap = {
  '#fff': 'bgColor0',
  '#fff': 'bgColor1',
  '#333': 'textColor',
  '#1c1f23': 'grey1'
}
fetch('https://assets.asaki-m.com/template.css')
  .then((r) => r.text())
  .then((data) => {
    let dataText = data
    // 遍历颜色映射表将颜色转换成关键字
    Object.keys(colorMap).forEach((key) => {
      const value = colorMap[key]
      dataText = dataText.replace(new RegExp(key, 'ig'), value)
    })
    // 转换完后设置到变量保存模板
    setStyleTemplate(dataText)
  })
}, [])
```
颜色选择器选择一个颜色后，根据css模板来修改或生成style标签。
```jsx
const originalStylesheetCount = document.styleSheets.length
const toggleTheme = useCallback((evt) => {
    let cssText = styleTemplate
    // 通过input color选择完颜色后，生成关键字与颜色对应的映射
    let colors = generateColors(evt.target.value)
    // 遍历映射表重新将关键字替换成rgb颜色
    Object.keys(colors).forEach((key) => {
      cssText = cssText.replace(
        new RegExp('(:|\\s+)' + key, 'g'),
        '$1' + colors[key]
      )
    })
    // 判断是否已经存在了style标签，不存在就创建一个，存在就直接覆盖里面的内容
    if (originalStylesheetCount === document.styleSheets.length) {
      const style = document.createElement('style')
      style.innerText = cssText
      document.head.appendChild(style)
    } else {
      document.head.lastChild.innerText = cssText
    }
})
```
优点：兼容性问题解决

缺点：上手难度高，维护成本高

效果图：

![1647863592(1).jpg](/content/5.webp)

![1647863615(1).jpg](/content/6.webp)

![1647863633(1).jpg](/content/7.webp)

# 总结
---
总结下来其实就是给根节点添加自定义主题属性/类名，多写几套主题样式，动态生成/修改style。每一种都有自身的缺点，具体使用根据自身条件以及场景使用即可。

上面实现的几种方案都没有做持久化，想要做持久化需要将对应的主题保存到本地缓存里面，然后每次渲染读取缓存的主题，在做一次渲染，并且切换的时候记得修改缓存的主题即可。

当然如果有更好的方案也欢迎指出。