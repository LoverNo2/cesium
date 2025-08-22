<template>
  <div id="cesiumContainer"></div>
</template>

<script setup>
  import * as Cesium from 'cesium'
  Cesium.Ion.defaultAccessToken = import.meta.env.VITE_CESIUM_ION_TOKEN
  import { Viewer, Color } from 'cesium'
  import { flyTo, addCameraPositionLogger, cesiumConfig, addEntity } from '@/utils/cesium'
  import { createPolygonByArray } from '@/utils/polygon'
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
    createPolygonByArray(
      viewer,
      [
        {
          outerRadius: 0.08,
          innerRadius: 0.03,
          color: new Color(1, 0, 0, 0.2),
          outerColor: new Color(1, 0, 0, 0.3),
        },
        {
          outerRadius: 0.18,
          color: new Color(1, 1, 0, 0.2),
          outerColor: new Color(1, 1, 0, 0.3),
        },
        {
          outerRadius: 0.28,
          color: new Color(1, 0, 1, 0.2),
          outerColor: new Color(1, 0, 1, 0.3),
        },
      ],
      {
        center: [117.258774, 31.818545], // 圆柱中心
        option: {
          steps: 2000,
          units: 'kilometers', //千米
          properties: { foo: 'bar' },
        },
        heightRange: [4500, 4700],
        borderWidth: 0.001,
      }
    )
  })
</script>
