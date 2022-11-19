import * as ParseExtensionSearchValue from '../ParseExtensionSearchValue/ParseExtensionSearchValue.js'
import { VError } from '../VError/VError.js'

const matchesParsedValue = (extension, parsedValue) => {
  if (extension && typeof extension.name === 'string') {
    return extension.name.includes(parsedValue.query)
  }
  if (extension && typeof extension.id === 'string') {
    return extension.id.includes(parsedValue.query)
  }
  return false
}

const getExtensionsLocal = (extensions, parsedValue) => {
  const filteredExtensions = []
  for (const extension of extensions) {
    if (matchesParsedValue(extension, parsedValue)) {
      filteredExtensions.push(extension)
    }
  }
  return filteredExtensions
}

const getExtensions = (extensions, parsedValue) => {
  // if (parsedValue.isLocal) {
  return getExtensionsLocal(extensions, parsedValue)
  // }
  // return getExtensionsMarketplace(parsedValue)
}

export const searchExtensions = async (extensions, value) => {
  try {
    const parsedValue = ParseExtensionSearchValue.parseValue(value)
    const filteredExtensions = await getExtensions(extensions, parsedValue)
    return filteredExtensions
  } catch (error) {
    throw new VError(error, `Failed to search for extensions`)
  }
}
