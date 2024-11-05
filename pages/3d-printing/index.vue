<template>
  <div class="model_list_content custom-scrollbar">
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
@import './index.scss';

</style>
