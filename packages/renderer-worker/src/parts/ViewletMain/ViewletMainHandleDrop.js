import * as RendererProcess from '../RendererProcess/RendererProcess.js'

const openFiles = async (files) => {
  // TODO
}

export const handleDragLeave = async (state, eventX, eventY, files) => {
  await openFiles(files)
  const { uid } = state
  const commands = [
    ['Viewlet.send', uid, 'stopHighlightDragOver'],
    ['Viewlet.send', uid, 'hideDragOverlay'],
  ]
  await RendererProcess.invoke('Viewlet.sendMultiple', commands)
  return state
}
