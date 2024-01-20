export const getDebugPropertyValueLabel = (property) => {
  switch (property.type) {
    case 'number':
    case 'boolean':
    case 'symbol':
    case 'object':
      return property.description
    case 'undefined':
      return `undefined`
    default:
      return `${JSON.stringify(property)}`
  }
}
