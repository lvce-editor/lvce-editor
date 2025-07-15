import * as AdjustCommands from '../AdjustCommands/AdjustCommands.js'
import * as ExtensionSearchViewWorker from '../ExtensionSearchViewWorker/ExtensionSearchViewWorker.js'

export const hasFunctionalRender = true

export const hasFunctionalRootRender = true

export const hasFunctionalEvents = true

const renderItems = {
  isEqual(oldState, newState) {
    return JSON.stringify(oldState.commands) === JSON.stringify(newState.commands)
  },
  apply: AdjustCommands.apply,
  multiple: true,
}

export const render = [renderItems]

export const renderEventListeners = async () => {
  const listeners = await ExtensionSearchViewWorker.invoke('SearchExtensions.renderEventListeners')
  return listeners
}
