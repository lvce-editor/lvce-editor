import * as RendererWorker from '../RendererWorker/RendererWorker.ts'

export const getTypeDefinition = async (editor, offset) => {
  const definition = await RendererWorker.invoke('ExtensionHostTypeDefinition.executeTypeDefinitionProvider', editor, offset)
  return definition
}
