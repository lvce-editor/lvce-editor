import * as AdjustCommands from '../AdjustCommands/AdjustCommands.js'
import * as OutputViewWorker from '../OutputViewWorker/OutputViewWorker.js'

export const hasFunctionalRender = true

export const hasFunctionalRootRender = true

export const hasFunctionalEvents = true

export const renderDialog = {
  isEqual(oldState: any, newState: any) {
    return false
  },
  apply: AdjustCommands.apply,
  multiple: true,
}

export const render = [renderDialog]

export const renderEventListeners = async () => {
  const listeners = await OutputViewWorker.invoke('Output.renderEventListeners')
  return listeners
}
