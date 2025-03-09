import * as AdjustCommands from '../AdjustCommands/AdjustCommands.js'
import * as IframeInspectorWorker from '../IframeInspectorWorker/IframeInspectorWorker.js'
import type { IframeInspectorState } from './ViewletIframeInspectorTypes.ts'

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
  const listeners = await IframeInspectorWorker.invoke('IframeInspector.renderEventListeners')
  return listeners
}
