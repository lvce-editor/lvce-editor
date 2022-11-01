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
  canvas.width = 600
  canvas.height = 600
  const ctx = canvas.getContext('2d')

  ctx.fillStyle = 'rgb(200, 0, 0)'
  ctx.fillRect(10, 10, 50, 50)

  ctx.fillStyle = 'rgba(0, 0, 200, 0.5)'
  ctx.fillRect(30, 30, 50, 50)
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
