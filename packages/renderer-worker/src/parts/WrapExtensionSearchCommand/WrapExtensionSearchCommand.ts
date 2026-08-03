import * as ExtensionSearchViewWorker from '../ExtensionSearchViewWorker/ExtensionSearchViewWorker.js'
import * as UpdateExtensionSearchRenderState from '../UpdateExtensionSearchRenderState/UpdateExtensionSearchRenderState.js'

export const wrapExtensionSearchCommand = (key) => {
  const wrapped = async (state, ...args) => {
    await ExtensionSearchViewWorker.invoke(`SearchExtensions.${key}`, state.uid, ...args)
    const diffResult = await ExtensionSearchViewWorker.invoke(`SearchExtensions.diff2`, state.uid)
    const commands = await ExtensionSearchViewWorker.invoke('SearchExtensions.render3', state.uid, diffResult)
    return UpdateExtensionSearchRenderState.updateExtensionSearchRenderState(state, commands)
  }
  return wrapped
}
