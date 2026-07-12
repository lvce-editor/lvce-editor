import * as RunningExtensionsViewWorker from '../RunningExtensionsViewWorker/RunningExtensionsViewWorker.ts'
import type { RunningExtensionsState } from '../ViewletRunningExtensions/ViewletRunningExtensionsTypes.ts'

export const wrapRunningExtensionsCommand = (key: string) => {
  return async (state: RunningExtensionsState, ...args: readonly any[]): Promise<RunningExtensionsState> => {
    await RunningExtensionsViewWorker.invoke(`RunningExtensions.${key}`, state.uid, ...args)
    const diffResult = await RunningExtensionsViewWorker.invoke('RunningExtensions.diff2', state.uid)
    const commands = await RunningExtensionsViewWorker.invoke('RunningExtensions.render2', state.uid, diffResult)
    return {
      ...state,
      commands,
    }
  }
}
