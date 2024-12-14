import * as FileSearchWorker from '../FileSearchWorker/FileSearchWorker.js'

export const getKeyBindings = () => {
  return FileSearchWorker.invoke('QuickPick.getKeyBindings')
}
