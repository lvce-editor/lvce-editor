import * as ExtensionSearchViewWorker from '../ExtensionSearchViewWorker/ExtensionSearchViewWorker.js'

export const getKeyBindings = () => {
  return ExtensionSearchViewWorker.invoke('SearchExtensions.getKeyBindings')
}
