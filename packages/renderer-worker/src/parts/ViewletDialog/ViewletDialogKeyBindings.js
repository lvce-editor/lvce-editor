import * as DialogWorker from '../DialogWorker/DialogWorker.js'

export const getKeyBindings = () => {
  return DialogWorker.invoke('Dialog.getKeyBindings')
}
