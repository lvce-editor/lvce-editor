import * as Command from '../Command/Command.js'
import * as ViewletManager from '../ViewletManager/ViewletManager.js'
import * as ViewletPanelHeader from '../ViewletPanelHeader/ViewletPanelHeader.js'

export const name = 'Panel'

export const create = () => {
  return {
    currentId: '',
    currentViewlet: undefined,
    views: [],
    disposed: false,
    focusedIndex: -1,
    selectedIndex: -1,
    top: 0,
    left: 0,
    width: 0,
    height: 0,
  }
}

export const loadContent = async (state, top, left, width, height) => {
  console.log({ top, left, width, height })
  const cachedViewlet = await getCachedViewlet()

  return {
    ...state,
    views: ['Problems', 'Output', 'Debug Console', 'Terminal'],
    currentViewlet: cachedViewlet,
    selectedIndex: 0,
    top,
    left,
    width,
    height,
  }
}

export const contentLoaded = async (state) => {
  // await RendererProcess.invoke(
  //   /* Viewlet.send */ 'Viewlet.send',
  //   /* id */ 'Panel',
  //   /* method */ 'setTabs',
  //   /* tabs */ state.views
  // )
  // await openViewlet(state, state.currentViewlet)
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
    ViewletManager.getModule,
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
  console.log({ index })
  await openViewlet(state, state.views[index])
  return ViewletPanelHeader.selectIndex(state, index)
}

export const hasFunctionalRender = true

const renderDimensions = {
  isEqual(oldState, newState) {
    return (
      oldState.width === newState.width &&
      oldState.height === newState.height &&
      oldState.top === newState.top
    )
  },
  apply(oldState, newState) {
    const headerHeight = 35
    const headerWidth = newState.width
    const headerLeft = newState.left
    const headerTop = newState.top
    const contentHeight = newState.height - headerHeight
    const contentWidth = newState.width
    const contentLeft = newState.left
    const contentTop = newState.top + headerHeight
    return [
      /* Viewlet.send */ 'Viewlet.send',
      /* id */ 'Panel',
      /* method */ 'setDimensions',
      /* headerTop */ headerTop,
      /* headerLeft */ headerLeft,
      /* headerWidth */ headerWidth,
      /* headerHeight */ headerHeight,
      /* contentTop */ contentTop,
      /* contentLeft */ contentLeft,
      /* contentWidth */ contentWidth,
      /* contentHeight */ contentHeight,
    ]
  },
}

export const render = [...ViewletPanelHeader.render, renderDimensions]

export const hasFunctionalResize = true

export const resize = (state, dimensions) => {
  return {
    ...state,
    ...dimensions,
  }
}
