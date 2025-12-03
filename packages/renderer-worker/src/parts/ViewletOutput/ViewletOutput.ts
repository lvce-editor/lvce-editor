import * as OutputViewWorker from '../OutputViewWorker/OutputViewWorker.js'
import * as Platform from '../Platform/Platform.js'

export const create = (uid: any, uri, x, y, width, height, args, parentUid) => {
  return {
    id: uid,
    parentUid,
    uid,
    selectedIndex: -1,
    // TODO get list of outputChannels from extension host
    options: [],
    disposed: false,
    text: '',
    platform: Platform.getPlatform(),
  }
}

export const loadContent = async (state, savedState) => {
  await OutputViewWorker.invoke('Output.create', state.id, state.uri, state.x, state.y, state.width, state.height, state.platform, state.parentUid)
  await OutputViewWorker.invoke('Output.loadContent2', state.id, savedState)
  const diffResult = await OutputViewWorker.invoke('Output.diff2', state.id)
  const commands = await OutputViewWorker.invoke('Output.render2', state.id, diffResult)
  const actionsDom = await OutputViewWorker.invoke('Output.renderActions', state.uid)
  return {
    ...state,
    commands,
    actionsDom,
  }
}

export const hotReload = async (state, option) => {
  if (state.isHotReloading) {
    return state
  }
  // TODO avoid mutation
  state.isHotReloading = true
  const savedState = await OutputViewWorker.invoke('Output.saveState', state.uid)
  await OutputViewWorker.restart('Output.terminate')
  const oldState = {
    ...state,
    items: [],
  }
  await OutputViewWorker.invoke('Output.create', state.uid, state.uri, state.x, state.y, state.width, state.height, state.parentUid, state.platform)
  await OutputViewWorker.invoke('Output.loadContent2', state.uid, savedState)
  const diffResult = await OutputViewWorker.invoke('Output.diff2', state.uid)
  const commands = await OutputViewWorker.invoke('Output.render2', state.uid, diffResult)
  const actionsDom = await OutputViewWorker.invoke('Output.renderActions', state.uid)
  return {
    ...oldState,
    commands,
    actionsDom,
    isHotReloading: false,
  }
}

export const hasFunctionalResize = true

export const saveState = (state) => {
  return OutputViewWorker.invoke('Output.saveState', state.uid)
}
