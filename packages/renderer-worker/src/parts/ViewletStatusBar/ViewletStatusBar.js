import * as StatusBarWorker from '../StatusBarWorker/StatusBarWorker.js'

export const create = (id, uri, x, y, width, height) => {
  return {
    uid: id,
    x,
    y,
    width,
    height,
    commands: [],
  }
}

export const loadContent = async (state) => {
  const savedState = {}
  await StatusBarWorker.invoke('StatusBar.create', state.uid, '', state.x, state.y, state.width, state.height, null)
  await StatusBarWorker.invoke('StatusBar.loadContent', state.uid, savedState)
  const diffResult = await StatusBarWorker.invoke('StatusBar.diff2', state.uid)
  const commands = await StatusBarWorker.invoke('StatusBar.render2', state.uid, diffResult)
  return {
    ...state,
    commands,
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
  const savedState = await StatusBarWorker.invoke('StatusBar.saveState', state.uid)
  await StatusBarWorker.restart('StatusBar.terminate')
  await StatusBarWorker.invoke('StatusBar.create', state.uid, '', state.x, state.y, state.width, state.height, null)
  await StatusBarWorker.invoke('StatusBar.loadContent', state.uid, savedState)
  const diffResult = await StatusBarWorker.invoke('StatusBar.diff2', state.uid)
  const commands = await StatusBarWorker.invoke('StatusBar.render2', state.uid, diffResult)
  state.isHotReloading = false
  return {
    ...state,
    commands,
  }
}
