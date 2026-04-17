import * as DiffViewWorker from '../DiffViewWorker/DiffViewWorker.js'

export const saveState = (state) => {
  return DiffViewWorker.invoke('DiffView.saveState', state.uid)
}
