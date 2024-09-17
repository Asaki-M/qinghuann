<template>
  <div class="header_container">
    <UButton icon="i-heroicons-outline-chevron-left" :ui="{ rounded: 'rounded-full' }" size="sm" color="gray" square variant="soft" @click="handleGoBack" />
    <p class="title">{{ title }}</p>
  </div>
  <div class="fge-container blog-container custom-scrollbar markdown-content">
    <ContentDoc :path="slug" />
  </div>
</template>

<script setup>
import '~/assets/styles/markdown.scss'
const router = useRouter()
const route = useRoute()
const slug = Array.isArray(route.params.slug) ? route.params.slug.join('/') : route.params.slug

const { data } = await useAsyncData('home', () => queryContent(slug).findOne())
const title = computed(() => data?.value?.title || '标题')
const handleGoBack = () => {
  router.go(-1)
}
</script>

<style scoped lang="scss">
.header_container {
  width: 90vw;
  height: 32px;
  margin: 16px auto 16px;
  background-color: #fff;
  border-radius: 16px;
  display: flex;
  align-items: center;

  .back_btn {
    &:hover {
      background-color: rgba($color: #000000, $alpha: 0.03);
      border-radius: 50%;
    }
  }
  .title {
    flex: 1;
    text-align: center;
  }
}

.blog-container {
  width: 90vw;
  height: calc(100% - 50px);
  padding: 20px;
  margin: 0 auto;
  overflow: auto;
  background-color: #fff;
  border-radius: 16px;
}
</style>