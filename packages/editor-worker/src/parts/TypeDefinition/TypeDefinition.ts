import * as RendererWorker from '../RendererWorker/RendererWorker.ts'

export const getTypeDefinition = async (editor: any, offset: number) => {
  const definition = await RendererWorker.invoke('ExtensionHostTypeDefinition.executeTypeDefinitionProvider', editor, offset)
  return definition
}
