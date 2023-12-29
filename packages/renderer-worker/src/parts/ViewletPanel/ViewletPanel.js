import * as Assert from '../Assert/Assert.js'
import * as Command from '../Command/Command.js'
import * as GetPanelViews from '../GetPanelViews/GetPanelViews.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import * as Viewlet from '../Viewlet/Viewlet.js'
import * as ViewletActions from '../ViewletActions/ViewletActions.js'
import * as ViewletManager from '../ViewletManager/ViewletManager.js'
import * as ViewletModule from '../ViewletModule/ViewletModule.js'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'
import * as GetActionsVirtualDom from '../GetActionsVirtualDom/GetActionsVirtualDom.js'
import * as ViewletStates from '../ViewletStates/ViewletStates.js'

export const create = (id, uri, x, y, width, height) => {
  return {
    currentViewletId: '',
    currentViewlet: undefined,
    views: [],
    disposed: false,
    focusedIndex: -1,
    selectedIndex: -1,
    x,
    y,
    width,
    height,
    actions: [],
  }
}

export const saveState = (state) => {
  const { currentViewletId } = state
  return {
    currentViewletId,
  }
}

const getSavedViewletId = (savedState) => {
  if (savedState && savedState.currentViewletId) {
    return savedState.currentViewletId
  }
  return ViewletModuleId.Problems
}

const getSelectedIndex = (views, savedViewletId) => {
  const index = views.indexOf(savedViewletId)
  if (index === -1) {
    return 0
  }
  return index
}

export const loadContent = (state, savedState) => {
  const savedViewletId = getSavedViewletId(savedState)
  const views = GetPanelViews.getPanelViews()
  const selectedIndex = getSelectedIndex(views, savedViewletId)
  return {
    ...state,
    views,
    currentViewletId: savedViewletId,
    selectedIndex,
  }
}

export const contentLoaded = (state) => {
  const { currentViewletId, uid } = state
  const commands = []
  const actions = ViewletActions.getActions(currentViewletId)
  state.actions = actions
  const dom = GetActionsVirtualDom.getActionsVirtualDom(actions)
  commands.push(['Viewlet.send', uid, 'setActionsDom', dom])
  return commands
}

const getContentDimensions = (dimensions) => {
  return {
    x: dimensions.x,
    y: dimensions.y + 35,
    width: dimensions.width,
    height: dimensions.height - 35,
  }
}

// TODO
export const getChildren = (state) => {
  const { y, x, width, height, titleAreaHeight, currentViewletId } = state
  return [
    {
      id: currentViewletId,
      ...getContentDimensions(state),
    },
  ]
}

export const dispose = (state) => {
  return {
    ...state,
    disposed: true,
  }
}

// TODO this function is a bit messy
// TODO no default parameter -> monomorphism
export const openViewlet = async (state, id, focus = false) => {
  console.assert(typeof id === 'string')
  const { currentViewletId } = state
  state.currentViewletId = id
  const childDimensions = getContentDimensions(state)
  // TODO load actions
  const commands = await ViewletManager.load({
    getModule: ViewletModule.load,
    id,
    type: 0,
    // @ts-ignore
    uri: '',
    show: false,
    focus: false,
    setBounds: false,
    x: childDimensions.x,
    y: childDimensions.y,
    width: childDimensions.width,
    parentUid: state.uid,
    height: childDimensions.height,
    append: true,
  })
  const uid = state.uid
  if (commands) {
    const currentViewletState = ViewletStates.getState(currentViewletId)
    const currentViewletUid = currentViewletState.uid
    Assert.number(currentViewletUid)
    commands.unshift(...Viewlet.disposeFunctional(currentViewletUid))
    const actions = ViewletActions.getActions(id)
    const dom = GetActionsVirtualDom.getActionsVirtualDom(actions)
    commands.push(['Viewlet.send', uid, 'setActionsDom', dom])
    await RendererProcess.invoke('Viewlet.sendMultiple', commands)
    if (commands.at(-1).includes(ViewletModuleId.Error)) {
      state.currentViewletId = ViewletModuleId.Error
    }
  }
  return { ...state }
}

export const hidePanel = async (state) => {
  await Command.execute('Layout.hidePanel')
  return state
}

export const selectIndex = async (state, index) => {
  await openViewlet(state, state.views[index])
  return {
    ...state,
    selectedIndex: index,
  }
}

export * from '../HandleClickAction/HandleClickAction.js'
