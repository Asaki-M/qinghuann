<template>
    <header>
        <div class="name_info">
            <h2>Jieming Hu</h2>
            <p>Job Positions: Frontend Developer</p>
        </div>
        <div class="person_info">
            <div class="info_item">
                <span>Age:</span>
                <span>25</span>
            </div>
            <div class="info_item">
                <span>Phone:</span>
                <span>+86 17278718630</span>
            </div>
            <div class="info_item">
                <span>Mail:</span>
                <span>qinghuanhu@gmail.com</span>
            </div>
        </div>
        <!-- <div class="avatar_info">
            <img src="/img/avatar.webp" alt="person avatar">
        </div> -->
    </header>
    <main>
        <div class="work_experience_container">
            <div class="title_container">
                Work Experience
            </div>
            <ul class="info_ul_content">
                <li>
                    <span>Ubiquiti</span>
                    <span>Full Time</span>
                    <span>2022.7 - 2024.6</span>
                </li>
                <li>
                    <span>广州汇量信息科技有限公司(Mobvista)</span>
                    <span>Intern</span>
                    <span>2021.6 - 2021.9</span>
                </li>
            </ul>
        </div>
        <div class="project_experience_container">
            <div class="title_container">
                Project Experience
            </div>
            <div class="project_item_container">
                <p>UniFi Identity & UniFi Identity Enterprise - Ubiquiti</p>
                <ul class="project_item_list_container">
                    <li>
                        Description: A  platform that supports Converged Network & Physical Access, Hassle-Free VPN, Password-Free Secure WiFi, and Onboard and offboard with One Click and some on-feature 
                    </li>
                    <li>
                        url: https://ui.com/tw/en/identity
                    </li>
                    <li>Use Framework: ReactJS and some libraries</li>
                    <li>
                        <span> Job Description:</span>
                        <ul>
                            <li>
                                Wokrflow & Approval: Workflow 部分用于创建相关流程的审批， Approval 部分用于员工使用并提交审批（如请假，加班，采购等）
                            </li>
                            <li>
                                Directory 新 UX 模块：Directory 用于添加人员到该 Workspace，提供手动邮箱邀请，从 Console 中邀请用户，通过
                                AD/LDAP/Google/Microsoft 等方式邀请用户
                            </li>
                            <li>
                                Systemlog 新 UX 模块：记录 Wokrspace 中各种操作的日志
                            </li>
                            <li>
                                Integration 新 UX 模块：用于连接第三方 APP 数据，如 Slack/Splunk/OfficeRnd 等软件，以及可以配置 ApiToken 和
                                Webhook
                            </li>
                            <li>
                                MSP 模块：用于设置 Workspace 连接另外一个 Workspace 对应权限的人员，方便另一个 Workspace 的技术人员可以用他们的账号进行登录排查问题
                            </li>
                            <li>
                                Notice 模块：给管理员提供向 Workspace 所有人或者特定的人/组发送通知消息
                            </li>
                        </ul>
                    </li>
                    <li>
                        工作成就：
                        <ul>
                            <li>实施 PDF 导出并分页添加页眉页脚的方案用在 Approval 上</li>
                            <li>完善了原有的富文本组件，复用到项目 Notice/Helpdesk/Workflow/Approval 等模块中</li>
                            <li>发现富文本的一些 XSS 注入问题，修复后并排查出项目各个模块中的 XSS 注入问题</li>
                        </ul>
                    </li>
                </ul>
            </div>
            <div class="project_item_container">
                <p>Playsmart 低代码平台 - 广州汇量信息科技有限公司</p>
                <ul class="project_item_list_container">
                    <li>
                        <span>项目描述：</span>
                        <ul>
                            <li>给广告主以及产品经理的实现可互动类型的手机广告页面搭建的平台，提供基础模板以及承包广告上线的流程</li>
                        </ul>
                    </li>
                    <li>技术栈：Vue2 以及周边生态库</li>
                    <li>
                        <span> 负责工作内容：</span>
                        <ul>
                            <li>根据设计稿开发平台功能模块</li>
                            <li>编写 H5 游戏广告页面，对不同的手机设备进行设配</li>
                        </ul>
                    </li>
                </ul>
            </div>
        </div>
        <div class="professional_skill_container">
            <div class="title_container">
                专业技能
            </div>
            <ul class="professional_skill_content info_ul_content">
                <li>熟悉 HTML5 / CSS3 并能完成常用布局</li>
                <li>熟悉掌握 JavaScript / ES6</li>
                <li>熟练使用 Vue / React 全家桶开发</li>
                <li>了解 Nuxtjs 使用</li>
                <li>掌握 HTTP 和 Web 开发安全等知识以及浏览器相关知识</li>
            </ul>
        </div>
        <div class="school_info_container">
            <div class="title_container">
                教育经历
            </div>
            <ul class="school_info_content info_ul_content">
                <li>学校：广州大学华软软件学院</li>
                <li>学历：本科</li>
                <li>专业：软件工程</li>
                <li>2018 - 2022</li>
            </ul>
        </div>
    </main>
</template>

<style lang="scss" scoped>
* {
    box-sizing: border-box;
}

.title_container {
    font-size: 16px;
    font-weight: bold;
    border-bottom: 1px solid #333;
    padding-bottom: 12px;
}

.info_ul_content {
    li {
        padding: 4px 0;
    }
}

header {
    width: 100%;
    display: flex;
    align-items: center;
    background-color: #2775b6;
    padding: 8px 16px;
    color: #F0f0f0;

    .name_info {
        width: 40%;
    }

    .person_info {
        width: 50%;
        display: flex;
        flex-direction: column;
        gap: 4px;

    }

    .avatar_info {
        flex: 1;

        >img {
            width: 100%;
            height: 100%;
        }
    }
}

.professional_skill_container, .school_info_container {
    width: 100%;
    padding: 8px 16px;
}

.work_experience_container {
    margin-top: 16px;
    padding: 8px 16px;

    .info_ul_content li {
        span:first-child {
            display: inline-block;
            width: 40%;
        }

        span:nth-child(2) {
            display: inline-block;
            width: 20%;
        }
    }

}

.project_experience_container {
    padding: 8px 16px;
    .project_item_container:nth-child(2) {
        margin-top: 16px;
    }

    .project_item_container {

        >p {
            margin: 0;
        }

        .project_item_list_container {
            li {
                padding: 4px 0;
            }
        }
    }
}
</style>