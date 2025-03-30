import * as IframeInspectorWorker from '../IframeInspectorWorker/IframeInspectorWorker.js'

export const wrapIframeInspectorCommand = (key: string) => {
  const fn = async (state, ...args) => {
    await IframeInspectorWorker.invoke(`IframeInspector.${key}`, state.id, ...args)
    const diffResult = await IframeInspectorWorker.invoke('IframeInspector.diff', state.id)
    const commands = await IframeInspectorWorker.invoke('IframeInspector.render', state.id, diffResult)
    if (commands.length === 0) {
      return state
    }
    return {
      ...state,
      commands,
    }
  }
  return fn
}
