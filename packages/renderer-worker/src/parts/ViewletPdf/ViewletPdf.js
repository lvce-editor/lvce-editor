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
  }
}

export const loadContent = async (state) => {
  const { uri } = state
  const content = await FileSystem.readFile(uri)
  const ipc = await PdfWorker.create()
  const canvas = await OffscreenCanvas.create()
  return {
    ...state,
    content,
    ipc,
    canvas,
  }
}

export const render = []
