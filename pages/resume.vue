<template>
    <header class="px-5 pt-5">
        <h1 class="text-3xl font-bold">胡杰铭</h1>
        <div class="info-container flex-x-sb ">
            <div class="person-info">
                <p class="text-base">性别: 男</p>
                <p class="text-base">求职：前端开发工程师</p>
                <p class="text-base">年龄: 25</p>
                <p class="text-base">工作经验: 2.5年</p>
                <p class="text-base">联系电话: 17278718630</p>
                <p class="text-base">邮箱: 1041220793@qq.com</p>
            </div>
            <img src="/img/avatar.jpg" class="w-28">
        </div>
    </header>
    <main class="px-5 pt-5">
        <div>
            <div class="text-sky-600 text-2xl divide-y-reverse mb-2 font-bold">专业技能</div>
            <UDivider size="sm" />
            <ul class="ul-container pl-7 pt-5">
                <li class="text-base">熟悉 HTML5 / CSS3 并能完成常用布局</li>
                <li class="text-base">熟悉掌握 JavaScript / ES6</li>
                <li class="text-base">熟练使用 Vue2 / Vue3 / React 框架开发</li>
                <li class="text-base">熟练使用 Antd / ElementUI 等组件库快速开发</li>
                <li class="text-base">掌握 HTTP 和 Web 开发安全等知识以及浏览器相关知识</li>
                <li class="text-base">熟悉 Git 代码管理</li>
                <li class="text-base">了解 ThreeJS 使用</li>
                <li class="text-base">了解 NuxtJs 服务器渲染, UniApp 小程序开发</li>
            </ul>
        </div>

        <div>
            <div class="text-sky-600 text-2xl divide-y-reverse mb-2 font-bold">工作经历</div>
            <UDivider size="sm" />
            <div class="pt-5">
                <p class="flex-x-sb text-lg">
                    <span class="font-bold">优倍快网络技术咨询（上海）有限公司 - 全职</span>
                    <span>2022.7 - 2024.6</span>
                </p>
                <p class="text-base pl-5 pt-2">技术栈： React + Redux + React Router</p>
                <p class="text-base pl-5 pt-2">产品描述： 一款管理企业设备(门禁、车位充电、摄像头等)、网络设备(VPN、Wifi)、员工信息(考勤打卡、请假加班申请等) 集成服务平台</p>
                <p class="text-base pl-5 pt-2">产品地址： <a class="text-sky-500" target="_blank"
                        href="https://ui.com/tw/en/identity">https://ui.com/tw/en/identity</a></p>
                <p class="text-base pl-5 pt-2">负责工作内容：</p>
                <ul class="ul-container pl-14">
                    <li class="text-base">负责平台部分模块的新 UX 开发以及维护旧模块功能，如 Directory 新 UX 模块 ( 邀请用户加入 ), Systemlog 新 UX 模块 (
                        记录平台操作日志 ), Integration 新 UX 模块(连接第三方应用与平台同步数据), Notice 模块 ( 平台通知消息 ), Wokrflow & Approval 模块 (
                        创建加班，请假，采购等审批表单 )</li>
                    <li class="text-base">参与负责模块功能测试，及时修复在测试和验收过程中发现的 Bug ，保障项目的稳定性和可靠性</li>
                    <li class="text-base">参与功能需求分析，确定方案设计方案以及代码实现设计</li>
                </ul>
                <p class="text-base pl-5 pt-2">工作成就：</p>
                <ul class="ul-container pl-14">
                    <li class="text-base">实施 PDF 导出并分页添加页眉页脚的方案用在 Approval 上</li>
                    <li class="text-base">完善了原有的富文本组件，增加 @ 人、表情、图片上传并排序等功能，并复用到项目 Notice/Helpdesk/Workflow/Approval 等模块中
                    </li>
                    <li class="text-base">发现富文本的一些 XSS 注入问题，修复后并排查出项目各个模块中的 XSS 注入问题</li>
                </ul>
            </div>
            <!-- pdf divide page -->
            <div class="pt-16"></div>
            <div class="pt-5">
                <p class="flex-x-sb text-lg">
                    <span class="font-bold">广州汇量信息科技有限公司 - 实习</span>
                    <span>2021.6 - 2021.9</span>
                </p>
                <p class="text-base pl-5 pt-2">技术栈： Vue2 以及周边生态库</p>
                <p class="text-base pl-5 pt-2">产品描述： 给广告主以及产品经理的实现可互动类型的手机广告页面搭建的平台，提供基础模板以及承包广告上线的流程</p>
                <p class="text-base pl-5 pt-2">负责工作内容：</p>
                <ul class="ul-container pl-14">
                    <li class="text-base">根据设计稿开发平台功能模块</li>
                    <li class="text-base">编写 H5 游戏广告页面，对不同的手机设备进行设配</li>
                </ul>
            </div>
        </div>

        <div>
            <div class="text-sky-600 text-2xl divide-y-reverse mb-2 font-bold">项目经历：</div>
            <UDivider size="sm" />
            <div class="pt-5">
                <p class="font-bold text-lg">
                   清欢杂记 - 个人网站
                </p>
                <p class="text-base pl-5 pt-2">技术栈： Vue3 + NuxtJS(相关生态库) + ThreeJS</p>
                <p class="text-base pl-5 pt-2">网站地址： <a class="text-sky-500" target="_blank"
                        href="https://qinghuann.top">https://qinghuann.top</a></p>
                <p class="text-base pl-5 pt-2">网站描述：</p>
                <ul class="ul-container pl-14">
                    <li class="text-base">添加加载完静态资源后才进入网站功能</li>
                    <li class="text-base">
                        利用 @nuxt/content 和 @nuxt/image 完成博客文章展示, markdown 转 html 并自定义样式，以及优化图片展示问题
                    </li>
                    <li class="text-base">使用 puppeteer 做中间件实现导出简历功能</li>
                    <li class="text-base">使用 ThreeJs 展示 STL 模型并支持拖拉旋转，放大缩小功能</li>
                </ul>
            </div>
        </div>

        <div>
            <div class="text-sky-600 text-2xl divide-y-reverse mb-2 font-bold">教育经历</div>
            <UDivider size="sm" />
            <ul class="pt-4 pb-8">
                <li class="text-base">学校：广州大学华软软件学院 ( 2018 - 2022 )</li>
                <li class="text-base">学历：本科</li>
                <li class="text-base">专业：软件工程</li>
                <li class="text-base"></li>
            </ul>
        </div>
    </main>
</template>

<script setup>
definePageMeta({
    layout: 'empty-layout'
})
</script>

<style lang="scss" scoped>
* {
    box-sizing: border-box;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.flex-x-sb {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.info-container {
    width: 100%;


    .person-info {
        width: 50%;
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        grid-template-rows: repeat(3, 1fr);
        gap: 10px;
        p {
            white-space: nowrap;
        }
    }
}

.ul-container {
    list-style: disc;
}

main {
    display: flex;
    flex-direction: column;
    gap: 16px;
}
</style>