import * as Assert from '../Assert/Assert.ts'
import * as RendererWorker from '../RendererWorker/RendererWorker.ts'

export const getHover = async (editor: any, offset: number) => {
  Assert.object(editor)
  Assert.number(offset)
  // TODO invoke extension host worker directly
  const hover = await RendererWorker.invoke('ExtensionHostHover.executeHoverProvider', editor, offset)
  return hover
}
