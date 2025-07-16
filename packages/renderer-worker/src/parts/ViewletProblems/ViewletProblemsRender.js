import * as AdjustCommands from '../AdjustCommands/AdjustCommands.js'
import * as ProblemsWorker from '../ProblemsWorker/ProblemsWorker.ts'

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
  const listeners = await ProblemsWorker.invoke('Problems.renderEventListeners')
  return listeners
}
