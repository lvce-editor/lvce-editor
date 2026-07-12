import * as AdjustCommands from '../AdjustCommands/AdjustCommands.js'
import * as RunningExtensionsViewWorker from '../RunningExtensionsViewWorker/RunningExtensionsViewWorker.ts'
import type { RunningExtensionsState } from './ViewletRunningExtensionsTypes.ts'

export const hasFunctionalEvents = true
export const hasFunctionalRender = true
export const hasFunctionalRootRender = true

const renderDom = {
  apply: AdjustCommands.apply,
  isEqual(oldState: RunningExtensionsState, newState: RunningExtensionsState) {
    return newState.commands.length === 0
  },
  multiple: true,
}

export const render = [renderDom]

export const renderEventListeners = async () => {
  return RunningExtensionsViewWorker.invoke('RunningExtensions.renderEventListeners')
}
