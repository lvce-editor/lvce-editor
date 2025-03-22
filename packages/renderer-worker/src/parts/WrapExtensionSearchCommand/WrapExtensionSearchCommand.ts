import * as ExtensionSearchViewWorker from '../ExtensionSearchViewWorker/ExtensionSearchViewWorker.js'

export const wrapExtensionSearchCommand = (fn) => {
  const wrapped = async (state, ...args) => {
    const newState = await fn(state, ...args)
    const commands = await ExtensionSearchViewWorker.invoke('SearchExtensions.render', state, newState)
    newState.commands = commands
    return newState
  }
  return wrapped
}
