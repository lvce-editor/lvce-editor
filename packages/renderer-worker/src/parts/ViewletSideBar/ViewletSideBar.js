import * as Command from '../Command/Command.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import * as Viewlet from '../Viewlet/Viewlet.js'
import * as ViewletManager from '../ViewletManager/ViewletManager.js'
import * as ViewletModule from '../ViewletModule/ViewletModule.js'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'
import * as ViewletStates from '../ViewletStates/ViewletStates.js'

export const create = (id, uri, left, top, width, height) => {
  return {
    currentViewletId: '',
    left,
    top,
    width,
    height,
    titleAreaHeight: 35,
    children: [],
  }
}

const getSavedViewletId = (savedState) => {
  if (savedState && savedState.currentViewletId) {
    return savedState.currentViewletId
  }
  return ViewletModuleId.Explorer
}

export const loadContent = (state, savedState) => {
  const savedViewletId = getSavedViewletId(savedState)
  const children = [
    {
      id: ViewletModuleId.SideBarHeader,
    },
  ]
  if (savedViewletId) {
    children.push({
      id: savedViewletId,
    })
  }
  return {
    ...state,
    children,
    currentViewletId: savedViewletId,
  }
}

// export const loadContentEffects = () => {
//   LifeCycle.once(LifeCycle.PHASE_TWELVE, hydrateLazy)
//   GlobalEventBus.addListener('Layout.hideSideBar', handleSideBarClose)
// }

/**
 *
 * @param {*} dimensions
 * @param {number} titleAreaHeight
 * @returns
 */
const getContentDimensions = (dimensions, titleAreaHeight) => {
  return {
    left: dimensions.left,
    top: dimensions.top + titleAreaHeight,
    width: dimensions.width,
    height: dimensions.height - titleAreaHeight,
  }
}

// TODO
// export const getChildren = (state) => {
//   const { top, left, width, height, titleAreaHeight, currentViewletId } = state
//   return [
//     {
//       id: currentViewletId,
//       ...getContentDimensions(state, titleAreaHeight),
//     },
//   ]
// }

// TODO no default parameter -> monomorphism
export const openViewlet = async (state, id, focus = false) => {
  console.assert(typeof id === 'string')
  // if (state.currentViewletId) {
  //   console.log('dispose current viewlet', state.currentViewletId)
  //   Viewlet.dispose(state.currentViewletId)
  // }
  const { currentViewletId, titleAreaHeight } = state
  state.currentViewletId = id

  const childDimensions = getContentDimensions(state, titleAreaHeight)

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
    commands.push(['Viewlet.append', ViewletModuleId.SideBar, id])
    const activityBar = ViewletStates.getInstance(ViewletModuleId.ActivityBar)
    if (activityBar) {
      const oldState = activityBar.state
      const newState = activityBar.factory.handleSideBarViewletChange(
        oldState,
        id
      )
      const extraCommands = ViewletManager.render(
        activityBar.factory,
        oldState,
        newState
      )
      activityBar.state = newState
      commands.push(...extraCommands)
    }
    await RendererProcess.invoke('Viewlet.sendMultiple', commands)
  }

  // // TODO race condition (check if disposed after created)
  // const viewlet = ViewletManager.create(
  //   ViewletModule.load,
  //   id,
  //   'SideBar',
  //   'builtin://',
  //   childDimensions.left,
  //   childDimensions.top,
  //   childDimensions.width,
  //   childDimensions.height
  // )

  // // TODO add keybinding to title
  // // @ts-ignore
  // await ViewletManager.load(viewlet, focus, /* restore */ true)
  return { ...state }
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
  const { titleAreaHeight } = state
  const childDimensions = getContentDimensions(dimensions, titleAreaHeight)
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
  return state
  // console.log({ currentViewletId })
}

export const hasFunctionalRender = true

export const render = []
