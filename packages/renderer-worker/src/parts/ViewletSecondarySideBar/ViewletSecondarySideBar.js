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

export const loadContent = async (state, savedState) => {
  let savedViewletId = await Command.execute('Layout.getActiveSecondarySideBarView')
  if (!savedViewletId) {
    savedViewletId = ViewletModuleId.Chat
  }
  return handleSecondarySideBarViewletChange(state, savedViewletId)
}

const getContentDimensions = (dimensions, titleAreaHeight) => {
  return {
    x: dimensions.x,
    y: dimensions.y + titleAreaHeight,
    width: dimensions.width,
    height: dimensions.height - titleAreaHeight,
  }
}

export const handleSecondarySideBarViewletChange = async (state, moduleId) => {
  console.assert(typeof moduleId === 'string')
  if (!moduleId) {
    return state
  }
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
      append: false,
      args: [],
      uid: childUid,
      shouldRenderEvents: false,
    },
    false,
    true,
  )
  let actionsDom = []
  let actionsUid = -1
  if (commands) {
    const actionsDomIndex = commands.findIndex((command) => command[2] === 'setActionsDom')
    if (actionsDomIndex) {
      actionsDom = commands[actionsDomIndex][3]
      commands.splice(actionsDomIndex, 1)
    }
    const eventsIndex = commands.findIndex((command) => command[0] === 'Viewlet.registerEventListeners')
    const events = commands[eventsIndex][2]
    actionsUid = Id.create()
    commands.push(
      ['Viewlet.createFunctionalRoot', moduleId, actionsUid, true],
      ['Viewlet.registerEventListeners', actionsUid, events],
      ['Viewlet.setDom2', actionsUid, actionsDom],
      ['Viewlet.setUid', actionsUid, childUid],
    )
    await RendererProcess.invoke('Viewlet.sendMultiple', commands)
  }

  await savePromise
  return {
    ...state,
    currentViewletId: moduleId,
    childUid,
    actionsUid,
  }
}

export const openViewlet = async (state, moduleId, focus = false, args) => {
  await Command.execute('Layout.openSecondarySideBarViewlet', moduleId)

  return state
}

export const dispose = (state) => {}

export const openDefaultViewlet = async (state) => {
  await openViewlet(state, ViewletModuleId.Chat)
}

export const close = (state) => {
  if (state.currentViewletId) {
    Viewlet.dispose(state.currentViewletId)
  }
  state.currentViewletId = undefined
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
  return state
}

export * from '../HandleClickAction/HandleClickAction.js'

export const handleUpdateStateChange = (state) => {
  return state
}
