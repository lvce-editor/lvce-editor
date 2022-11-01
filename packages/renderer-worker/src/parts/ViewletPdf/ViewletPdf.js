import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'
import * as FileSystem from '../FileSystem/FileSystem.js'
import * as PdfWorker from '../PdfWorker/PdfWorker.js'
import * as OffscreenCanvas from '../OffscreenCanvas/OffscreenCanvas.js'

export const name = ViewletModuleId.Pdf

export const create = (id, uri, top, left, width, height) => {
  return {
    id,
    uri,
    top,
    left,
    width,
    height,
    content: '',
    ipc: undefined,
    canvas: undefined,
    canvasId: 0,
  }
}

export const loadContent = async (state) => {
  const { uri } = state
  const content = await FileSystem.readFile(uri)
  const ipc = await PdfWorker.create()
  const { canvasId, canvas } = await OffscreenCanvas.create()
  ipc.sendCanvas(canvas, content)
  // ipc.sendContent(content)
  return {
    ...state,
    content,
    ipc,
    canvas,
    canvasId,
  }
}

export const hasFunctionalRender = true

const renderCanvas = {
  isEqual(oldState, newState) {
    return oldState.canvasId === newState.canvasId
  },
  apply(oldState, newState) {
    console.log('render canvas')
    return ['Viewlet.send', 'Pdf', 'setCanvas', newState.canvasId]
  },
}

export const render = [renderCanvas]
