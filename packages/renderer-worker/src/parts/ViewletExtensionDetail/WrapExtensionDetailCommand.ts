import * as ExtensionDetailViewWorker from '../ExtensionDetailViewWorker/ExtensionDetailViewWorker.js'

export const wrapExtensionDetailCommand = (key) => {
  const fn = async (state, ...args) => {
    await ExtensionDetailViewWorker.invoke(`ExtensionDetail.${key}`, state.uid, ...args)
    const dom = await ExtensionDetailViewWorker.invoke('ExtensionDetail.getVirtualDom2', state.uid)
    return {
      ...state,
      dom,
    }
  }
  return fn
}
