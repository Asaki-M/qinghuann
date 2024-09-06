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
    await page.goto('http://localhost:3000/resume', { waitUntil: 'networkidle0' }) // 等待响应加载

    // PDF尺寸设置
    const pdfConfig = {
      //纸张尺寸
      format: 'A4',
      preferCSSPageSize: true,    // 页面优先级声明CSS
      printBackground: true,      // 是否打印背景，CSS
      displayHeaderFooter: true,
      margin: {
        top: 0,
        left: 0,
        right: 0,
        bottom: '10mm'
      },
      footerTemplate: '<div></div>',
    }

    const result = await page.pdf(pdfConfig); // 生成 PDF 
    const pathName = './resume/胡杰铭-前端工程师.pdf'
    if(fs.existsSync(pathName)) {
      fs.unlinkSync(pathName);
    }
    fs.writeFileSync(pathName, result)

    await page.close(); // 关闭标签页
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
