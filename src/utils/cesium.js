import * as Cesium from 'cesium'

const cesiumConfig = {
  homeButton: false,
  sceneModePicker: true,
  fullscreenButton: false,
  infoBox: false,
  selectionIndicator: false,
  baseLayerPicker: false,
  shadows: true,
  shouldAnimate: true,
  animation: false,
  timeline: false,
  geocoder: false,
  navigationHelpButton: false,
  contextOptions: {
    contextType: 2,
  },
  creditContainer: document.createElement('div'),
}
function addCameraPositionLogger(viewer) {
  viewer.camera.moveEnd.addEventListener(() => {
    const cartesianPosition = viewer.camera.position
    const cartographicPosition = Cesium.Cartographic.fromCartesian(cartesianPosition)

    if (cartographicPosition) {
      const longitude = Cesium.Math.toDegrees(cartographicPosition.longitude)
      const latitude = Cesium.Math.toDegrees(cartographicPosition.latitude)
      const height = cartographicPosition.height

      console.log(
        `当前位置：经度=${longitude.toFixed(6)}, 纬度=${latitude.toFixed(6)}, 高度=${height.toFixed(
          2
        )}米`
      )
    }
  })
}
function flyTo(viewer) {
  viewer.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(117.258774, 31.813545, 5500),
    orientation: {
      heading: Cesium.Math.toRadians(0),
      pitch: Cesium.Math.toRadians(-60.0),
    },
  })
}
function addEntity(viewer) {
  viewer.entities.add({
    position: Cesium.Cartesian3.fromDegrees(117.27, 31.83, 3000),
    box: {
      dimensions: new Cesium.Cartesian3(100, 100, 100),
      material: Cesium.Color.RED.withAlpha(0.5),
      outline: true,
      outlineColor: Cesium.Color.BLACK.withAlpha(0.5),
    },
  })
}

export { addCameraPositionLogger, flyTo, addEntity, cesiumConfig }
