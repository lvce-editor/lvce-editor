import * as ElectronWebContentsView from '../ElectronWebContentsView/ElectronWebContentsView.js'
import * as ElectronWebContentsViewIpcState from '../ElectronWebContentsViewIpcState/ElectronWebContentsViewIpcState.js'

const getIdsToDispose = (ipc) => {
  const entries = ElectronWebContentsViewIpcState.getAll()
  const toDispose = []

  for (const [id, value] of entries) {
    if (value === ipc) {
      toDispose.push(parseInt(id))
    }
  }
  return toDispose
}

export const handleIpcClosed = async (event) => {
  const idsToDispose = getIdsToDispose(event.target)
  for (const id of idsToDispose) {
    ElectronWebContentsViewIpcState.remove(id)
    await ElectronWebContentsView.disposeWebContentsView(id)
  }
  // SharedProcessIpc.send('HandleMessagePortForEmbedsProcess.handleEmbedsProcessIpcClosed')
}
