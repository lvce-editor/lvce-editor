import * as RendererProcess from '../RendererProcess/RendererProcess.js'

export const handleDragLeave = async (state, x, y) => {
  const { uid } = state
  const commands = [
    ['Viewlet.send', uid, 'stopHighlightDragOver'],
    ['Viewlet.send', uid, 'hideDragOverlay'],
  ]
  await RendererProcess.invoke('Viewlet.sendMultiple', commands)
  return state
}
