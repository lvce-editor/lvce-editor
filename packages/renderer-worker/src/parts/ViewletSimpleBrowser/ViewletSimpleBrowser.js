// based on vscode's simple browser by Microsoft (https://github.com/microsoft/vscode/blob/e8fe2d07d31f30698b9262dd5e1fcc59a85c6bb1/extensions/simple-browser/src/extension.ts, License MIT)

import * as Assert from '../Assert/Assert.js'
import * as ElectronBrowserView from '../ElectronBrowserView/ElectronBrowserView.js'
import * as ElectronBrowserViewFunctions from '../ElectronBrowserViewFunctions/ElectronBrowserViewFunctions.js'
import * as IframeSrc from '../IframeSrc/IframeSrc.js'
import * as KeyBindings from '../KeyBindings/KeyBindings.js'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'

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
    browserViewId: 0,
    canGoForward: true,
    canGoBack: true,
    isLoading: false,
  }
}

const isFallThroughKeyBinding = (keyBinding) => {
  return !keyBinding.when
}

const getFallThroughKeyBindings = (keyBindings) => {
  return keyBindings.filter(isFallThroughKeyBinding)
}

export const saveState = (state) => {
  const { iframeSrc } = state
  return {
    iframeSrc,
  }
}

const getUrlFromSavedState = (savedState) => {
  if (savedState && savedState.iframeSrc) {
    return savedState.iframeSrc
  }
  return 'https://example.com'
}

export const backgroundLoadContent = async (state, savedState) => {
  // TODO duplicate code with loadContent
  const { top, left, width, height, headerHeight } = state
  const iframeSrc = getUrlFromSavedState(savedState)
  // TODO since browser view is not visible at this point
  // it is not necessary to load keybindings for it
  const keyBindings = await KeyBindings.getKeyBindings()
  const fallThroughKeyBindings = getFallThroughKeyBindings(keyBindings)
  const browserViewId = await ElectronBrowserView.createBrowserView(0)
  await ElectronBrowserViewFunctions.setFallthroughKeyBindings(
    fallThroughKeyBindings
  )
  Assert.number(browserViewId)
  await ElectronBrowserViewFunctions.resizeBrowserView(
    browserViewId,
    top + headerHeight,
    left,
    width,
    height - headerHeight
  )
  const { newTitle } = await ElectronBrowserViewFunctions.setIframeSrc(
    browserViewId,
    iframeSrc
  )
  return {
    title: newTitle,
    uri: `simple-browser://${browserViewId}`,
    iframeSrc,
  }
}

const getId = (idPart) => {
  if (!idPart) {
    return 0
  }
  return parseInt(idPart)
}

export const loadContent = async (state, savedState) => {
  const { top, left, width, height, headerHeight, uri } = state
  const idPart = uri.slice('simple-browser://'.length)
  const id = getId(idPart)
  const iframeSrc = getUrlFromSavedState(savedState)
  // TODO load keybindings in parallel with creating browserview
  const keyBindings = await KeyBindings.getKeyBindings()
  if (id) {
    const actualId = await ElectronBrowserView.createBrowserView(id)
    await ElectronBrowserViewFunctions.setFallthroughKeyBindings(keyBindings)
    await ElectronBrowserViewFunctions.resizeBrowserView(
      actualId,
      top + headerHeight,
      left,
      width,
      height - headerHeight
    )
    if (id !== actualId) {
      await ElectronBrowserViewFunctions.setIframeSrc(actualId, iframeSrc)
    }
    return {
      ...state,
      iframeSrc,
      title: 'Simple Browser',
      browserViewId: actualId,
    }
  }

  const fallThroughKeyBindings = getFallThroughKeyBindings(keyBindings)
  const browserViewId = await ElectronBrowserView.createBrowserView(
    /* restoreId */ 0
  )
  await ElectronBrowserViewFunctions.setFallthroughKeyBindings(
    fallThroughKeyBindings
  )
  await ElectronBrowserViewFunctions.resizeBrowserView(
    browserViewId,
    top + headerHeight,
    left,
    width,
    height - headerHeight
  )
  Assert.number(browserViewId)
  await ElectronBrowserViewFunctions.setIframeSrc(browserViewId, iframeSrc)
  const { title, canGoBack, canGoForward } =
    await ElectronBrowserViewFunctions.getStats(browserViewId)
  return {
    ...state,
    iframeSrc,
    title,
    browserViewId,
    canGoBack,
    canGoForward,
    uri: `simple-browser://${browserViewId}`,
  }
}

export const show = async (state) => {
  const { browserViewId } = state
  await ElectronBrowserViewFunctions.show(browserViewId)
}

export const hide = async (state) => {
  const { browserViewId } = state
  await ElectronBrowserViewFunctions.hide(browserViewId)
}

export const handleInput = (state, value) => {
  // TODO maybe show autocomplete for urls like browsers do
  return {
    ...state,
    inputValue: value,
  }
}

export const go = (state) => {
  const { inputValue, browserViewId } = state
  const iframeSrc = IframeSrc.toIframeSrc(inputValue)
  // TODO await promises
  void ElectronBrowserViewFunctions.setIframeSrc(browserViewId, iframeSrc)
  void ElectronBrowserViewFunctions.focus(browserViewId)
  return {
    ...state,
    iframeSrc,
    isLoading: true,
  }
}

export const hasFunctionalRender = true

export const handleWillNavigate = (state, url, canGoBack, canGoForward) => {
  return {
    ...state,
    iframeSrc: url,
    canGoBack,
    canGoForward,
    isLoading: true,
  }
}

export const handleDidNavigate = (state, url, canGoBack, canGoForward) => {
  return {
    ...state,
    iframeSrc: url,
    canGoBack,
    canGoForward,
    isLoading: false,
  }
}

export const handleDidNavigationCancel = (state, url) => {
  return {
    ...state,
    isLoading: false,
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
  return {
    ...state,
    ...dimensions,
  }
}

export const resizeEffect = async (state) => {
  const { headerHeight, browserViewId, top, left, width, height } = state
  await ElectronBrowserViewFunctions.resizeBrowserView(
    browserViewId,
    top + headerHeight,
    left,
    width,
    height - headerHeight
  )
}

export const dispose = async (state) => {
  const { browserViewId } = state
  await ElectronBrowserView.disposeBrowserView(browserViewId)
}

const renderIframeSrc = {
  isEqual(oldState, newState) {
    return oldState.iframeSrc === newState.iframeSrc
  },
  apply(oldState, newState) {
    return ['setIframeSrc', newState.iframeSrc]
  },
}

// TODO this component shouldn't depend on Main
const renderTitle = {
  isEqual(oldState, newState) {
    return oldState.title === newState.title
  },
  apply(oldState, newState) {
    return [
      'Viewlet.send',
      ViewletModuleId.Main,
      'updateTab',
      0,
      newState.title,
    ]
  },
}

const renderButtonsEnabled = {
  isEqual(oldState, newState) {
    return (
      oldState.canGoBack === newState.canGoBack &&
      oldState.canGoForward === newState.canGoForward
    )
  },
  apply(oldState, newState) {
    return [
      /* method */ 'setButtonsEnabled',
      /* canGoBack */ newState.canGoBack,
      /* canGoFoward */ newState.canGoForward,
    ]
  },
}

const renderLoading = {
  isEqual(oldState, newState) {
    return oldState.isLoading === newState.isLoading
  },
  apply(oldState, newState) {
    return [/* method */ 'setLoading', /* isLoading */ newState.isLoading]
  },
}

export const render = [
  renderIframeSrc,
  renderTitle,
  renderButtonsEnabled,
  renderLoading,
]
