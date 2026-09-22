import * as EmbedsWorker from '../EmbedsWorker/EmbedsWorker.js'
import * as GetWindowId from '../GetWindowId/GetWindowId.js'

const state = {
  refs: 0,
}

export const adoptWebContentsView = () => {
  state.refs++
}

export const createWebContentsView = async (restoreId, fallThroughKeyBindings) => {
  const windowId = await GetWindowId.getWindowId()
  state.refs++
  return EmbedsWorker.invoke('ElectronWebContentsView.createWebContentsView', restoreId, fallThroughKeyBindings, windowId)
}

export const disposeWebContentsView = async (id) => {
  await EmbedsWorker.invoke('ElectronWebContentsView.disposeWebContentsView', id)
  state.refs--
  if (state.refs === 0) {
    await EmbedsWorker.dispose()
  }
}

export const releaseWebContentsView = async () => {
  state.refs--
  if (state.refs === 0) {
    await EmbedsWorker.dispose()
  }
}
