import { circle } from '@turf/turf'
import { Cartesian3 } from 'cesium'

function createCylinder(viewer, options) {
  const { center, outerRadius, innerRadius, option, heightRange, color } = options

  let outerCircle = circle(center, outerRadius, option).geometry.coordinates[0].flat()
  outerCircle.splice(outerCircle.length - 2, 2)

  let innerCircle = circle(center, innerRadius, option).geometry.coordinates[0].flat()
  innerCircle.splice(innerCircle.length - 2, 2)
  const cylinderEntity = viewer.entities.add({
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
  return cylinderEntity
}

function createCylinderWithOutline(viewer, options) {
  const { center, outerRadius, innerRadius, option, heightRange, color, outerColor, borderWidth } =
    options
  createCylinder(viewer, {
    center,
    outerRadius: outerRadius - borderWidth,
    innerRadius,
    option,
    heightRange,
    color: color,
  })
  createCylinder(viewer, {
    center,
    outerRadius,
    innerRadius: outerRadius - borderWidth,
    option,
    heightRange,
    color: outerColor,
  })
}

function createCylinderByArray(viewer, cylinderArray, defaultOptions) {
  const createdEntities = []
  let previousOuterRadius = null

  for (let i = 0; i < cylinderArray.length; i++) {
    const cylinderItem = cylinderArray[i]
    const options = {
      ...defaultOptions,
      ...cylinderItem,
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
    createCylinderWithOutline(viewer, {
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
export { createCylinderByArray }
