import * as Assert from '../Assert/Assert.ts'
import * as Character from '../Character/Character.js'
import * as Command from '../Command/Command.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import * as SaveState from '../SaveState/SaveState.js'
import * as Viewlet from '../Viewlet/Viewlet.js'
import * as ViewletManager from '../ViewletManager/ViewletManager.js'
import * as ViewletModule from '../ViewletModule/ViewletModule.js'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'
import * as ViewletStates from '../ViewletStates/ViewletStates.js'

export const create = (id, uri, x, y, width, height) => {
  return {
    uid: id,
    currentViewletId: '',
    x,
    y,
    width,
    height,
    titleAreaHeight: 35,
    actions: [],
    title: Character.EmptyString,
  }
}

export const saveState = (state) => {
  const { currentViewletId } = state
  return {
    currentViewletId,
  }
}

export const saveChildState = (state) => {
  const { currentViewletId } = state
  return [currentViewletId]
}

const getSavedViewletId = (savedState) => {
  if (savedState && savedState.currentViewletId) {
    return savedState.currentViewletId
  }
  return ViewletModuleId.Explorer
}

export const loadContent = (state, savedState) => {
  const savedViewletId = getSavedViewletId(savedState)
  return {
    ...state,
    currentViewletId: savedViewletId,
  }
}

export const contentLoaded = async (state, savedState) => {
  const commands = []
  return commands
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
    x: dimensions.x,
    y: dimensions.y + titleAreaHeight,
    width: dimensions.width,
    height: dimensions.height - titleAreaHeight,
  }
}

// TODO
export const getChildren = (state) => {
  const { titleAreaHeight, currentViewletId } = state
  return [
    {
      id: currentViewletId,
      ...getContentDimensions(state, titleAreaHeight),
      setBounds: false,
    },
  ]
}

// TODO no default parameter -> monomorphism
export const openViewlet = async (state, moduleId, focus = false, args) => {
  console.assert(typeof moduleId === 'string')
  // if (state.currentViewletId) {
  //   console.log('dispose current viewlet', state.currentViewletId)
  //   Viewlet.dispose(state.currentViewletId)
  // }
  const { currentViewletId, titleAreaHeight } = state
  const savePromise = SaveState.saveViewletState(currentViewletId)
  state.currentViewletId = moduleId

  const childDimensions = getContentDimensions(state, titleAreaHeight)
  const uid = state.uid

  const commands = await ViewletManager.load(
    {
      getModule: ViewletModule.load,
      id: moduleId,
      type: 0,
      // @ts-ignore
      uri: '',
      show: false,
      focus: false,
      setBounds: false,
      x: childDimensions.x,
      y: childDimensions.y,
      width: childDimensions.width,
      height: childDimensions.height,
      parentUid: uid,
      append: true,
      args,
    },
    false,
    true,
  )
  if (commands) {
    const currentViewletState = ViewletStates.getState(currentViewletId)
    const currentViewletUid = currentViewletState.uid
    Assert.number(currentViewletUid)
    commands.unshift(...Viewlet.disposeFunctional(currentViewletUid))
    const activityBar = ViewletStates.getInstance(ViewletModuleId.ActivityBar)
    if (activityBar) {
      const oldState = activityBar.state
      const newState = await activityBar.factory.Commands.handleSideBarViewletChange(oldState, moduleId)
      const extraCommands = ViewletManager.render(activityBar.factory, oldState, newState, newState.uid)
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
  await savePromise
  return { ...state }
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

export const resize = async (state, dimensions) => {
  const { titleAreaHeight } = state
  const childDimensions = getContentDimensions(dimensions, titleAreaHeight)
  const currentViewletInstance = ViewletStates.getInstance(state.currentViewletId)
  const newState = {
    ...state,
    ...dimensions,
  }
  if (!currentViewletInstance) {
    return {
      newState,
      commands: [],
    }
  }
  const currentViewletUid = currentViewletInstance.state.uid
  const commands = await Viewlet.resize(currentViewletUid, childDimensions)
  return {
    newState,
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
}

export * from '../HandleClickAction/HandleClickAction.js'
