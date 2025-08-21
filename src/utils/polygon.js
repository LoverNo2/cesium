import { circle } from '@turf/turf'
import { Cartesian3 } from 'cesium'

function createPolygon(viewer, options) {
  const { center, outerRadius, innerRadius, option, heightRange, color } = options

  let outerCircle = circle(center, outerRadius, option).geometry.coordinates[0].flat()
  outerCircle.splice(outerCircle.length - 2, 2)

  let innerCircle = circle(center, innerRadius, option).geometry.coordinates[0].flat()
  innerCircle.splice(innerCircle.length - 2, 2)
  const polygonEntity = viewer.entities.add({
    polygon: {
      hierarchy: {
        positions: Cartesian3.fromDegreesArray(outerCircle),
        holes: [
          {
            positions: Cartesian3.fromDegreesArray(innerCircle),
          },
        ],
      },
      extrudedHeight: heightRange[0],
      height: heightRange[1],
      material: color,
    },
  })
  return polygonEntity
}

function createPolygonWithOutline(viewer, options) {
  const { center, outerRadius, innerRadius, option, heightRange, color, outerColor, borderWidth } =
    options
  createPolygon(viewer, {
    center,
    outerRadius: outerRadius - borderWidth,
    innerRadius,
    option,
    heightRange,
    color: color,
  })
  createPolygon(viewer, {
    center,
    outerRadius,
    innerRadius: outerRadius - borderWidth,
    option,
    heightRange,
    color: outerColor,
  })
}

function createPolygonByArray(viewer, polygonArray, defaultOptions) {
  const createdEntities = []
  let previousOuterRadius = null

  for (let i = 0; i < polygonArray.length; i++) {
    const polygonItem = polygonArray[i]
    const options = {
      ...defaultOptions,
      ...polygonItem,
    }
    let {
      center,
      outerRadius,
      innerRadius,
      option,
      heightRange,
      color = new Cesium.Color(1.0, 0.0, 0.0, 0.1),
      outerColor = new Cesium.Color(1.0, 0.0, 0.0, 0.3),
      borderWidth = 0.0005,
    } = options
    let currentInnerRadius

    if (i === 0) {
      currentInnerRadius = typeof options.innerRadius === 'number' ? options.innerRadius : 0
    } else {
      currentInnerRadius = previousOuterRadius
    }
    createPolygonWithOutline(viewer, {
      center,
      outerRadius,
      innerRadius: currentInnerRadius,
      option,
      heightRange,
      color,
      outerColor,
      borderWidth,
    })

    previousOuterRadius = outerRadius
    createdEntities.push({
      index: i,
      center,
      outerRadius,
      innerRadius,
      color,
      outerColor,
      borderWidth,
    })
  }

  return createdEntities
}
export { createPolygonByArray }
