import type { RunningExtensionsState } from './ViewletRunningExtensionsTypes.ts'
import * as AdjustCommands from '../AdjustCommands/AdjustCommands.js'
import * as RunningExtensionsViewWorker from '../RunningExtensionsViewWorker/RunningExtensionsViewWorker.js'

interface Dimensions {
  readonly height: number
  readonly width: number
  readonly x: number
  readonly y: number
}

export const hasFunctionalRender = true

export const hasFunctionalRootRender = true

export const hasFunctionalEvents = true

const renderItems = {
  apply: AdjustCommands.apply,
  isEqual(oldState: RunningExtensionsState, newState: RunningExtensionsState): boolean {
    return oldState.commands === newState.commands
  },
  multiple: true,
}

export const render = [renderItems]

export const renderEventListeners = async (): Promise<readonly any[]> => {
  return RunningExtensionsViewWorker.invoke('RunningExtensions.renderEventListeners')
}

export const hasFunctionalResize = true

export const resize = async (state: RunningExtensionsState, dimensions: Dimensions): Promise<RunningExtensionsState> => {
  await RunningExtensionsViewWorker.invoke('RunningExtensions.resize', state.id, dimensions)
  const diffResult = await RunningExtensionsViewWorker.invoke('RunningExtensions.diff2', state.id)
  const commands = await RunningExtensionsViewWorker.invoke('RunningExtensions.render2', state.id, diffResult)
  return {
    ...state,
    ...dimensions,
    commands,
  }
}
