import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'

export const handleDragLeave = async (state, x, y) => {
  await RendererProcess.invoke(/* Viewlet.send */ 'Viewlet.send', /* id */ ViewletModuleId.Main, /* method */ 'stopHighlightDragOver')
  await RendererProcess.invoke(/* Viewlet.send */ 'Viewlet.send', /* id */ ViewletModuleId.Main, /* method */ 'hideDragOverlay')
  return state
}
