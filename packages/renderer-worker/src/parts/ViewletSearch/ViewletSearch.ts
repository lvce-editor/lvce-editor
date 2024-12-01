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
  }
}

export const loadContent = async (state: SearchState, savedState: any): Promise<SearchState> => {
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
    AssetDir.assetDir,
    itemHeight,
    value,
    replacement,
    Platform.platform,
  )
  await TextSearchWorker.invoke('TextSearch.loadContent', state.uid, savedState)
  const commands = await TextSearchWorker.invoke('TextSearch.render', state.uid)
  return {
    ...state,
    commands,
  }
}

export const dispose = async (state: SearchState) => {
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
