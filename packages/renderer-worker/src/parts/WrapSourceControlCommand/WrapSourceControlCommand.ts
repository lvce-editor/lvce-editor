import * as SourceControlWorker from '../SourceControlWorker/SourceControlWorker.js'

export const wrapSourceControlCommand = (key: string) => {
  const fn = async (state, ...args) => {
    await SourceControlWorker.invoke(`SourceControl.${key}`, state.uid, ...args)
    const diffResult = await SourceControlWorker.invoke('SourceControl.diff2', state.uid)
    if (diffResult.length === 0) {
      return state
    }
    const commands = await SourceControlWorker.invoke('SourceControl.render2', state.uid, diffResult)
    const badgeCount = await SourceControlWorker.invoke('SourceControl.getBadgeCount', state.uid, diffResult)
    if (commands.length === 0) {
      return state
    }
    return {
      ...state,
      commands,
      badgeCount,
    }
  }
  return fn
}
