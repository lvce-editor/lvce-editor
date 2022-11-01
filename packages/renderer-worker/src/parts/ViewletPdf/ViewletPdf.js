import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'
import * as FileSystem from '../FileSystem/FileSystem.js'
import * as PdfWorker from '../PdfWorker/PdfWorker.js'

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
  }
}

export const loadContent = async (state) => {
  const { uri } = state
  const content = await FileSystem.readFile(uri)
  const ipc = await PdfWorker.create()
  return {
    ...state,
    content,
    ipc,
  }
}

export const render = []
