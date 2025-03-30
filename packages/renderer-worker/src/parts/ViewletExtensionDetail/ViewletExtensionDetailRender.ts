import * as AdjustCommands from '../AdjustCommands/AdjustCommands.js'
import * as ExtensionDetailViewWorker from '../ExtensionDetailViewWorker/ExtensionDetailViewWorker.js'

export const hasFunctionalRender = true

export const hasFunctionalRootRender = true

export const hasFunctionalEvents = true

const renderDom = {
  isEqual(oldState, newState) {
    return false
  },
  apply: AdjustCommands.apply,
  multiple: true,
}

export const render = [renderDom]

export const renderEventListeners = async () => {
  const listeners = await ExtensionDetailViewWorker.invoke('ExtensionDetail.renderEventListeners')
  return listeners
}
