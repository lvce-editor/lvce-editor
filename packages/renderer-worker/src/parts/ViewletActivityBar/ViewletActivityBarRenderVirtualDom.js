import * as AdjustCommands from '../AdjustCommands/AdjustCommands.js'
import * as ActivityBarWorker from '../ActivityBarWorker/ActivityBarWorker.js'

export const hasFunctionalRender = true

export const hasFunctionalRootRender = true

export const hasFunctionalEvents = true

const renderItems = {
  isEqual(oldState, newState) {
    console.log({ commands: newState.commands })
    return JSON.stringify(oldState.commands) === JSON.stringify(newState.commands)
  },
  apply: AdjustCommands.apply,
  multiple: true,
}

export const render = [renderItems]

export const renderEventListeners = async () => {
  const listeners = await ActivityBarWorker.invoke('ActivityBar.renderEventListeners')
  console.log({ listeners })
  return listeners
}
