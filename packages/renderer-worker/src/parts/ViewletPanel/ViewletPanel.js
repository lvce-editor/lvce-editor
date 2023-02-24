import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import * as ViewletManager from '../ViewletManager/ViewletManager.js'
import * as ViewletModule from '../ViewletModule/ViewletModule.js'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'
import * as ViewletActions from '../ViewletActions/ViewletActions.js'

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
  }
}

const getSavedViewletId = (savedState) => {
  if (savedState && savedState.currentViewletId) {
    return savedState.currentViewletId
  }
  return ViewletModuleId.Problems
}

export const loadContent = (state, savedState) => {
  const savedViewletId = getSavedViewletId(savedState)
  const views = [ViewletModuleId.Problems, ViewletModuleId.Output, ViewletModuleId.DebugConsole, ViewletModuleId.Terminal]
  const selectedIndex = views.indexOf(savedViewletId)
  return {
    ...state,
    views,
    currentViewletId: savedViewletId,
    selectedIndex,
  }
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
    parentId: ViewletModuleId.Panel,
    height: childDimensions.height,
    append: true,
  })
  if (commands) {
    commands.unshift(['Viewlet.dispose', currentViewletId])
    const actions = ViewletActions.getActions(id)
    commands.push(['Viewlet.send', ViewletModuleId.Panel, 'setActions', actions])
    await RendererProcess.invoke('Viewlet.sendMultiple', commands)
    if (commands[commands.length - 1].includes(ViewletModuleId.Error)) {
      state.currentViewletId = ViewletModuleId.Error
    }
  }
  return { ...state }
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
    return [/* method */ 'setTabs', /* tabs */ newState.views]
  },
}

const renderSelectedIndex = {
  isEqual(oldState, newState) {
    return oldState.selectedIndex === newState.selectedIndex
  },
  apply(oldState, newState) {
    return [/* method */ 'setSelectedIndex', /* unFocusIndex */ oldState.selectedIndex, /* focusIndex */ newState.selectedIndex]
  },
}

export const render = [renderTabs, renderSelectedIndex]

export const hasFunctionalResize = true

export const resize = (state, dimensions) => {
  return state
}
