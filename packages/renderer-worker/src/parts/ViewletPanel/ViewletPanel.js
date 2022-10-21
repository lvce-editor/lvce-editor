import * as Command from '../Command/Command.js'
import * as ViewletManager from '../ViewletManager/ViewletManager.js'
import * as ViewletModule from '../ViewletModule/ViewletModule.js'

export const name = 'Panel'

export const create = () => {
  return {
    currentId: '',
    currentViewlet: undefined,
    views: [],
    disposed: false,
    focusedIndex: -1,
    selectedIndex: -1,
  }
}

export const loadContent = async (state) => {
  const cachedViewlet = await getCachedViewlet()
  return {
    ...state,
    views: ['Problems', 'Output', 'Debug Console', 'Terminal'],
    currentViewlet: cachedViewlet,
    selectedIndex: 0,
  }
}

export const dispose = (state) => {
  return {
    ...state,
    disposed: true,
  }
}

const getCachedViewlet = async () => {
  const cachedViewlet = await Command.execute(
    /* LocalStorage.getJson */ 'LocalStorage.getJson',
    /* key */ 'panelViewlet'
  )
  return cachedViewlet
}

// TODO this function is a bit messy
export const openViewlet = async (state, id) => {
  if (!id) {
    return
  }
  // TODO pending state
  if (state.currentId === id) {
    return
  }
  // TODO current viewlet should be disposed if it exists
  state.currentId = id
  const child = ViewletManager.create(
    ViewletModule.load,
    id,
    'Panel',
    '',
    0,
    0,
    0,
    0
  )
  await ViewletManager.load(child)
}

export const selectIndex = async (state, index) => {
  await openViewlet(state, state.views[index])
  return {
    ...state,
    selectedIndex: index,
  }
}

export const hasFunctionalRender = true

const renderTabs = {
  isEqual(oldState, newState) {
    return oldState.views === newState.views
  },
  apply(oldState, newState) {
    return [
      /* Viewlet.send */ 'Viewlet.send',
      /* id */ 'Panel',
      /* method */ 'setTabs',
      /* tabs */ newState.views,
    ]
  },
}

const renderSelectedIndex = {
  isEqual(oldState, newState) {
    return oldState.selectedIndex === newState.selectedIndex
  },
  apply(oldState, newState) {
    return [
      /* Viewlet.send */ 'Viewlet.send',
      /* id */ 'Panel',
      /* method */ 'setSelectedIndex',
      /* unFocusIndex */ oldState.selectedIndex,
      /* focusIndex */ newState.selectedIndex,
    ]
  },
}

export const render = [renderTabs, renderSelectedIndex]

export const hasFunctionalResize = true

export const resize = (state, dimensions) => {
  return state
}
