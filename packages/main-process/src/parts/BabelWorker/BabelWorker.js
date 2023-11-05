import { join } from 'node:path'
import * as IpcParent from '../IpcParent/IpcParent.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'
import * as Root from '../Root/Root.js'
import * as HandleIpc from '../HandleIpc/HandleIpc.js'

const state = {
  /**
   * @type {any}
   */
  ipcPromise: undefined,
}

const getBabelWorkerPath = () => {
  return join(Root.root, 'packages', 'babel-worker', 'src', 'babelWorkerMain.js')
}

const create = async () => {
  const path = getBabelWorkerPath()
  const ipc = await IpcParent.create({
    method: IpcParentType.NodeWorker,
    path,
  })
  HandleIpc.handleIpc(ipc)
  return ipc
}

export const getOrCreate = () => {
  if (!state.ipcPromise) {
    state.ipcPromise = create()
  }
  return state.ipcPromise
}
