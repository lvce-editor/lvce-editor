import * as DiffViewWorker from '../DiffViewWorker/DiffViewWorker.js'

export const getKeyBindings = () => {
  return DiffViewWorker.invoke('DiffView.getKeyBindings')
}
