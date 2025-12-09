import * as AdjustCommands from '../AdjustCommands/AdjustCommands.js'
import * as StatusBarWorker from '../StatusBarWorker/StatusBarWorker.js'

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
  const listeners = await StatusBarWorker.invoke('StatusBar.renderEventListeners')
  return listeners
}

export const hasFunctionalResize = true

export const resize = async (state, dimensions) => {
  await StatusBarWorker.invoke('StatusBar.resize', state.uid, dimensions)
  const diffResult = await StatusBarWorker.invoke('StatusBar.diff2', state.uid)
  const commands = await StatusBarWorker.invoke('StatusBar.render2', state.uid, diffResult)
  return {
    ...state,
    commands,
  }
}
