import * as PreviewWorker from '../PreviewWorker/PreviewWorker.js'

export const wrapPreviewCommand = (key: string) => {
  const fn = async (state, ...args) => {
    await PreviewWorker.invoke(`Preview.${key}`, state.uid, ...args)
    const diffResult = await PreviewWorker.invoke('Preview.diff2', state.uid)
    if (diffResult.length === 0) {
      return state
    }
    const commands = await PreviewWorker.invoke('Preview.render2', state.uid, diffResult)
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
