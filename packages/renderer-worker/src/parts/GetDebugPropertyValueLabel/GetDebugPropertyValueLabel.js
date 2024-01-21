const getInnerPreview = (inner) => {
  if (inner.type === 'string') {
    return `${inner.name}:'${inner.value}'`
  }
  return `${inner.name}:${inner.value}`
}

const getDebugPropertyValueLabelObject = (property) => {
  if (property.preview) {
    const inner = property.preview.properties.map(getInnerPreview).join(',')
    return `{${inner}}`
  }
  return property.description
}

export const getDebugPropertyValueLabel = (property) => {
  switch (property.type) {
    case 'number':
    case 'symbol':
    case 'function':
      return property.description
    case 'object':
      return getDebugPropertyValueLabelObject(property)
    case 'undefined':
      return `undefined`
    case 'string':
      return `"${property.value}"`
    case 'boolean':
      return `${property.value}`
    default:
      return `${JSON.stringify(property)}`
  }
}
