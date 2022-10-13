// based on vscode's simple browser by Microsoft (https://github.com/microsoft/vscode/blob/e8fe2d07d31f30698b9262dd5e1fcc59a85c6bb1/extensions/simple-browser/src/extension.ts, License MIT)

import * as ElectronBrowserView from '../ElectronBrowserView/ElectronBrowserView.js'
import * as ElectronBrowserViewFunctions from '../ElectronBrowserViewFunctions/ElectronBrowserViewFunctions.js'
import * as KeyBindings from '../KeyBindings/KeyBindings.js'

export const name = 'SimpleBrowser'

export const create = (id, uri, left, top, width, height) => {
  return {
    id,
    uri,
    top,
    left,
    width,
    height,
    headerHeight: 30,
    iframeSrc: '',
    inputValue: '',
  }
}

const isFallThroughKeyBinding = (keyBinding) => {
  return !keyBinding.when
}

const getFallThroughKeyBindings = (keyBindings) => {
  return keyBindings.filter(isFallThroughKeyBinding)
}

export const loadContent = async (state) => {
  const { top, left, width, height, headerHeight } = state
  const iframeSrc = 'https://example.com'
  const keyBindings = await KeyBindings.getKeyBindings()
  const fallThroughKeyBindings = getFallThroughKeyBindings(keyBindings)
  await ElectronBrowserView.createBrowserView(
    top + headerHeight,
    left,
    width,
    height - headerHeight,
    fallThroughKeyBindings
  )
  return {
    ...state,
    iframeSrc,
  }
}

export const handleInput = (state, value) => {
  // TODO maybe show autocomplete for urls like browsers do
  return {
    ...state,
    inputValue: value,
  }
}

export const go = (state) => {
  const { inputValue } = state
  return {
    ...state,
    iframeSrc: inputValue,
  }
}

export const hasFunctionalRender = true

const renderIframeSrc = {
  isEqual(oldState, newState) {
    return oldState.iframeSrc === newState.iframeSrc
  },
  apply(oldState, newState) {
    ElectronBrowserViewFunctions.setIframeSrc(newState.iframeSrc)
    return ['Viewlet.send', 'SimpleBrowser', 'setIframeSrc', newState.iframeSrc]
  },
}

export const openDevtools = async (state) => {
  await ElectronBrowserViewFunctions.openDevtools()
  return state
}

export const hasFunctionalResize = true

export const resize = (state, dimensions) => {
  const { headerHeight } = state
  const { left, top, width, height } = dimensions
  ElectronBrowserViewFunctions.resizeBrowserView(
    top + headerHeight,
    left,
    width,
    height - headerHeight
  )
  return {
    ...state,
    ...dimensions,
  }
}

export const dispose = async (state) => {
  await ElectronBrowserView.disposeBrowserView()
  console.log('dispose browser view')
}

export const render = [renderIframeSrc]
