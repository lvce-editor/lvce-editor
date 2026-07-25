import { createLazyRpc, RpcId } from '@lvce-editor/rpc-registry'
import { launchDialogWorker } from '../LaunchDialogWorker/LaunchDialogWorker.js'

const rpc = createLazyRpc(RpcId.DialogWorker)

rpc.setFactory(launchDialogWorker)

export const { invoke, invokeAndTransfer } = rpc
