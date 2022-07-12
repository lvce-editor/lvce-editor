import * as ExtensionHostExtension from '../ExtensionHostExtension/ExtensionHostExtension.js'
import * as ExtensionHostReference from '../ExtensionHostReference/ExtensionHostReference.js'

const getFn = (method) => {
  switch (method) {
    case 'ExtensionHostExtension.activate':
    case 'ExtensionHostExtension.enableExtension':
      return ExtensionHostExtension.activate
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
