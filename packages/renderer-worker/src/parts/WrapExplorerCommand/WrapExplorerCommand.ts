import * as ExplorerViewWorker from '../ExplorerViewWorker/ExplorerViewWorker.js'
import * as ViewletExplorer from '../ViewletExplorer/ViewletExplorer.js'

export const wrapExplorerCommand = (key: string) => {
  const fn = async (state, ...args) => {
    await ExplorerViewWorker.invoke(`Explorer.${key}`, state.uid, ...args)
    const diffResult = await ExplorerViewWorker.invoke('Explorer.diff2', state.uid)
    const title = await ViewletExplorer.getTitle(state.uid)
    if (diffResult.length === 0) {
      if (state.title === title) {
        return state
      }
      return {
        ...state,
        title,
      }
    }
    const commands = await ExplorerViewWorker.invoke('Explorer.render2', state.uid, diffResult)
    if (commands.length === 0) {
      if (state.title === title) {
        return state
      }
      return {
        ...state,
        title,
      }
    }
    return {
      ...state,
      commands,
      title,
    }
  }
  return fn
}
