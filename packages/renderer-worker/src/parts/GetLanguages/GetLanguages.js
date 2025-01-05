import * as ExtensionHostWorker from '../ExtensionHostWorker/ExtensionHostWorker.js'

export const getLanguages = async () => {
  return ExtensionHostWorker.invoke('Languages.getLanguages')
}
