import * as AdjustCommands from '../AdjustCommands/AdjustCommands.js'
import * as StatusBarWorker from '../StatusBarWorker/StatusBarWorker.js'

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
  const listeners = await StatusBarWorker.invoke('StatusBar.renderEventListeners')
  return listeners
}
