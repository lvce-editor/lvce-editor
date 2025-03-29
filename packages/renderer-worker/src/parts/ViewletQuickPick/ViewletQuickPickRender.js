import * as AdjustCommands from '../AdjustCommands/AdjustCommands.js'
import * as FileSearchWorker from '../FileSearchWorker/FileSearchWorker.js'

export const hasFunctionalRender = true

export const hasFunctionalRootRender = true

export const hasFunctionalEvents = true

export const renderItems = {
  isEqual(oldState, newState) {
    return false
  },
  apply: AdjustCommands.apply,
  multiple: true,
}

export const render = [renderItems]

export const renderEventListeners = async () => {
  const listeners = await FileSearchWorker.invoke('QuickPick.renderEventListeners')
  return listeners
}
