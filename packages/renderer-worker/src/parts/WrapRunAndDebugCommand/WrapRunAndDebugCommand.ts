import * as DebugWorker from '../DebugWorker/DebugWorker.js'

export const wrapRunAndDebugCommand = (key: string) => {
  const fn = async (state, ...args) => {
    await DebugWorker.invoke(`RunAndDebug.${key}`, state.uid, ...args)
    const diffResult = await DebugWorker.invoke('RunAndDebug.diff2', state.uid)
    if (diffResult.length === 0) {
      return state
    }
    const commands = await DebugWorker.invoke('RunAndDebug.render2', state.uid, diffResult)
    if (commands.length === 0) {
      return state
    }
    return {
      ...state,
      commands,
    }
  }
  return fn
}
