import * as RendererWorker from '../RendererWorker/RendererWorker.js'

export const getDefinition = async (editor, offset) => {
  const definition = await RendererWorker.invoke('ExtensionHostDefinition.executeDefinitionProvider', editor, offset)
  return definition
}
