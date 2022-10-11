// based on vscode's simple browser by Microsoft (https://github.com/microsoft/vscode/blob/e8fe2d07d31f30698b9262dd5e1fcc59a85c6bb1/extensions/simple-browser/src/extension.ts, License MIT)

import * as ElectronBrowserView from '../ElectronBrowserView/ElectronBrowserView.js'

export const name = 'SimpleBrowser'

export const create = (id, uri, left, top, width, height) => {
  return {
    id,
    uri,
    top,
    left,
    width,
    height,
  }
}

export const loadContent = async (state) => {
  const { top, left, width, height } = state
  const iframeSrc = 'https://example.com'
  await ElectronBrowserView.createBrowserView(
    iframeSrc,
    top,
    left,
    width,
    height
  )
  return {
    ...state,
    iframeSrc,
  }
}

export const hasFunctionalRender = true

const renderIframeSrc = {
  isEqual(oldState, newState) {
    return oldState.iframeSrc === newState.iframeSrc
  },
  apply(oldState, newState) {
    return ['Viewlet.send', 'SimpleBrowser', 'setIframeSrc', newState.iframeSrc]
  },
}

export const render = [renderIframeSrc]
