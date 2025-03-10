import type { IframeInspectorState } from './ViewletIframeInspectorTypes.ts'
import * as IframeInspectorWorker from '../IframeInspectorWorker/IframeInspectorWorker.js'

export const create = (): IframeInspectorState => {
  return {
    id: 1,
    commands: [],
  }
}

export const loadContent = async (state: IframeInspectorState): Promise<IframeInspectorState> => {
  await IframeInspectorWorker.invoke('IframeInspector.create', state.id)
  await IframeInspectorWorker.invoke('IframeInspector.loadContent', state.id)
  const commands = await IframeInspectorWorker.invoke('IframeInspector.render', state.id)
  return {
    ...state,
    commands,
  }
}
