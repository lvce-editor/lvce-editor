import * as AboutViewWorker from '../AboutViewWorker/AboutViewWorker.js'

export const wrapIframeInspectorCommand = (key: string) => {
  const fn = async (state, ...args) => {
    const newState = await AboutViewWorker.invoke(`IframeInspector.${key}`, state.uid, ...args)
    const commands = await AboutViewWorker.invoke('IframeInspector.render', state.uid)
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
