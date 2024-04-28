import * as EmbedsWorker from '../EmbedsWorker/EmbedsWorker.js'

const state = {
  refs: 0,
}

export const createWebContentsView = async (restoreId, fallThroughKeyBindings) => {
  state.refs++
  return EmbedsWorker.invoke('ElectronWebContentsView.createWebContentsView', restoreId, fallThroughKeyBindings)
}

export const disposeWebContentsView = async (id) => {
  await EmbedsWorker.invoke('ElectronWebContentsView.disposeWebContentsView', id)
  state.refs--
  if (state.refs === 0) {
    await EmbedsWorker.dispose()
  }
}
