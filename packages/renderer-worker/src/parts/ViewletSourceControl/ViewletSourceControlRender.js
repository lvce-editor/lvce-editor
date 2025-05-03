import * as AdjustCommands from '../AdjustCommands/AdjustCommands.js'
import * as SourceControlWorker from '../SourceControlWorker/SourceControlWorker.js'

export const hasFunctionalRender = true

export const hasFunctionalRootRender = true

export const hasFunctionalEvents = true

const renderSourceControl = {
  isEqual(oldState, newState) {
    return newState.commands && newState.commands.length === 0
  },
  apply: AdjustCommands.apply,
  multiple: true,
}

export const render = [renderSourceControl]

export const renderEventListeners = async () => {
  const listeners = await SourceControlWorker.invoke('SourceControl.renderEventListeners')
  return listeners
}
