<template>
  <div class="wrapper">
    <Loading :isLoading="isLoading">
      <div ref="container" class="container"></div>
    </Loading>
  </div>
</template>

<script setup>
import * as THREE from 'three'
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

const props = defineProps(['stlModel'])
const container = ref(null)
const isLoading = ref(false)

const renderer = new THREE.WebGLRenderer();

onMounted(() => {
  isLoading.value = true

  const width = container.value.clientWidth,
    height = container.value.clientHeight

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xe2e5ee)

  const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
  camera.position.set(0, 0, 10);

  renderer.setSize(width, height);
  container.value.appendChild(renderer.domElement);

  // 添加光源
  const directionalLight = new THREE.DirectionalLight(0xffffff, 2); // 方向光
  directionalLight.position.set(0, 10, 10);
  scene.add(directionalLight);

  const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.8);
  scene.add(hemisphereLight);

  // 轨道控制器，允许用户旋转和缩放模型
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true; // 启用阻尼效果（流畅的旋转）
  controls.autoRotate = true
  controls.enablePan = true;
  controls.panSpeed = 1;

  function animate() {
    requestAnimationFrame(animate);
    // 光源跟随相机
    directionalLight.position.copy(camera.position);
    controls.update(); // 更新控制器

    renderer.render(scene, camera);
  }
  animate()

  // load stl model
  const stlPath = props.stlModel.pathname,
    stlScale = props.stlModel.scale
  const stlLoader = new STLLoader()
  stlLoader.load(
    `/3d-preview/${stlPath}`,
    (geometry) => {
      setTimeout(() => {
        isLoading.value = false
      }, 300)

      geometry.center()
      const material = new THREE.MeshPhongMaterial({ color: 0xbebebe });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.scale.set(stlScale, stlScale, stlScale)

      scene.add(mesh);
    },
    undefined,
    (error) => {
      console.log(error)
      isLoading.value = false
    })
})

onUnmounted(() => {
  if (renderer) {
    renderer.dispose()
  }
})

</script>

<style scoped lang='scss'>
.wrapper {
  width: 100%;
  height: 500px;
}
.container {
  width: 100%;
  height: 500px;
  border-radius: 16px;
  overflow: hidden;
}
</style>