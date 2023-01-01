import * as ExtensionDisplay from '../ExtensionDisplay/ExtensionDisplay.js'
import * as Arrays from '../Arrays/Arrays.js'

const matchesParsedValue = (extension, parsedValue) => {
  if (extension && typeof extension.name === 'string') {
    const extensionNameLower = extension.name.toLowerCase()
    return extensionNameLower.includes(parsedValue.query)
  }
  if (extension && typeof extension.id === 'string') {
    const extensionIdLower = extension.id.toLowerCase()
    return extensionIdLower.includes(parsedValue.query)
  }
  return false
}

const compareExtension = (extensionA, extensionB) => {
  return extensionA.name.localeCompare(extensionB.name) || extensionA.id.localeCompare(extensionB.id)
}

const sortExtensions = (extensions) => {
  return Arrays.toSorted(extensions, compareExtension)
}

export const getExtensions = async (extensions, parsedValue) => {
  const filteredExtensions = []
  for (const extension of extensions) {
    if (matchesParsedValue(extension, parsedValue)) {
      filteredExtensions.push({
        name: ExtensionDisplay.getName(extension),
        id: ExtensionDisplay.getId(extension),
        publisher: ExtensionDisplay.getPublisher(extension),
        icon: ExtensionDisplay.getIcon(extension),
        description: ExtensionDisplay.getDescription(extension),
      })
    }
  }
  const sortedExtensions = sortExtensions(filteredExtensions)
  return sortedExtensions
}
