import * as AdjustCommands from '../AdjustCommands/AdjustCommands.js'
import * as ReferencesWorker from '../ReferencesWorker/ReferencesWorker.js'

export const hasFunctionalRender = true

export const hasFunctionalRootRender = true

export const hasFunctionalEvents = true

const renderItems = {
  isEqual(oldState, newState) {
    return newState.commands.length === 0
  },
  apply: AdjustCommands.apply,
  multiple: true,
}

export const render = [renderItems]

export const renderEventListeners = async () => {
  const listeners = await ReferencesWorker.invoke('References.renderEventListeners')
  return listeners
}
