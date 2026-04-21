import * as DiffViewWorker from '../DiffViewWorker/DiffViewWorker.js'

export const create = (uid, uri, x, y, width, height, args, parentUid) => {
  return {
    id: uid,
    uid,
    parentUid,
    uri,
    x,
    y,
    width,
    height,
    commands: [],
  }
}

export const loadContent = async (state, savedState) => {
  await DiffViewWorker.invoke('DiffView.create', state.uid, state.uri, state.x, state.y, state.width, state.height, null)
  await DiffViewWorker.invoke('DiffView.loadContent', state.uid, savedState)
  const diffResult = await DiffViewWorker.invoke('DiffView.diff2', state.uid)
  const commands = await DiffViewWorker.invoke('DiffView.render2', state.uid, diffResult)
  return {
    ...state,
    commands,
  }
}

export const hotReload = async (state) => {
  if (state.isHotReloading) {
    return state
  }
  state.isHotReloading = true
  const savedState = await DiffViewWorker.invoke('DiffView.saveState', state.uid)
  await DiffViewWorker.restart('DiffView.terminate')
  await DiffViewWorker.invoke('DiffView.create', state.uid, state.uri, state.x, state.y, state.width, state.height, null)
  await DiffViewWorker.invoke('DiffView.loadContent', state.uid, savedState)
  const diffResult = await DiffViewWorker.invoke('DiffView.diff2', state.uid)
  const commands = await DiffViewWorker.invoke('DiffView.render2', state.uid, diffResult)
  state.isHotReloading = false
  return {
    ...state,
    commands,
  }
}
