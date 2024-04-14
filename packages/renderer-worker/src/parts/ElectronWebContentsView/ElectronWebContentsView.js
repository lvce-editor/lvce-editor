import * as EmbedsWorker from '../EmbedsWorker/EmbedsWorker.js'

export const createWebContentsView = async (restoreId, fallThroughKeyBindings) => {
  await EmbedsWorker.getOrCreate()
  return EmbedsWorker.invoke('ElectronWebContentsView.createWebContentsView', restoreId, fallThroughKeyBindings)
}

export const disposeWebContentsView = async (id) => {
  await EmbedsWorker.getOrCreate()
  return EmbedsWorker.invoke('ElectronWebContentsView.disposeWebContentsView', id)
}
