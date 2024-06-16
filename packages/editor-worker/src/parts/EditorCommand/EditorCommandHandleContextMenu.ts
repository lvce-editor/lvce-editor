import * as MenuEntryId from '../MenuEntryId/MenuEntryId.ts'
import * as RendererWorker from '../RendererWorker/RendererWorker.ts'

export const handleContextMenu = async (editor: any, button: any, x: number, y: number) => {
  await RendererWorker.invoke(/* ContextMenu.show */ 'ContextMenu.show', /* x */ x, /* y */ y, /* id */ MenuEntryId.Editor)
  return editor
}
