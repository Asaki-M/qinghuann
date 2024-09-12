<template>
  <div class="bounce_text_container">
    <span class="bounce_letter" v-for="(letter, index) in props.message" :key="index" :style="{
      animationDelay: `${0.1 * index}s`
    }">
      {{ letter }}
    </span>
  </div>
</template>

<script setup>
const props = defineProps(['message'])

</script>

<style scoped lang='scss'>
@keyframes bounce {

  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-10px);
  }
}

.bounce_letter {
  display: inline-block;
  font-size: 20px;
  color: #5698c3;
  animation: bounce 1s infinite;
  animation-fill-mode: both;
}
</style>