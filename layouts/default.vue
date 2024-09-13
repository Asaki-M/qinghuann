<template>
  <Nav></Nav>
  <div class="content">
    <slot></slot>
  </div>
</template>

<style scoped lang='scss'>
.content {
  width: 100vw;
  height: 95vh;
  overflow: hidden;
  background-image: url('/img/background.png');
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  border-top-left-radius: 30px;
  border-top-right-radius: 30px;
  position: relative;
  user-select: none;
}
</style>