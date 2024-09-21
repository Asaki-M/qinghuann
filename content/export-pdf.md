---
title: 前端导出 PDF 的方案实践
description: 文章探寻导出 PDF 等几种方案并简单代码展示以及展示一些常见的坑，可以了解其几种方案的优缺点，选出适合自己的实现方案
date: 2024-09-21
---

# 需求

***

将页面特定内容导出 PDF ， PDF 内容导出与页面样式不同，需要增加 Logo、额外信息等（非页头和页脚）如下图

![export-pdf-1.jpg](/content/export-pdf-1.jpg)

# 方案

***

### window\.print() / PDF.js

window\.print() 这个只能导出当前页面，明显不符合需求
PDF.js 能够传入 html 进行特定导出，但是这个库主要是做 pdf 的预览用来导出虽然可以，但是缺点很明显，有些复杂的 css 样式会丢失，svg 不支持，实践下来不合适

### jspdf + html2canvas

[html2canvas](https://html2canvas.hertzen.com/configuration)

[jspdf](https://artskydj.github.io/jsPDF/docs/index.html)

纯前端方案，思路：写出想要样式的 html 页面，通过 html2canvas 将写好的 html 代码绘制在 canvas 上再转成图片通过 jspdf 将图片转成 pdf 导出

缺点：存在跨域问题，对 svg 不友好

```js
const A4_WIDTH = 595.28;
const A4_HEIGHT = 841.89;

const el = document.getElementById('export_pdf');

html2canvas(el, {
    allowTaint: true,
    useCORS: true,
    scale: 3,
    background: '#FFFFFF'
  }).then(canvas => {
    const a4HeightRef = Math.floor((canvas.width / A4_WIDTH) * A4_HEIGHT);
    const pageData = canvas.toDataURL('image/jpeg', 1.0);

    const pdf = new jsPDF('p', 'pt', 'a4');
    pdf.addImage(
        pageData,
        'JPEG',
        0,
        30,
        A4_WIDTH,
        (A4_WIDTH / canvas.width) * canvas.height
    );
    pdf.save('test.pdf');
  });
```

但是这种方法会有额外的坑会需要处理：

*   图片 / 外部资源文件出现跨域
*   svg 支持不友好，需要额外操作处理，转图片或者base64
*   页眉页脚需要用 canvas 绘制上去
*   分页问题要自己计算处理

分页处理：

创建一个 canvas 用来保存每一页的内容，再计算每一页内容高度进行分割

```js
html2canvas(el, {
    allowTaint: true,
    useCORS: true,
    scale: 3,
    background: '#FFFFFF'
  }).then(canvas => {
    const a4HeightRef = Math.floor((canvas.width / A4_WIDTH) * A4_HEIGHT);
    const pageData = canvas.toDataURL('image/jpeg', 1.0);
    
    let leftHeight = canvas.height,
      height = 0,
      position = 0;

    const pdf = new jsPDF('p', 'pt', 'a4');
    
    // 内容少于一页的高度的情况直接导出
    if (leftHeight < a4HeightRef) {
      pdf.addImage(
        pageData,
        'JPEG',
        0,
        30,
        A4_WIDTH,
        (A4_WIDTH / canvas.width) * leftHeight
      );
      pdf.save('test.pdf');
    } else {
      try {
        setTimeout(generatePage, 500, canvas);
      } catch (err) {
        // console.log(err);
      }
    }
  });

```

分页这个思路就是从一页的高度从下往上扫描每个像素点，假如你的 pdf 需要截断的内容样式有多种颜色以上的就可以参考下面来进行截断

```js
// generatePage function
function generatePage(canvas) {
      if (leftHeight > 0) {
        let checkCount = 0; // 扫描 canvas 符合截断的行数
        if (leftHeight > a4HeightRef) {
          let i = position + a4HeightRef;
          for (i; i >= position; i--) {
            let isWrite = true;
            for (let j = 0; j < canvas.width; j++) {
              let isNoWhiteColor = false,
                isNoGreyColor = false;
              const c = canvas.getContext('2d').getImageData(j, i, 1, 1).data; // 获取对应像素点颜色数据

              if (c[0] != 0xff || c[1] != 0xff || c[2] != 0xff) {
                isNoWhiteColor = true;
              }
              if (c[0] != 0xe9 || c[1] != 0xe9 || c[2] != 0xec) {
                isNoGreyColor = true;
              }
              if (isNoWhiteColor && isNoGreyColor) {
                isWrite = false;
                break;
              }
            }
            if (isWrite) {
              checkCount++;
              // 超过十五行像素点符合需求，获取当前高度退出循环
              if (checkCount >= 15) {
                break;
              }
            } else {
              checkCount = 0;
            }
          }
          height =
            Math.floor(i - position) || Math.min(leftHeight, a4HeightRef);
          if (height <= 0) {
            height = a4HeightRef;
          }
        } else {
          height = leftHeight;
        }

        canvas1.width = canvas.width;
        canvas1.height = height;

        const ctx = canvas1.getContext('2d');
        ctx.drawImage(
          canvas,
          0,
          position,
          canvas.width,
          height,
          0,
          0,
          canvas.width,
          height
        );

        if (position != 0) {
          pdf.addPage();
        }
        pdf.addImage(
          canvas1.toDataURL('image/jpeg', 1.0),
          'JPEG', 
          0,
          30,
          A4_WIDTH,
          (A4_WIDTH / canvas1.width) * height
        );
        leftHeight -= height;
        position += height;
        if (leftHeight > 0) {
          // 递归分页
          setTimeout(generatePage, 500, canvas);
        } else {
          pdf.save(outputName);
        }
      }
    }
```

### 无头浏览器导出 PDF （Puppeteer）

[Puppeteer](https://pptr.dev/guides/getting-started)

这种方式支持导出特定 html，并且能够适配 css 样式，可以解决图片跨域的问题，分页问题可以用 css 精确控制，目前我只用在我的简历上，所以能靠静态 css 来解决分页问题，至于动态的分页问题，可以转换一下大小比例在需要分页的地方 / 分页需要将内容完整展示在第二页这些位置插入一个有高度的空标签把内容挤下去

这种导出的 pdf 文字可复制，链接可以跳转，相对 html2canvas + jspdf 的方案会更友好，页眉页脚也能用 html 模块进行设置

缺点就是：不是纯前端，需要服务端接口配合或者中间件

最近在写 nuxt3 搭建个人网站，所以顺带用 puppeteer 实现一下，用来导出我的简历

```js
import puppeteer from "puppeteer";
import fs from 'fs'

async function launchBrowser() {
  try {
    const browser = await puppeteer.launch({
      ignoreHTTPSErrors: true,
      headless: true,
      timeout: 60000,
    });
    return browser
  } catch (e) {
    console.log(e)
    return null
  }
}

export default eventHandler(async (req, res) => {
  const browser = await launchBrowser()
  if (!!browser) {
    const page = await browser.newPage();    // 开启一个新的标签页
    await page.goto('http://localhost:3000/export-pdf', { waitUntil: 'networkidle0' }) // 等待响应加载

    // PDF尺寸设置
    const pdfConfig = {
      //纸张尺寸
      format: 'A4',
      preferCSSPageSize: true,    // 页面优先级声明CSS
      printBackground: true,      // 是否打印背景，CSS
      displayHeaderFooter: false, // 是否展示页眉页脚
      margin: {
        top: 0,
        left: 0,
        right: 0,
        bottom: '10mm'
      },
      footerTemplate: '<div></div>', // 页脚为空标签
    }

    const result = await page.pdf(pdfConfig); // 生成 PDF 
    
    // 写入服务端文件，如不需要可忽视
    const pathName = './pdf/test.pdf'
    if(fs.existsSync(pathName)) {
      fs.unlinkSync(pathName);
    }
    fs.writeFileSync(pathName, result)

    await page.close(); // 关闭标签页
    
    // 返回 pdf 内容， 前端拿到 blob 可用于下载 pdf
    return {
      code: 200,
      message: 'Success',
      blob: result
    }
  } else {
    return {
      code: 202,
      message: 'Not Launch browser'
    }
  }
})
```

# 总结

***

1.  简单文案类型的 PDF 导出可以用 pdf.js
2.  复杂类型的纯前端方案 html2canvas + jspdf （但是坑比较多），能用中间件或者服务端支持的尽量用，各方面都比较舒服，坑会少点
