import * as DebugWorker from '../DebugWorker/DebugWorker.js'
import * as ViewletStates from '../ViewletStates/ViewletStates.js'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'
import * as NameAnonymousFunction from '../NameAnonymousFunction/NameAnonymousFunction.js'

export const wrapRunAndDebugCommand = (key: string, getExtraArgs?: () => readonly unknown[]) => {
  const fn = async (state, ...args) => {
    const extraArgs = getExtraArgs?.() || []
    await DebugWorker.invoke(`RunAndDebug.${key}`, state.uid, ...extraArgs, ...args)
    const diffResult = await DebugWorker.invoke('RunAndDebug.diff2', state.uid)
    if (diffResult.length === 0) {
      return state
    }
    const commands = await DebugWorker.invoke('RunAndDebug.render2', state.uid, diffResult)
    const actionsDom = await DebugWorker.invoke('RunAndDebug.renderActions', state.uid)
    if (commands.length === 0) {
      return state
    }
    const latest = ViewletStates.getState(ViewletModuleId.RunAndDebug)
    return {
      ...latest,
      commands,
      actionsDom,
    }
  }
  NameAnonymousFunction.nameAnonymousFunction(fn, `Debug/${key}`)
  return fn
}
