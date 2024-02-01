const RE_ARRAY_DESCRIPTION = /\((\d+)\)/

const parseLength = (description) => {
  const match = description.match(RE_ARRAY_DESCRIPTION)
  if (match) {
    return match[1]
  }
  return ''
}

const getArrayPropertyPreview = (item) => {
  return `"${item.value}"`
}

const getArrayPropertiesPreview = (properties) => {
  const formattedItems = properties.map(getArrayPropertyPreview)
  return formattedItems.join(', ')
}

export const getDebugPropertyValueLabelArray = (property) => {
  if (property.preview) {
    const innerLabel = getArrayPropertiesPreview(property.preview.properties)
    const lengthPreview = parseLength(property.description)
    return `(${lengthPreview}) [` + innerLabel + `]`
  }
  return property.description
}
