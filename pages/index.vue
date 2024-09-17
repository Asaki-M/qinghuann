<template>
    <div class="welcome-content">
        <div class="title" @click="onExportResume">
            清欢杂记
        </div>
        <div class="description">
            <p>我会在网站上分享我的博客、开发小工具</p>
            <p>喜欢 3D 建模，打印一些 cos 道具以及小玩意</p>
            <p>偶尔会更新一些生活日常</p>
        </div>
    </div>
</template>

<style scoped lang="scss">
.welcome-content {
    width: 100%;
    height: 50%;
    position: absolute;
    bottom: 0;
    color: #fff;
    padding: 10% 10% 0;

    .title {
        font-size: 50px;
        font-weight: bold;
    }
}
</style>

<script setup>
async function onExportResume() {
    const res = await fetch('/api/report')
    // const blobData = res
    // if (blobData) {
    //     const url = URL.createObjectURL(blobData);
    //     const a = document.createElement("a");
    //     a.href = url;
    //     a.download = "胡杰铭-前端工程师.pdf";
    //     document.body.appendChild(a);
    //     a.click()
    // }
}
</script>