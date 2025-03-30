import * as ExtensionSearchViewWorker from '../ExtensionSearchViewWorker/ExtensionSearchViewWorker.js'

export const wrapExtensionSearchCommand = (key) => {
  const wrapped = async (state, ...args) => {
    await ExtensionSearchViewWorker.invoke(`SearchExtensions.${key}`, state.uid, ...args)
    const diffResult = await ExtensionSearchViewWorker.invoke(`SearchExtensions.diff2`, state.uid)
    const commands = await ExtensionSearchViewWorker.invoke('SearchExtensions.render3', state.uid, diffResult)
    return {
      ...state,
      commands,
    }
  }
  return wrapped
}
