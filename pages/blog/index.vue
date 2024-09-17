<template>
  <div class="blogs_container">
    <ContentList path="/">
      <template #default="{ list }">
        <div class="blog_item fge-container" v-for="article in list" :key="article._path"
          @click="() => handleOpenDoc(article)">
          <h2 class="title">{{ article.title }}</h2>
          <p class="description">{{ article.description }}</p>
        </div>
      </template>
      <template #not-found>
        <p>No articles found.</p>
      </template>
    </ContentList>
  </div>
</template>
<script setup>
const router = useRouter()

const handleOpenDoc = (article) => {
  router.push({ path: `/blog${article._path}` })
}

</script>

<style scoped lang="scss">
.blogs_container {
  width: 70%;
  height: 100%;
  overflow: auto;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px 0;

  .blog_item {
    width: 100%;
    height: 100px;
    padding: 12px 20px;
    border-radius: 15px;
    cursor: pointer;

    .title {
      font-size: 28px;

    }

    .description {
      font-size: 20px;
      color: #303030;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}
</style>