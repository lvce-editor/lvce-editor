import * as GetFileWatcherExplorerUnsupportedVirtualDom from '../GetFileWatcherExplorerUnsupportedVirtualDom/GetFileWatcherExplorerUnsupportedVirtualDom.js'

export const hasFunctionalRender = true

export const hasFunctionalRootRender = true

const renderMessage = {
  isEqual(oldState, newState) {
    return oldState.message === newState.message
  },
  apply(oldState, newState) {
    const dom = GetFileWatcherExplorerUnsupportedVirtualDom.getFileWatcherExplorerUnsupportedVirtualDom(newState.message)
    return ['Viewlet.setDom2', dom]
  },
}

export const render = [renderMessage]
