import * as Command from '../Command/Command.js'
import * as GlobalEventBus from '../GlobalEventBus/GlobalEventBus.js'
import * as Layout from '../Layout/Layout.js'
import * as LifeCycle from '../LifeCycle/LifeCycle.js'
import * as ViewletManager from '../ViewletManager/ViewletManager.js'
import * as Assert from '../Assert/Assert.js'
import * as Viewlet from '../Viewlet/Viewlet.js'
import * as ViewletStates from '../ViewletStates/ViewletStates.js'
import * as ViewletModule from '../ViewletModule/ViewletModule.js'
import * as LocalStorage from '../LocalStorage/LocalStorage.js'

export const create = (id, uri, left, top, width, height) => {
  return {
    currentViewletId: '',
    left,
    top,
    width,
    height,
  }
}

const getSavedViewletId = (savedState) => {
  if (savedState && savedState.currentViewletId) {
    return savedState.currentViewletId
  }
  return 'Explorer'
}

export const loadContent = async (state, savedState) => {
  const savedViewletId = getSavedViewletId(savedState)
  return {
    ...state,
    currentViewletId: savedViewletId,
  }
}

export const loadContentEffects = () => {
  LifeCycle.once(LifeCycle.PHASE_TWELVE, hydrateLazy)
  GlobalEventBus.addListener('Layout.hideSideBar', handleSideBarClose)
}

// TODO
export const loadChildren = () => {
  return [
    {
      id: 'Explorer',
    },
  ]
}

export const contentLoaded = async (state) => {
  if (state.currentViewletId) {
    await openViewlet(state, state.currentViewletId)
  }
}

const getSideBarViewlet = async () => {
  const cachedViewlet = await Command.execute(
    /* LocalStorage.getJson */ 'LocalStorage.getJson',
    /* key */ 'sideBarPanel'
  )
  if (cachedViewlet) {
    return cachedViewlet
  }

  // TODO what if explorer has been deactivated
  // probably need to check activity bar items
  // but activity bar already has a dependency on sidebar
  return 'Explorer'
}

const hydrateLazy = () => () => {
  // TODO update file icons in explorer
}

const SIDE_BAR_TITLE_AREA_HEIGHT = 35

// TODO add test for this
export const showOrHideViewlet = async (state, viewletId) => {
  Assert.object(state)
  Assert.string(viewletId)
  if (Layout.isSideBarVisible()) {
    // TODO don't depend on sidebar directly
    if (state.currentViewletId === viewletId) {
      await Layout.hideSideBar()
    } else {
      state.currentViewletId = viewletId
      await openViewlet(state, viewletId)
    }
  } else {
    console.log('show side bar')
    state.currentViewletId = viewletId
    // TODO race condition: what if sidebar should be hidden again
    // while sidebar is opening?
    await Layout.showSideBar()
  }
}

const getContentDimensions = (dimensions) => {
  return {
    left: dimensions.left,
    top: dimensions.top + SIDE_BAR_TITLE_AREA_HEIGHT,
    width: dimensions.width,
    height: dimensions.height - SIDE_BAR_TITLE_AREA_HEIGHT,
  }
}

// TODO no default parameter -> monomorphism
export const openViewlet = async (state, id, focus = false) => {
  console.assert(typeof id === 'string')
  // if (state.currentViewletId) {
  //   console.log('dispose current viewlet', state.currentViewletId)
  //   Viewlet.dispose(state.currentViewletId)
  // }
  // state.currentViewletId = id
  const childDimensions = getContentDimensions(state)
  // TODO race condition (check if disposed after created)
  const viewlet = ViewletManager.create(
    ViewletModule.load,
    id,
    'SideBar',
    'builtin://',
    childDimensions.left,
    childDimensions.top,
    childDimensions.width,
    childDimensions.height
  )

  // if (state.currentViewletId !== id) {
  //   console.log('return')

  //   return
  // }
  // // TODO activity and sidebar changes should ideally be rendered at the same time
  // // but this works for now
  // RendererProcess.send([
  //   /* Viewlet.appendViewlet */ 3029,
  //   /* parentId */ 'SideBar',
  //   /* childId */ id,
  //   /* focus */ focus,
  // ])
  GlobalEventBus.emitEvent('SideBar.viewletChange', id)
  // await Viewlet.refresh(id)
  // TODO add keybinding to title
  // @ts-ignore
  await ViewletManager.load(viewlet, focus, /* restore */ true)
}

const handleSideBarClose = (state) => {
  state.currentViewletId = ''
}

export const dispose = (state) => {
  // state.currentViewletId = undefined
}

export const openDefaultViewlet = async (state) => {
  await openViewlet(state, 'Explorer')
}

export const close = (state) => {
  if (state.currentViewletId) {
    Viewlet.dispose(state.currentViewletId)
  }
  state.currentViewletId = undefined
  // RendererProcess.send([/* sideBarHide */ 5552, /* id */ id])
}

export const resize = (state, dimensions) => {
  const childDimensions = getContentDimensions(dimensions)
  const commands = Viewlet.resize(state.currentViewletId, childDimensions)
  return {
    newState: {
      ...state,
      ...dimensions,
    },
    commands,
  }
}

export const focus = async (state) => {
  const { currentViewletId } = state
  const currentViewlet = ViewletStates.getInstance(currentViewletId)
  if (!currentViewlet) {
    return state
  }
  await Command.execute(`${currentViewletId}.focus`)
  // if (!currentViewlet.factory.focus) {
  //   throw new Error(`missing focus function for ${currentViewletId}`)
  // }
  // const newState = currentViewlet.factory.focus(currentViewlet.state)
  // const commands = ViewletManager.render(
  //   currentViewlet.factory,
  //   currentViewlet.state,
  //   newState
  // )
  // currentViewlet.state = newState
  // console.log({ commands })
  return state
  // console.log({ currentViewletId })
}
