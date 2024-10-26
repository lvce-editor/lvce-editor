import * as ExtensionSearchViewWorker from '../ExtensionSearchViewWorker/ExtensionSearchViewWorker.js'

export const searchExtensions = async (extensions, value) => {
  const filteredExtensions = await ExtensionSearchViewWorker.invoke('SearchExtensions.searchExtensions', extensions, value)
  return filteredExtensions
}
