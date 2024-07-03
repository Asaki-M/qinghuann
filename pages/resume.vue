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
        </div>
        <div class="avatar_info">
            <img src="/img/avatar.jpg" alt="person avatar">
        </div>
    </header>
</template>

<style lang="scss" scoped>
* {
    box-sizing: border-box;
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
</style>