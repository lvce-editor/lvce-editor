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

export const object = (value) => {
  const type = getType(value)
  if (type !== 'object') {
    throw new Error('expected value to be of type object')
  }
}

export const number = (value) => {
  const type = getType(value)
  if (type !== 'number') {
    throw new Error('expected value to be of type number')
  }
  if (isNaN(value)) {
    throw new Error('value is NaN')
  }
}

export const array = (value) => {
  const type = getType(value)
  if (type !== 'array') {
    throw new Error('expected value to be of type array')
  }
}

export const string = (value) => {
  const type = getType(value)
  if (type !== 'string') {
    throw new Error('expected value to be of type string')
  }
}

export const null_ = (value) => {
  const type = getType(value)
  if (type !== 'null') {
    throw new Error('expected value to be of type null')
  }
}

export const boolean = (value) => {
  const type = getType(value)
  if (type !== 'boolean') {
    throw new Error('expected value to be of type boolean')
  }
}

export const fn = (value) => {
  const type = getType(value)
  if (type !== 'function') {
    throw new Error('expected value to be of type function')
  }
}
