import * as AdjustCommands from '../AdjustCommands/AdjustCommands.js'
import * as DiffViewWorker from '../DiffViewWorker/DiffViewWorker.js'

export const hasFunctionalRender = true

export const hasFunctionalRootRender = true

export const hasFunctionalEvents = true

export const hasFunctionalResize = true

const renderItems = {
  isEqual(oldState, newState) {
    return JSON.stringify(oldState.commands) === JSON.stringify(newState.commands)
  },
  apply: AdjustCommands.apply,
  multiple: true,
}

export const render = [renderItems]

export const renderEventListeners = async () => {
  try {
    const listeners = await DiffViewWorker.invoke('DiffView.renderEventListeners')
    return listeners
  } catch {
    return []
  }
}
