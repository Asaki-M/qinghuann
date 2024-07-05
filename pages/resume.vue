<template>
    <header>
        <div class="name_info">
            <h2>胡杰铭</h2>
            <p>应聘岗位：前端开发工程师</p>
        </div>
        <div class="person_info">
            <div class="info_item">
                <span>年龄：</span>
                <span>25</span>
            </div>
            <div class="info_item">
                <span>联系电话：</span>
                <span>17278718630</span>
            </div>
            <div class="info_item">
                <span>邮箱：</span>
                <span>1041220793@qq.com</span>
            </div>
            <div class="info_item">
                <span>学历：</span>
                <span>本科</span>
            </div>
            <div class="info_item">
                <span>学校：广州大学华软软件学院</span>
                <span>本科</span>
            </div>
        </div>
        <div class="avatar_info">
            <img src="/img/avatar.jpg" alt="person avatar">
        </div>
    </header>
    <main>
        <div class="professional_skill_container">
            <div class="title_container">
                专业技能
            </div>
            <ul class="professional_skill_content">
                <li>熟悉 HTML5 / CSS3 并能完成常用布局</li>
                <li>熟悉掌握 JavaScript / ES6</li>
                <li>熟练使用 Vue / React 全家桶开发</li>
                <li>了解 Nuxtjs 使用</li>
                <li>掌握 HTTP 和 Web 开发安全等知识以及浏览器相关知识</li>
            </ul>
        </div>
        <div class="work_experience_container">
            <div class="title_container">
                工作经历
            </div>
            <ul class="info_ul_content">
                <li>
                    <span>优倍快网络技术咨询（上海）有限公司</span>
                    <span>全职</span>
                    <span>2022.7 - 2024.6</span>
                </li>
                <li>
                    <span>广州汇量信息科技有限公司</span>
                    <span>实习</span>
                    <span>2021.6 - 2021.9</span>
                </li>
            </ul>
        </div>
        <div class="project_experience_container">
            <div class="title_container">
                项目经历
            </div>
            <ul class="info_ul_content">
                
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
    padding: 8px;
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

.professional_skill_container {
    width: 100%;
    padding: 8px;
    margin-top: 16px;
}

.work_experience_container {
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
</style>