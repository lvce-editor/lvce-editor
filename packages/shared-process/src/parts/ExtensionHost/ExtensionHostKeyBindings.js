import * as ExtensionManagement from '../ExtensionManagement/ExtensionManagement.js'

const getExtensionKeyBindings = (extension) => {
  return extension.keyBindings || []
}

export const getKeyBindings = async () => {
  const extensions = await ExtensionManagement.getExtensions()
  const keyBindings = extensions.flatMap(getExtensionKeyBindings)
  return keyBindings
}
