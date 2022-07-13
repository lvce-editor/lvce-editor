const getType = (value) => {
  switch (typeof value) {
    case 'number':
      return 'number'
    case 'function':
      return 'function'
    case 'string':
      return 'string'
    case 'object':
      if (value === null) {
        return 'null'
      }
      if (Array.isArray(value)) {
        return 'array'
      }
      return 'object'
    case 'boolean':
      return 'boolean'
    default:
      return 'unknown'
  }
}

const validateResultObject = (result, resultShape) => {
  if (!resultShape.properties) {
    return undefined
  }
  for (const [key, value] of Object.entries(resultShape.properties)) {
    const expectedType = value.type
    const actualType = getType(result[key])
    if (expectedType !== actualType) {
      return `item.${key} must be of type ${expectedType}`
    }
  }
  return undefined
}

const validateResultArray = (result, resultShape) => {
  for (const item of result) {
    const actualType = getType(item)
    const expectedType = resultShape.items.type
    if (actualType !== expectedType) {
      return `expected result to be of type ${expectedType} but was of type ${actualType}`
    }
  }
  return undefined
}

const getPreviewObject = (item) => {
  return 'object'
}

const getPreviewArray = (item) => {
  if (item.length === 0) {
    return '[]'
  }
  return 'array'
}

const getPreview = (item) => {
  const type = getType(item)
  switch (type) {
    case 'object':
      return getPreviewObject(item)
    case 'array':
      return getPreviewArray(item)
    default:
      return `${item}`
  }
}

export const validate = (item, schema) => {
  const actualType = getType(item)
  const expectedType = schema.type
  if (actualType !== expectedType) {
    const preview = getPreview(item)
    return `item must be of type ${expectedType} but is ${preview}`
  }
  switch (actualType) {
    case 'object':
      return validateResultObject(item, schema)
    case 'array':
      return validateResultArray(item, schema)
  }
  // TODO use json schema to validate result
  return undefined
}
