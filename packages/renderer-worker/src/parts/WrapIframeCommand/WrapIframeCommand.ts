import * as IframeWorker from '../IframeWorker/IframeWorker.js'

export const wrapIframeCommand = (key: string) => {
  const fn = async (state, ...args) => {
    await IframeWorker.invoke(`WebView.${key}`, state.uid, ...args)
    const diffResult = await IframeWorker.invoke('WebView.diff2', state.uid)
    if (diffResult.length === 0) {
      return state
    }
    const commands = await IframeWorker.invoke('WebView.render2', state.uid, diffResult)
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
