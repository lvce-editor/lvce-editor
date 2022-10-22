// based on vscode's simple browser by Microsoft (https://github.com/microsoft/vscode/blob/e8fe2d07d31f30698b9262dd5e1fcc59a85c6bb1/extensions/simple-browser/src/extension.ts, License MIT)

import * as ElectronBrowserView from '../ElectronBrowserView/ElectronBrowserView.js'
import * as ElectronBrowserViewFunctions from '../ElectronBrowserViewFunctions/ElectronBrowserViewFunctions.js'
import * as KeyBindings from '../KeyBindings/KeyBindings.js'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'
import * as IframeSrc from '../IframeSrc/IframeSrc.js'

export const name = ViewletModuleId.SimpleBrowser

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
    title: '',
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
  await ElectronBrowserViewFunctions.setIframeSrc(iframeSrc)
  return {
    ...state,
    iframeSrc,
    title: 'Simple Browser',
  }
}

export const handleInput = (state, value) => {
  // TODO maybe show autocomplete for urls like browsers do
  return {
    ...state,
    inputValue: value,
  }
}

export const go = async (state) => {
  const { inputValue } = state
  const iframeSrc = IframeSrc.toIframeSrc(inputValue)
  await ElectronBrowserViewFunctions.setIframeSrc(iframeSrc)
  await ElectronBrowserViewFunctions.focus()
  return {
    ...state,
    iframeSrc,
  }
}

export const hasFunctionalRender = true

export const openDevtools = async (state) => {
  await ElectronBrowserViewFunctions.openDevtools()
  return state
}

export const reload = async (state) => {
  await ElectronBrowserViewFunctions.reload()
  return state
}

export const forward = async (state) => {
  await ElectronBrowserViewFunctions.forward()
  return state
}

export const backward = async (state) => {
  await ElectronBrowserViewFunctions.backward()
  return state
}

export const handleWillNavigate = (state, url) => {
  return {
    ...state,
    iframeSrc: url,
  }
}

export const handleTitleUpdated = (state, title) => {
  return {
    ...state,
    title,
  }
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

const renderIframeSrc = {
  isEqual(oldState, newState) {
    return oldState.iframeSrc === newState.iframeSrc
  },
  apply(oldState, newState) {
    return ['Viewlet.send', 'SimpleBrowser', 'setIframeSrc', newState.iframeSrc]
  },
}

const renderTitle = {
  isEqual(oldState, newState) {
    return oldState.title === newState.title
  },
  apply(oldState, newState) {
    console.log({ title: newState.title })
    return ['Viewlet.send', 'Main', 'updateTab', 0, newState.title]
  },
}

export const render = [renderIframeSrc, renderTitle]
