import { parentPort } from 'node:worker_threads'
import * as Callback from '../Callback/Callback.js'
import * as Command from '../Command/Command.js'
import * as GetResponse from '../GetResponse/GetResponse.js'
import * as IpcChild from '../IpcChild/IpcChild.js'
import * as IpcChildType from '../IpcChildType/IpcChildType.js'

// TODO add tests for this

// TODO handle structure: one shared process multiple extension hosts

// TODO pass socket / port handle also in electron

export const state = {
  electronPortMap: new Map(),
}

// TODO apparent there are multiple ways for listening to ipc
// 1. parentPort
// 2. process.send
// instead of if/else use interface and abstraction: ParentPortIpc.listen(), ProcessIpc.listen(), ParentPortIpc.send(message), ProcessIpc.send(message)

export const electronSend = (message) => {
  if (parentPort) {
    // @ts-ignore
    // process.send(message)
    parentPort.postMessage(message)
  } else if (process.send) {
    process.send(message)
  }
}

const handleJsonRpcResult = (message) => {
  Callback.resolve(message.id, message.result)
}

const handleJsonRpcMessage = async (message, handle) => {
  if (message.method) {
    const response = await GetResponse.getResponse(message, handle)
    electronSend(response)
  } else {
    // TODO handle error
    Command.execute(message.method, ...message.params)
  }
}

const handleMessageFromParentProcess = async (message, handle) => {
  if (message.result) {
    return handleJsonRpcResult(message)
  }
  if (message.method) {
    return handleJsonRpcMessage(message, handle)
  }
  console.warn('unknown message', message)
}

// TODO maybe rename to hydrate
export const listen = async () => {
  const method = IpcChildType.Auto()
  const ipc = await IpcChild.listen({
    method,
  })
  ipc.on('message', handleMessageFromParentProcess)
}
