<template>
  <div id="cesiumContainer"></div>
</template>

<script setup>
import { Viewer } from 'cesium'
import { flyTo, addCameraPositionLogger, cesiumConfig, addEntity } from '@/utils/cesium'
import { onMounted } from 'vue'

let viewer

const initMap = () => {
  viewer = new Viewer('cesiumContainer', cesiumConfig)
}
onMounted(() => {
  initMap()
  addEntity(viewer)
  flyTo(viewer)
  addCameraPositionLogger(viewer)
})
</script>
