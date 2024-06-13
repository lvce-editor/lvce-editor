import * as RendererWorker from '../RendererWorker/RendererWorker.ts'

// @ts-ignore
export const getDefinition = async (editor, offset) => {
  const definition = await RendererWorker.invoke('ExtensionHostDefinition.executeDefinitionProvider', editor, offset)
  return definition
}
