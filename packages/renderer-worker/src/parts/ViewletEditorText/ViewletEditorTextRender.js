import * as AdjustCommands from '../AdjustCommands/AdjustCommands.js'
import * as EditorWorker from '../EditorWorker/EditorWorker.js'

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
  const listeners = await EditorWorker.invoke('Editor.renderEventListeners')
  return listeners
}

export const hasFunctionalResize = true

export const resize = async (state, dimensions) => {
  await EditorWorker.invoke('Editor.resize', state.uid, dimensions)
  const diffResult = await EditorWorker.invoke('Editor.diff2', state.uid)
  const commands = await EditorWorker.invoke('Editor.render2', state.uid, diffResult)
  return {
    ...state,
    commands,
  }
}
