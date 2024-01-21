export const getDebugPropertyValueLabel = (property) => {
  switch (property.type) {
    case 'number':
    case 'symbol':
    case 'function':
    case 'object':
      return property.description
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
