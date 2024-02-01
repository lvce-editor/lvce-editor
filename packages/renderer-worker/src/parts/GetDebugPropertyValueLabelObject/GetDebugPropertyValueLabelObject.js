import * as GetDebugPropertyValueLabelArray from '../GetDebugPropertyValueLabelArray/GetDebugPropertyValueLabelArray.js'

const getInnerPreview = (inner) => {
  if (inner.type === 'string') {
    return `${inner.name}:'${inner.value}'`
  }
  return `${inner.name}:${inner.value}`
}

export const getDebugPropertyValueLabelObject = (property) => {
  if (property.subtype === 'array') {
    return GetDebugPropertyValueLabelArray.getDebugPropertyValueLabelArray(property)
  }
  if (property.preview) {
    const inner = property.preview.properties.map(getInnerPreview).join(',')
    if (property.preview.description !== 'Object') {
      return `${property.preview.description} {${inner}}`
    }
    return `{${inner}}`
  }
  return property.description
}
