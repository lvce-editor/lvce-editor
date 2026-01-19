import * as AssetDir from '../AssetDir/AssetDir.js'
import * as Platform from '../Platform/Platform.js'
import * as TextSearchWorker from '../TextSearchWorker/TextSearchWorker.js'
import * as Workspace from '../Workspace/Workspace.js'
import type { SearchState } from './ViewletSearchTypes.ts'

export const create = (id: any, uri: string, x: number, y: number, width: number, height: number): SearchState => {
  return {
    uid: id,
    x,
    y,
    width,
    height,
    commands: [],
    actionsDom: [],
    assetDir: AssetDir.assetDir,
    platform: Platform.getPlatform(),
  }
}

const doCreate = async (state: any): Promise<void> => {
  const itemHeight = 22
  const value = ''
  const replacement = ''
  await TextSearchWorker.invoke(
    'TextSearch.create',
    state.uid,
    state.x,
    state.y,
    state.width,
    state.height,
    Workspace.state.workspacePath,
    state.assetDir,
    itemHeight,
    value,
    replacement,
    state.platform,
  )
}

export const loadContent = async (state: SearchState, savedState: any): Promise<SearchState> => {
  await doCreate(state)
  await TextSearchWorker.invoke('TextSearch.loadContent', state.uid, savedState)
  const diffResult = await TextSearchWorker.invoke('TextSearch.diff2', state.uid)
  const commands = await TextSearchWorker.invoke('TextSearch.render2', state.uid, diffResult)
  const actionsDom = await TextSearchWorker.invoke('TextSearch.renderActions', state.uid)

  return {
    ...state,
    commands,
    actionsDom,
  }
}

export const dispose = async (state: SearchState) => {
  return {
    ...state,
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
  const savedState = await TextSearchWorker.invoke('TextSearch.saveState', state.uid)
  await TextSearchWorker.restart('TextSearch.terminate')
  await doCreate(state)
  await TextSearchWorker.invoke('TextSearch.loadContent', state.uid, savedState)
  const diffResult = await TextSearchWorker.invoke('TextSearch.diff2', state.uid)
  const commands = await TextSearchWorker.invoke('TextSearch.render2', state.uid, diffResult)
  state.commands = commands
  state.isHotReloading = false
  return {
    ...state,
  }
}

// TODO implement virtual list, only send visible items to renderer process

// TODO maybe rename to result.items and result.stats
// TODO support streaming results
// TODO support cancellation
// TODO handle error
// TODO use command.execute or use module directly?
// TODO send results to renderer process
// TODO use virtual list because there might be many results
