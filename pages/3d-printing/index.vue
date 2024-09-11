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

  <UModal v-model="isOpen">
    <div class="modal_container">
      <div class="modal_header">
        <p>{{ stlModel?.name || '' }}</p>
        <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1"
          @click="handleCloseModal" />
      </div>
      <STLPreview :stlModel="stlModel"></STLPreview>
    </div>
  </UModal>
</template>

<script setup>
import { stllist } from '@utils/stllist';

const isOpen = ref(false)
const stlModel = ref(null)

const handleShowModal = (modal) => {
  if (!!modal) {
    stlModel.value = modal
    isOpen.value = true
  }
}
const handleCloseModal = () => {
  stlModel.value = null
  isOpen.value = false
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

.modal_container {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;

  .modal_header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
