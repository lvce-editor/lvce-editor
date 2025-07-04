import * as ReferencesWorker from '../ReferencesWorker/ReferencesWorker.js'
import * as ViewletStates from '../ViewletStates/ViewletStates.js'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'
import * as NameAnonymousFunction from '../NameAnonymousFunction/NameAnonymousFunction.js'

export const wrapReferencesCommand = (key: string) => {
  const fn = async (state, ...args) => {
    await ReferencesWorker.invoke(`References.${key}`, state.uid, ...args)
    const diffResult = await ReferencesWorker.invoke('References.diff2', state.uid)
    if (diffResult.length === 0) {
      return state
    }
    const commands = await ReferencesWorker.invoke('References.render2', state.uid, diffResult)
    const actionsDom = await ReferencesWorker.invoke('References.renderActions', state.uid)
    if (commands.length === 0) {
      return state
    }
    const latest = ViewletStates.getState(ViewletModuleId.References)
    return {
      ...latest,
      commands,
      actionsDom,
    }
  }
  NameAnonymousFunction.nameAnonymousFunction(fn, `References/${key}`)
  return fn
}
