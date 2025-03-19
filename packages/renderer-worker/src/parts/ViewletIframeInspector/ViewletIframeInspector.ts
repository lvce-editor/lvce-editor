import type { IframeInspectorState } from './ViewletIframeInspectorTypes.ts'
import * as IframeInspectorWorker from '../IframeInspectorWorker/IframeInspectorWorker.js'

export const create = (id: number, uri: string, x: number, y: number, width: number, height: number): IframeInspectorState => {
  return {
    id,
    uid: id,
    commands: [],
    x,
    y,
    width,
    height,
  }
}

export const loadContent = async (state: IframeInspectorState): Promise<IframeInspectorState> => {
  await IframeInspectorWorker.invoke('IframeInspector.create', state.id, state.x, state.y, state.width, state.height)
  await IframeInspectorWorker.invoke('IframeInspector.loadContent', state.id)
  const commands = await IframeInspectorWorker.invoke('IframeInspector.render', state.id)
  return {
    ...state,
    commands,
  }
}

export const hotReload = async (state) => {
  if (state.isHotReloading) {
    return state
  }
  // TODO avoid mutation
  state.isHotReloading = true
  // possible TODO race condition during hot reload
  // there could still be pending promises when the worker is disposed
  const savedState = await IframeInspectorWorker.invoke('IframeInspector.saveState', state.uid)
  await IframeInspectorWorker.restart('IframeInspector.terminate')
  const oldState = {
    ...state,
    items: [],
  }
  await IframeInspectorWorker.invoke('IframeInspector.create', state.id, state.x, state.y, state.width, state.height)
  await IframeInspectorWorker.invoke('IframeInspector.loadContent', state.id, savedState)
  const commands = await IframeInspectorWorker.invoke('IframeInspector.render', oldState.id)
  return {
    ...oldState,
    commands,
    isHotReloading: false,
  }
}
