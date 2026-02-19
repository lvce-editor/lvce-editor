import * as AdjustCommands from '../AdjustCommands/AdjustCommands.js'
import * as PanelWorker from '../PanelWorker/PanelWorker.js'

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
  const listeners = await PanelWorker.invoke('Panel.renderEventListeners')
  return listeners
}

export const hasFunctionalResize = true

export const resize = async (state, dimensions) => {
  await PanelWorker.invoke('Panel.resize', state.uid, dimensions)
  const diffResult = await PanelWorker.invoke('Panel.diff2', state.uid)
  const commands = await PanelWorker.invoke('Panel.render2', state.uid, diffResult)
  return {
    ...state,
    commands,
  }
}
