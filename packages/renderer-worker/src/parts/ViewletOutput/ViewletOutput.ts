import * as OutputViewWorker from '../OutputViewWorker/OutputViewWorker.js'

export const create = (uid: any) => {
  return {
    uid,
    selectedIndex: -1,
    // TODO get list of outputChannels from extension host
    options: [],
    disposed: false,
    text: '',
  }
}

export const loadContent = async (state) => {
  await OutputViewWorker.invoke('Output.create', state.id, state.x, state.y, state.width, state.height)
  await OutputViewWorker.invoke('Output.loadContent2', state.id)
  const diffResult = await OutputViewWorker.invoke('Output.diff2', state.id)
  const commands = await OutputViewWorker.invoke('Output.render2', state.id, diffResult)
  return {
    ...state,
    commands,
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
  await OutputViewWorker.invoke(
    'Output.create',
    state.uid,
    state.uri,
    state.x,
    state.y,
    state.width,
    state.height,
    null,
    state.parentUid,
    state.platform,
  )
  await OutputViewWorker.invoke('Output.loadContent2', state.uid, savedState)
  const diffResult = await OutputViewWorker.invoke('Output.diff2', state.uid)
  const commands = await OutputViewWorker.invoke('Output.render2', state.uid, diffResult)
  return {
    ...oldState,
    commands,
    isHotReloading: false,
  }
}
