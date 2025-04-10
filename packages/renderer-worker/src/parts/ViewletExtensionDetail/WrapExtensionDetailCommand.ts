import * as ExtensionDetailViewWorker from '../ExtensionDetailViewWorker/ExtensionDetailViewWorker.js'

export const wrapExtensionDetailCommand = (key) => {
  const fn = async (state, ...args) => {
    await ExtensionDetailViewWorker.invoke(`ExtensionDetail.${key}`, state.uid, ...args)
    const diffResult = await ExtensionDetailViewWorker.invoke('ExtensionDetail.diff2', state.uid)
    if (diffResult.length === 0) {
      return state
    }
    const commands = await ExtensionDetailViewWorker.invoke('ExtensionDetail.render2', state.uid, diffResult)
    return {
      ...state,
      commands,
    }
  }
  return fn
}
