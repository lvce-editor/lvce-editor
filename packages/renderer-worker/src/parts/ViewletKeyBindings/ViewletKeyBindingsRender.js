import * as AdjustCommands from '../AdjustCommands/AdjustCommands.js'
import * as KeyBindingsViewWorker from '../KeyBindingsViewWorker/KeyBindingsViewWorker.js'

export const hasFunctionalRender = true

export const hasFunctionalRootRender = true

export const hasFunctionalEvents = true

const renderKeyBindings = {
  isEqual(oldState, newState) {
    return newState.commands && newState.commands.length === 0
  },
  apply: AdjustCommands.apply,
  multiple: true,
}

export const render = [renderKeyBindings]

export const renderEventListeners = async () => {
  const listeners = await KeyBindingsViewWorker.invoke('KeyBindings.renderEventListeners')
  return listeners
}
