import * as TextSearchWorker from '../TextSearchWorker/TextSearchWorker.js'
import type { SearchState } from './ViewletSearchTypes.ts'
import * as Workspace from '../Workspace/Workspace.js'

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
  await TextSearchWorker.invoke('TextSearch.create', state.uid)
  await TextSearchWorker.invoke('TextSearch.loadContent', state.uid, state.x, state.y, state.width, state.height, Workspace.state.workspacePath)
  const commands = await TextSearchWorker.invoke('TextSearch.render', state.uid)
  return {
    ...state,
    commands,
  }
}

export const handleIconThemeChange = (state: SearchState): SearchState => {
  return {
    ...state,
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
