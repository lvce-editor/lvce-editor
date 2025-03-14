import * as IframeInspectorWorker from '../IframeInspectorWorker/IframeInspectorWorker.js'

export const wrapIframeInspectorCommand = (key: string) => {
  const fn = async (state, ...args) => {
    const newState = await IframeInspectorWorker.invoke(`IframeInspector.${key}`, state.uid, ...args)
    const commands = await IframeInspectorWorker.invoke('IframeInspector.render', state.uid)
    if (commands.length === 0) {
      return state
    }
    return {
      ...newState,
      commands,
    }
  }
  return fn
}
