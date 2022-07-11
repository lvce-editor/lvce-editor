import * as Extension from '../Extension/Extension.js'
import * as ExtensionHostReference from '../ExtensionHostReference/ExtensionHostReference.js'

const getFn = (method) => {
  switch (method) {
    case 'Extension.activate':
      return Extension.activate
    case 'Reference.execute':
    case 'References.execute':
      return ExtensionHostReference.executeReferenceProvider
    default:
      throw new Error(`method not found: ${method}`)
  }
}

export const execute = async (method, ...params) => {
  const fn = getFn(method)
  await fn(...params)
}
