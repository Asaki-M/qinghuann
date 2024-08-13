<template>
    <div>
        <h1>Home Page</h1>
        <button @click="onExportResume">export my resume</button>
    </div>
</template>

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