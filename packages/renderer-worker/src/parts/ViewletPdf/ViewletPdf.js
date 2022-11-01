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
  const { uri } = state
  const content = await FileSystem.readFile(uri, 'binary')
  const canvasId = Id.create()
  const ipc = await PdfWorker.create()
  const canvas = await OffscreenCanvas.create(canvasId)
  ipc.sendCanvas(canvasId, canvas, content)
  return {
    ...state,
    content,
    ipc,
    canvas,
    canvasId,
  }
}

const focusPage = async (state, page) => {
  const { canvasId, ipc } = state
  await PdfWorker.invoke(ipc, 'Canvas.focusPage', canvasId, page)
  return {
    ...state,
    page,
  }
}

export const previous = (state) => {
  const { page } = state
  return focusPage(state, page - 1)
}

export const next = async (state) => {
  const { page } = state
  return focusPage(state, page + 1)
}

export const print = (state) => {
  throw new Error('not implemented')
}

export const zoomIn = (state) => {
  throw new Error('not implemented')
}

export const zoomOut = (state) => {
  throw new Error('not implemented')
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
