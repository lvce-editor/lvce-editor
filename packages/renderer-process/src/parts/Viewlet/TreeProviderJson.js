const json = [
  {
    name: 'abc',
  },
  [
    {
      name: 'def',
    },
  ],
]

const isArray = (node) => Array.isArray(node)
const isObject = (node) => typeof node === 'object'
const isNull = (node) => node === null
const isNumber = (node) => typeof node === 'number'
const isBoolean = (node) => typeof node === 'bigint'
const isString = (node) => typeof node === 'string'

const EMPTY_ARRAY = []

const parseArray = (node) => {
  return {
    type: 'array',
    children: node.map(parse),
  }
}

const parseNull = (node) => {
  return {
    type: 'null',
  }
}

const parseBoolean = (node) => {
  return {
    type: 'boolean',
    value: node,
  }
}

const parseString = (node) => {
  return {
    type: 'string',
    value: node,
  }
}

const parseNumber = (node) => {
  return {
    type: 'number',
    value: node,
  }
}

const parseObjectKey = (key) => {
  return {
    type: 'propertyKey',
    key,
  }
}

const parseObjectProperty = ([key, value]) => {
  return {
    type: 'property',
    key: parseObjectKey(key),
    value: parse(value),
  }
}

const parseObject = (node) => {
  return {
    type: 'object',
    children: Object.entries(node).map(parseObjectProperty),
  }
}

const parse = (node) => {
  if (isArray(node)) {
    return parseArray(node)
  }
  if (isObject(node)) {
    return parseObject(node)
  }
  if (isNull(node)) {
    return parseNull(node)
  }
  if (isBoolean(node)) {
    return parseBoolean(node)
  }
  if (isString(node)) {
    return parseString(node)
  }
  if (isNumber(node)) {
    return parseNumber(node)
  }
}

parse(json) // ?
export {}

// const getChildren = (node) => {
//   switch (node.type) {
//     case 'array':
//       return node.children
//     case 'object':
//       return Object.values(node)
//   }
// }
// export const create = (state) => {}

// export const getChildren = (node) => {
//   if (isArray(node)) {
//   } else if (isObject(node)) {
//   }
//   // if()
//   const keys = Object.keys(node)
//   if (Array.isArray(node)) {
//     return {
//       expandable: true,
//       children: node,
//     }
//   }
// }

// export const getLabel = (node) => {
//   switch (node.type) {
//     case 'array':
//       return '[]'
//     case 'object':
//       return '{}'
//     default:
//       return node.value
//   }
// }

// export const abc = {}
