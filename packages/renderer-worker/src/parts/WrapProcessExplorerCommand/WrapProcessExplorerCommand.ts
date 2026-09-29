import * as NameAnonymousFunction from '../NameAnonymousFunction/NameAnonymousFunction.js'
import * as ProcessExplorerWorker from '../ProcessExplorerWorker/ProcessExplorerWorker.js'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'
import * as ViewletStates from '../ViewletStates/ViewletStates.js'

export const wrapProcessExplorerCommand = (key: string) => {
  const fn = async (state, ...args) => {
    await ProcessExplorerWorker.invoke(`ProcessExplorer.${key}`, state.uid, ...args)
    const diffResult = await ProcessExplorerWorker.invoke('ProcessExplorer.diff2', state.uid)
    if (diffResult.length === 0) {
      return state
    }
    const commands = await ProcessExplorerWorker.invoke('ProcessExplorer.render2', state.uid, diffResult)
    if (commands.length === 0) {
      return state
    }
    const latest = ViewletStates.getState(ViewletModuleId.ProcessExplorer)
    return {
      ...latest,
      commands,
    }
  }
  NameAnonymousFunction.nameAnonymousFunction(fn, `ProcessExplorer/${key}`)
  return fn
}
