import * as EncodingType from '../EncodingType/EncodingType.js'
import * as FileSystem from '../FileSystem/FileSystem.js'
import * as Id from '../Id/Id.js'
import * as OffscreenCanvas from '../OffscreenCanvas/OffscreenCanvas.js'
import * as PdfWorker from '../PdfWorker/PdfWorker.js'
import * as PdfWorkerFunctions from '../PdfWorkerFunctions/PdfWorkerFunctions.js'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'

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
    numberOfPages: 0,
  }
}

export const saveState = (state) => {
  const { uri } = state
  return {
    uri,
  }
}

export const loadContent = async (state) => {
  const { uri, width, height } = state
  const content = await FileSystem.readFile(uri, EncodingType.Binary)
  const canvasId = Id.create()
  const ipc = await PdfWorker.create()
  const canvas = await OffscreenCanvas.create(canvasId)
  await PdfWorkerFunctions.sendCanvas(ipc, canvasId, canvas)
  const { numberOfPages } = await PdfWorkerFunctions.setContent(
    ipc,
    canvasId,
    content
  )
  await PdfWorkerFunctions.resize(ipc, canvasId, width, height)
  return {
    ...state,
    content,
    ipc,
    canvas,
    canvasId,
    numberOfPages,
  }
}

export const hasFunctionalResize = true

export const resize = (state, dimensions) => {
  return { ...state, ...dimensions }
}

export const resizeEffect = async (state) => {
  const { canvasId, width, height, ipc } = state
  await PdfWorkerFunctions.resize(ipc, canvasId, width, height)
}

export const hasFunctionalRender = true

const renderCanvas = {
  isEqual(oldState, newState) {
    return oldState.canvasId === newState.canvasId
  },
  apply(oldState, newState) {
    return ['Viewlet.send', 'Pdf', 'setCanvas', newState.canvasId]
  },
}

const renderNumberOfPages = {
  isEqual(oldState, newState) {
    return oldState.numberOfPages === newState.numberOfPages
  },
  apply(oldState, newState) {
    return ['Viewlet.send', 'Pdf', 'setNumberOfPages', newState.numberOfPages]
  },
}

const renderPageNumber = {
  isEqual(oldState, newState) {
    return oldState.page === newState.page
  },
  apply(oldState, newState) {
    return ['Viewlet.send', 'Pdf', 'setPageNumber', newState.page]
  },
}

export const render = [renderCanvas, renderNumberOfPages, renderPageNumber]
