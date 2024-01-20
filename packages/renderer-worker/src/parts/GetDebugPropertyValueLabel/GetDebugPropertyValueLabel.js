export const getDebugPropertyValueLabel = (property) => {
  console.log({ property })
  switch (property.type) {
    case 'number':
    case 'boolean':
    case 'symbol':
      return property.description
    case 'undefined':
      return `undefined`
    default:
      return `${JSON.stringify(property)}`
  }
}
