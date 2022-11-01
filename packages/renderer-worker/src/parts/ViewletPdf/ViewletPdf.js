import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'
import * as FileSystem from '../FileSystem/FileSystem.js'
import * as PdfWorker from '../PdfWorker/PdfWorker.js'
import * as OffscreenCanvas from '../OffscreenCanvas/OffscreenCanvas.js'
import * as Id from '../Id/Id.js'

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
    page: 0,
  }
}

export const loadContent = async (state) => {
  const { uri, width, height } = state
  const content = await FileSystem.readFile(uri, 'binary')
  const canvasId = Id.create()
  const ipc = await PdfWorker.create()
  const canvas = await OffscreenCanvas.create(canvasId)
  await PdfWorker.sendCanvas(ipc, canvasId, canvas)
  await PdfWorker.invoke(ipc, 'Canvas.setContent', canvasId, content)
  await PdfWorker.invoke(ipc, 'Canvas.resize', canvasId, width, height)
  await PdfWorker.invoke(ipc, 'Canvas.render', canvasId)
  return {
    ...state,
    content,
    ipc,
    canvas,
    canvasId,
  }
}

export const hasFunctionalResize = true

export const resize = (state, dimensions) => {
  return { ...state, ...dimensions }
}

export const resizeEffect = async (state) => {
  const { canvasId, width, height, ipc } = state
  await PdfWorker.invoke(ipc, 'Canvas.resize', canvasId, width, height)
  await PdfWorker.invoke(ipc, 'Canvas.render', canvasId)
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
