import * as EmbedsWorker from '../EmbedsWorker/EmbedsWorker.js'

export const createWebContentsView = async (restoreId, fallThroughKeyBindings) => {
  return EmbedsWorker.invoke('ElectronWebContentsView.createWebContentsView', restoreId, fallThroughKeyBindings)
}

export const disposeWebContentsView = async (id) => {
  return EmbedsWorker.invoke('ElectronWebContentsView.disposeWebContentsView', id)
}
