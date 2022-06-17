import * as Command from '../Command/Command.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import * as Viewlet from './Viewlet.js'
import * as ViewletManager from '../ViewletManager/ViewletManager.js'

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
  }
}

export const contentLoaded = async (state) => {
  await RendererProcess.invoke(
    /* Viewlet.send */ 3024,
    /* id */ 'Panel',
    /* method */ 'setTabs',
    /* tabs */ state.views
  )
  await openViewlet(state, state.currentViewlet)
}

export const dispose = (state) => {
  return {
    ...state,
    disposed: true,
  }
}

const getCachedViewlet = async () => {
  const cachedViewlet = await Command.execute(
    /* LocalStorage.getItem */ 6902,
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

export const tabsHandleClick = async (state, index) => {
  console.log({ index })
  await openViewlet(state, state.views[index])
  const oldSelectedIndex = state.selectedIndex

  state.selectedIndex = index
  RendererProcess.send([
    /* Viewlet.send */ 3024,
    /* id */ 'Panel',
    /* method */ 'selectTab',
    /* oldSelectedIndex */ oldSelectedIndex,
    /* newSelectedIndex */ index,
  ])
}
