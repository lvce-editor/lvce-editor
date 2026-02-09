import * as AdjustCommands from '../AdjustCommands/AdjustCommands.js'
import * as PreviewWorker from '../PreviewWorker/PreviewWorker.js'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'
import * as ViewletStates from '../ViewletStates/ViewletStates.js'
import * as WrapPreviewCommand from '../WrapPreviewCommand/WrapPreviewCommand.ts'

export const create = (id, uri, x, y, width, height) => {
  return {
    uid: id,
    uri,
    x,
    y,
    width,
    height,
    count: 0,
    disposed: false,
    commands: [],
  }
}

export const loadContent = async (state) => {
  const layoutState = ViewletStates.getState(ViewletModuleId.Layout)
  const uri = layoutState.previewUri || state.uri
  const savedState = {}
  await PreviewWorker.invoke('Preview.create', state.uid, uri, state.x, state.y, state.width, state.height)
  await PreviewWorker.invoke('Preview.loadContent', state.uid, savedState)
  const diffResult = await PreviewWorker.invoke('Preview.diff2', state.uid)
  const commands = await PreviewWorker.invoke('Preview.render2', state.uid, diffResult)
  return {
    ...state,
    uri,
    commands,
  }
}

export const increment = (state) => {
  return {
    ...state,
    count: state.count + 1,
  }
}

export const decrement = (state) => {
  return {
    ...state,
    count: state.count - 1,
  }
}

export const renderEventListeners = () => PreviewWorker.invoke('Preview.renderEventListeners')

export const dispose = (state) => {
  return {
    ...state,
    disposed: true,
  }
}

export const hotReload = async (state) => {
  if (state.isHotReloading) {
    return state
  }
  // TODO avoid mutation
  state.isHotReloading = true
  // possible TODO race condition during hot reload
  // there could still be pending promises when the worker is disposed
  const savedState = await PreviewWorker.invoke('Preview.saveState', state.uid)
  await PreviewWorker.restart('Preview.terminate')
  await PreviewWorker.invoke('Preview.create', state.uid, state.uri, state.x, state.y, state.width, state.height, null)
  await PreviewWorker.invoke('Preview.loadContent', state.uid, savedState)
  const diffResult = await PreviewWorker.invoke('Preview.diff2', state.uid)
  const commands = await PreviewWorker.invoke('Preview.render2', state.uid, diffResult)
  state.isHotReloading = false
  return {
    ...state,
    commands,
  }
}

export const Commands = {}

export const getCommands = async () => {
  const commands = await PreviewWorker.invoke('Preview.getCommandIds')
  for (const command of commands) {
    Commands[command] = WrapPreviewCommand.wrapPreviewCommand(command)
  }
  Commands['hotReload'] = hotReload

  return Commands
}

export const hasFunctionalRender = true
export const hasFunctionalRootRender = true
export const hasFunctionalResize = true
export const hasFunctionalEvents = true

const renderItems = {
  isEqual(oldState, newState) {
    return JSON.stringify(oldState.commands) === JSON.stringify(newState.commands)
  },
  apply: AdjustCommands.apply,
  multiple: true,
}

export const render = [renderItems]

export const Css = ['/css/parts/Preview.css']
