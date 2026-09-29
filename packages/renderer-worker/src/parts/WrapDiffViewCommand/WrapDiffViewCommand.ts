import * as DiffViewWorker from '../DiffViewWorker/DiffViewWorker.js'
import * as NameAnonymousFunction from '../NameAnonymousFunction/NameAnonymousFunction.js'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'
import * as ViewletStates from '../ViewletStates/ViewletStates.js'

export const wrapDiffViewCommand = (key: string) => {
  const fn = async (state: any, ...args: readonly any[]) => {
    const viewletId = state.id || state.uid
    await DiffViewWorker.invoke(`DiffView.${key}`, viewletId, ...args)
    const diffResult = await DiffViewWorker.invoke('DiffView.diff2', viewletId)
    if (diffResult.length === 0) {
      return state
    }
    const commands = await DiffViewWorker.invoke('DiffView.render2', viewletId, diffResult)
    if (commands.length === 0) {
      return state
    }
    const latest = ViewletStates.getState(ViewletModuleId.DiffEditor)
    return {
      ...latest,
      commands,
    }
  }
  NameAnonymousFunction.nameAnonymousFunction(fn, `DiffView/${key}`)
  return fn
}
