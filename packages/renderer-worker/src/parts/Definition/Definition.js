import * as ExtensionHostDefinition from '../ExtensionHost/ExtensionHostDefinition.js'

export const getDefinition = async (editor, offset) => {
  const definition = await ExtensionHostDefinition.executeDefinitionProvider(editor, offset)
  return definition
}
