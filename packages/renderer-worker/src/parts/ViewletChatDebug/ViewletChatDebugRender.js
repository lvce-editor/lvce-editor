import * as AdjustCommands from '../AdjustCommands/AdjustCommands.js'
import * as ChatDebugViewWorker from '../ChatDebugViewWorker/ChatDebugViewWorker.js'

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
  const listeners = await ChatDebugViewWorker.invoke('StatusBar.renderEventListeners')
  return listeners
}

export const hasFunctionalResize = true

export const resize = async (state, dimensions) => {
  await ChatDebugViewWorker.invoke('StatusBar.resize', state.uid, dimensions)
  const diffResult = await ChatDebugViewWorker.invoke('StatusBar.diff2', state.uid)
  const commands = await ChatDebugViewWorker.invoke('StatusBar.render2', state.uid, diffResult)
  return {
    ...state,
    commands,
  }
}
