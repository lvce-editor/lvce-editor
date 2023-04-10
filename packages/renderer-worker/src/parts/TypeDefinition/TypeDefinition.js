import * as ExtensionHostTypeDefinition from '../ExtensionHost/ExtensionHostTypeDefinition.js'

export const getTypeDefinition = async (editor, offset) => {
  const definition = await ExtensionHostTypeDefinition.executeTypeDefinitionProvider(editor, offset)
  return definition
}
