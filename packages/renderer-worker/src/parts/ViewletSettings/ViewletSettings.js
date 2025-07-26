import * as SettingsWorker from '../SettingsWorker/SettingsWorker.ts'
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
  await SettingsWorker.invoke('Settings.create', state.uid, state.uri, state.x, state.y, state.width, state.height, Workspace.getWorkspaceUri())
  await SettingsWorker.invoke('Settings.loadContent', state.uid, savedState)
  const diffResult = await SettingsWorker.invoke('Settings.diff2', state.uid)
  const commands = await SettingsWorker.invoke('Settings.render2', state.uid, diffResult)
  const actionsDom = await SettingsWorker.invoke('Settings.renderActions', state.uid)

  return {
    ...state,
    commands,
    actionsDom,
  }
}

export const getBadgeCount = (state) => {
  // TODO
  return 0
}
