// @ts-ignore
import { PlainMessagePortRpc, WebWorkerRpcClient2 } from '../../../../../static/js/lvce-editor-rpc.js'
import * as CommandMapRef from '../CommandMapRef/CommandMapRef.js'
import * as RendererFrameScheduler from '../RendererFrameScheduler/RendererFrameScheduler.js'

export const state = {
  pendingMessages: [],
  /**
   * @type {any}
   */
  rpc: undefined,
}

const getRpc = async () => {
  // TODO replace this with a static commandmap

  const rpc = await WebWorkerRpcClient2.create({
    commandMap: CommandMapRef.commandMapRef,
  })
  return rpc
}

export const listen = async () => {
  console.assert(state.pendingMessages.length === 0)
  const rpc = await getRpc()
  state.rpc = rpc
  RendererFrameScheduler.reset(rpc)
}

/**
 * @deprecated use invoke instead
 * @param {*} message
 */
export const send = (message) => {
  state.rpc.send(message)
}

export const invoke = (method, ...params) => {
  return RendererFrameScheduler.invoke(method, ...params)
}

export const invokeAndTransfer = (method, ...params) => {
  return RendererFrameScheduler.invokeAndTransfer(method, ...params)
}

export const sendAndTransfer = (message, transferables) => {
  state.rpc.ipc.sendAndTransfer(message, transferables)
}

// Establish recording before any workspace worker can transfer a direct renderer port.
export const configureSessionReplay = async (options) => {
  const { port1, port2 } = new MessageChannel()
  try {
    const rpc = await PlainMessagePortRpc.create({ commandMap: CommandMapRef.commandMapRef, messagePort: port1 })
    const id = await invokeAndTransfer('SessionReplay.configureProxy', options, port2)
    state.rpc = rpc
    RendererFrameScheduler.reset(rpc)
    return id
  } catch (error) {
    port1.close()
    port2.close()
    throw error
  }
}
