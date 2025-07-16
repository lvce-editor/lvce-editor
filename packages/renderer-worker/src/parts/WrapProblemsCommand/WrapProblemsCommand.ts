import * as ProblemsWorker from '../ProblemsWorker/ProblemsWorker.js'
import * as ViewletStates from '../ViewletStates/ViewletStates.js'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'
import * as NameAnonymousFunction from '../NameAnonymousFunction/NameAnonymousFunction.js'

export const wrapProblemsCommand = (key: string) => {
  const fn = async (state, ...args) => {
    await ProblemsWorker.invoke(`Problems.${key}`, state.uid, ...args)
    const diffResult = await ProblemsWorker.invoke('Problems.diff2', state.uid)
    if (diffResult.length === 0) {
      return state
    }
    const commands = await ProblemsWorker.invoke('Problems.render2', state.uid, diffResult)
    const actionsDom = await ProblemsWorker.invoke('Problems.renderActions', state.uid)
    if (commands.length === 0) {
      return state
    }
    const latest = ViewletStates.getState(ViewletModuleId.Problems)
    return {
      ...latest,
      commands,
      actionsDom,
    }
  }
  NameAnonymousFunction.nameAnonymousFunction(fn, `Problems/${key}`)
  return fn
}
