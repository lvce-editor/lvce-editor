import * as ExtensionDetailViewWorker from '../ExtensionDetailViewWorker/ExtensionDetailViewWorker.js'

export const wrapExtensionDetailCommand = (key) => {
  const fn = async (state, ...args) => {
    const newState = await ExtensionDetailViewWorker.invoke(`ExtensionDetail.${key}`, state.uid, ...args)
    const dom = await ExtensionDetailViewWorker.invoke(
      'ExtensionDetail.getVirtualDom',
      newState,
      newState.sanitizedReadmeHtml,
      newState.selectedTab,
      newState,
    )
    return {
      ...state,
      dom,
    }
  }
  return fn
}
