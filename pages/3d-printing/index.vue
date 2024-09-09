<template>
  <Nav></Nav>
  <div class="content">
    <div class="stl_list_container">
      <div class="stl_item" v-for="stl in stllist" :key="stl.pathname" @click="() => handleShowModal(stl)">
        <p>{{ stl.name }}</p>
        <img :src="`3d-preview/${stl.image}`"></img>
      </div>
    </div>
  </div>

  <UDashboardModal v-model="isOpen" :title="stlModal?.name || ''">
    <STLPreview :stlModal="stlModal"></STLPreview>
  </UDashboardModal>
</template>

<script setup>
import { stllist } from '@utils/stllist';

const isOpen = ref(false)
const stlModal = ref(null)

const handleShowModal = (id) => {
  if (!!id) {
    stlModal.value = id
    isOpen.value = true
  }
}

</script>

<style scoped lang="scss">
.content {
  width: 100vw;
  display: flex;
  justify-content: center;

  .stl_list_container {
    margin: 24px auto 0;
    display: grid;
    grid-template-columns: repeat(2, 300px);
    gap: 32px;
    grid-auto-rows: minmax(100px, auto);

    .stl_item {
      padding: 12px;
      height: 250px;
      border-radius: 16px;
      box-shadow: 0 6px 8px rgba($color: #000000, $alpha: 0.25);
      cursor: pointer;
      
      p {
        width: 100%;
      }
      img {
        width: 100%;
        height: 200px;
        border-radius: 20px;
      }
    }
  }
}
</style>
