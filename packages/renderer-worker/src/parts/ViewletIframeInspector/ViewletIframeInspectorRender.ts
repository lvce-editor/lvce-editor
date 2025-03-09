import type { IframeInspectorState } from './ViewletIframeInspectorTypes.ts'
import * as AdjustCommands from '../AdjustCommands/AdjustCommands.js'
import * as AboutViewWorker from '../AboutViewWorker/AboutViewWorker.js'

export const hasFunctionalRender = true

export const hasFunctionalRootRender = true

export const hasFunctionalEvents = true

export const renderDialog = {
  isEqual(oldState: IframeInspectorState, newState: IframeInspectorState) {
    return false
  },
  apply: AdjustCommands.apply,
  multiple: true,
}

export const render = [renderDialog]

export const renderEventListeners = async () => {
  const listeners = await AboutViewWorker.invoke('About.renderEventListeners')
  return listeners
}
