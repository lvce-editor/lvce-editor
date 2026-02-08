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
import * as Id from '../Id/Id.js'

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
    childUid: -1,
  }
}

// export const saveState = (state) => {
//   const { currentViewletId } = state
//   return {
//     currentViewletId,
//   }
// }

// export const saveChildState = (state) => {
//   const { currentViewletId } = state
//   return [currentViewletId]
// }

// const getSavedViewletId = (savedState) => {
//   if (savedState && savedState.currentViewletId) {
//     return savedState.currentViewletId
//   }
//   return ViewletModuleId.Explorer
// }

export const loadContent = async (state, savedState) => {
  // TODO get it from layout state
  let savedViewletId = await Command.execute('Layout.getActiveSideBarView')
  if (!savedViewletId) {
    savedViewletId = ViewletModuleId.Explorer
  }
  console.log({ savedViewletId })
  // const savedViewletId = getSavedViewletId(savedState)
  return handleSideBarViewletChange(state, savedViewletId)
}

// export const contentLoaded = async (state, savedState) => {
//   const commands = []
//   return commands
// }

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
// export const getChildren = (state) => {
//   const { titleAreaHeight, currentViewletId } = state
//   return [
//     {
//       id: currentViewletId,
//       ...getContentDimensions(state, titleAreaHeight),
//       setBounds: false,
//     },
//   ]
// }

export const handleSideBarViewletChange = async (state, moduleId) => {
  console.assert(typeof moduleId === 'string')
  if (!moduleId) {
    // const currentViewletState = ViewletStates.getState(state.currentViewletId)
    // const currentViewletUid = currentViewletState.uid
    // const commands = []
    // commands.unshift(...Viewlet.disposeFunctional(currentViewletUid))

    // TODO return commands in a functional way
    // await RendererProcess.invoke('Viewlet.sendMultiple', commands)
    return state
  }
  // TODO set it in layout
  const { currentViewletId, titleAreaHeight } = state
  const savePromise = SaveState.saveViewletState(currentViewletId)
  state.currentViewletId = moduleId

  const childDimensions = getContentDimensions(state, titleAreaHeight)
  const uid = state.uid

  const childUid = Id.create()

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
      args: [],
      uid: childUid,
    },
    false,
    true,
  )
  if (commands) {
    // const currentViewletState = ViewletStates.getState(currentViewletId)
    // const currentViewletUid = currentViewletState.uid
    // Assert.number(currentViewletUid)
    // commands.unshift(...Viewlet.disposeFunctional(currentViewletUid))
    // // TODO return commands in a functional way
    // await RendererProcess.invoke('Viewlet.sendMultiple', commands)
  }

  // // TODO race condition (check if disposed after created)

  await savePromise
  return {
    ...state,
    currentViewletId: moduleId,
    childUid,
  }
}

// TODO no default parameter -> monomorphism
export const openViewlet = async (state, moduleId, focus = false, args) => {
  await Command.execute('Layout.openSideBarViewlet', moduleId)

  return state
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

export const handleUpdateStateChange = (state) => {
  return state
}
