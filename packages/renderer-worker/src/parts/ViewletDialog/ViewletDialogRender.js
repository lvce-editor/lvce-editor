import * as AdjustCommands from '../AdjustCommands/AdjustCommands.js'
import * as DialogWorker from '../DialogWorker/DialogWorker.js'

export const hasFunctionalRender = true

export const hasFunctionalRootRender = true

export const hasFunctionalEvents = true

export const renderDialog = {
  isEqual(oldState, newState) {
    return false
  },
  apply: AdjustCommands.apply,
  multiple: true,
}

export const render = [renderDialog]

export const renderEventListeners = async () => {
  return DialogWorker.invoke('Dialog.renderEventListeners')
}
