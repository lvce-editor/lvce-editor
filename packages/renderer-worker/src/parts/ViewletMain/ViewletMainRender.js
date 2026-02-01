import * as AdjustCommands from '../AdjustCommands/AdjustCommands.js'
import * as MainAreaWorker from '../MainAreaWorker/MainAreaWorker.js'

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
  const listeners = await MainAreaWorker.invoke('MainArea.renderEventListeners')
  return listeners
}

// TODO in renderer process, when creating references viewlet and appending it
// and it is an iframe, send renderer worker message that iframe was appended
// then it can create a connection to load the actual content
