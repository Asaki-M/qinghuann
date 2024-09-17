<template>
  <!-- <div class="header_container">
    <UButton color="gray" variant="soft" icon="i-heroicons-arrow-left-on-rectangle" />
  </div> -->
  <div class="fge-container blog-container custom-scrollbar markdown-content">
    <ContentDoc :path="slug" />
  </div>
</template>

<script setup>
import '~/assets/styles/markdown.scss'

const route = useRoute()
const slug = Array.isArray(route.params.slug) ? route.params.slug.join('/') : route.params.slug
</script>

<style scoped lang="scss">
.header_container {
  width: 90vw;
  height: 50px;
  margin: 0 auto;
}

.blog-container {
  width: 90vw;
  height: calc(100% - 50px);
  padding: 20px;
  margin: 16px auto;
  overflow: auto;
  background-color: #fff;
  border-radius: 16px;
}
</style>