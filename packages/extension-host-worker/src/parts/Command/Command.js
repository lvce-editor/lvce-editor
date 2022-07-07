import * as Extension from '../Extension/Extension.js'

const getFn = (method) => {
  switch (method) {
    case 'Extension.activate':
      return Extension.activate
    default:
      throw new Error(`method not found: ${method}`)
  }
}

export const execute = async (method, ...params) => {
  const fn = getFn(method)
  await fn(...params)
}
