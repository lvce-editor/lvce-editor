import * as SettingsViewWorker from '../SettingsViewWorker/SettingsViewWorker.js'
import * as Workspace from '../Workspace/Workspace.js'

export const create = (id, uri, x, y, width, height, args, parentUid) => {
  return {
    uid: id,
    parentUid,
    x,
    y,
    width,
    height,
  }
}

export const loadContent = async (state, savedState) => {
  await SettingsViewWorker.invoke('Settings.create', state.uid, state.uri, state.x, state.y, state.width, state.height, Workspace.getWorkspaceUri())
  await SettingsViewWorker.invoke('Settings.loadContent', state.uid, savedState)
  const diffResult = await SettingsViewWorker.invoke('Settings.diff2', state.uid)
  const commands = await SettingsViewWorker.invoke('Settings.render2', state.uid, diffResult)
  const actionsDom = await SettingsViewWorker.invoke('Settings.renderActions', state.uid)

  return {
    ...state,
    commands,
    actionsDom,
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
  const savedState = await SettingsViewWorker.invoke('Settings.saveState', state.uid)
  await SettingsViewWorker.restart('Settings.terminate')
  const oldState = {
    ...state,
    items: [],
  }
  await SettingsViewWorker.invoke('Settings.create', state.uid, state.uri, state.x, state.y, state.width, state.height)
  await SettingsViewWorker.invoke('Settings.loadContent', state.uid, savedState)
  const diffResult = await SettingsViewWorker.invoke('Settings.diff2', state.uid)
  const commands = await SettingsViewWorker.invoke('Settings.render2', state.uid, diffResult)
  return {
    ...oldState,
    commands,
    isHotReloading: false,
  }
}
