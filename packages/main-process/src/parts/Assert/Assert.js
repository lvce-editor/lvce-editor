// TODO treeshake out this whole module in production

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

exports.object = (value) => {
  const type = getType(value)
  if (type !== 'object') {
    throw new Error('expected value to be of type object')
  }
}

exports.number = (value) => {
  const type = getType(value)
  if (type !== 'number') {
    throw new Error('expected value to be of type number')
  }
}

exports.array = (value) => {
  const type = getType(value)
  if (type !== 'array') {
    throw new Error('expected value to be of type array')
  }
}

exports.string = (value) => {
  const type = getType(value)
  if (type !== 'string') {
    throw new Error('expected value to be of type string')
  }
}

exports.boolean = (value) => {
  const type = getType(value)
  if (type !== 'boolean') {
    throw new Error('expected value to be of type boolean')
  }
}
