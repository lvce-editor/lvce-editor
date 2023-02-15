import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'

export const handleDrop = async (state, eventX, eventY, files) => {
  for (const file of files) {
    if (file.path) {
      await openUri(state, file.path)
    } else {
      // TODO
    }
    console.log(file)
  }
  await RendererProcess.invoke(/* Viewlet.send */ 'Viewlet.send', /* id */ ViewletModuleId.Main, /* method */ 'stopHighlightDragOver')
  await RendererProcess.invoke(/* Viewlet.send */ 'Viewlet.send', /* id */ ViewletModuleId.Main, /* method */ 'hideDragOverlay')
  return state
}
