import * as ExtensionDetailViewWorker from '../ExtensionDetailViewWorker/ExtensionDetailViewWorker.js'

export const getKeyBindings = async () => {
  try {
    return await ExtensionDetailViewWorker.invoke('ExtensionDetail.getKeyBindings')
  } catch {
    return []
  }
}
