import * as ExtensionDisplay from '../ExtensionDisplay/ExtensionDisplay.js'

const matchesParsedValue = (extension, parsedValue) => {
  if (extension && typeof extension.name === 'string') {
    return extension.name.toLowerCase().includes(parsedValue.query)
  }
  if (extension && typeof extension.id === 'string') {
    return extension.id.toLowerCase().includes(parsedValue.query)
  }
  return false
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
  return filteredExtensions
}
