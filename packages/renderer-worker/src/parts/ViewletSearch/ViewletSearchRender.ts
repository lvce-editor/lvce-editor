import * as TextSearchWorker from '../TextSearchWorker/TextSearchWorker.js'
import type { SearchState } from './ViewletSearchTypes.ts'
import * as AdjustCommands from '../AdjustCommands/AdjustCommands.js'

export const hasFunctionalRender = true

export const hasFunctionalRootRender = true

export const hasFunctionalEvents = true

const renderItems = {
  isEqual(oldState: SearchState, newState: SearchState) {
    return newState.commands.length === 0
  },
  apply: AdjustCommands.apply,
  multiple: true,
}

export const render = [renderItems]

export const renderEventListeners = async () => {
  const listeners = await TextSearchWorker.invoke('TextSearch.renderEventListeners')
  return listeners
}
