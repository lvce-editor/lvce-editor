import * as QuickPickWorker from '../QuickPickWorker/QuickPickWorker.js'

export const getKeyBindings = () => {
  return QuickPickWorker.invoke('QuickPick.getKeyBindings')
}
