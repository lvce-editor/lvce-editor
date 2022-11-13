import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import * as ViewletManager from '../ViewletManager/ViewletManager.js'
import * as ViewletModule from '../ViewletModule/ViewletModule.js'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'
import * as ViewletStates from '../ViewletStates/ViewletStates.js'

export const create = () => {
  return {
    currentViewletId: '',
    currentViewlet: undefined,
    views: [],
    disposed: false,
    focusedIndex: -1,
    selectedIndex: -1,
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
  const views = [
    ViewletModuleId.Problems,
    ViewletModuleId.Output,
    ViewletModuleId.DebugConsole,
    ViewletModuleId.Terminal,
  ]
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
    left: dimensions.left,
    top: dimensions.top + 35,
    width: dimensions.width,
    height: dimensions.height - 35,
  }
}

// TODO
export const getChildren = (state) => {
  const { top, left, width, height, titleAreaHeight, currentViewletId } = state
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
  console.log({ id })
  const childDimensions = getContentDimensions(state)
  const commands = await ViewletManager.load({
    getModule: ViewletModule.load,
    id,
    type: 0,
    // @ts-ignore
    uri: '',
    show: false,
    focus: false,
    setBounds: false,
    top: childDimensions.top,
    left: childDimensions.left,
    width: childDimensions.width,
    height: childDimensions.height,
  })
  if (commands) {
    commands.unshift(['Viewlet.dispose', currentViewletId])
    commands.push(['Viewlet.append', ViewletModuleId.Panel, id])
    await RendererProcess.invoke('Viewlet.sendMultiple', commands)
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
