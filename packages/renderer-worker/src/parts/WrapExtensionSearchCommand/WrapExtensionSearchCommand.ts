import * as ExtensionSearchViewWorker from '../ExtensionSearchViewWorker/ExtensionSearchViewWorker.js'

export const wrapExtensionSearchCommand = (key) => {
  const wrapped = async (state, ...args) => {
    await ExtensionSearchViewWorker.invoke(`SearchExtensions.${key}`, state.uid, ...args)
    const commands = await ExtensionSearchViewWorker.invoke('SearchExtensions.render2', state.uid)
    return {
      ...state,
      commands,
    }
  }
  return wrapped
}
