import * as Callback from '../Callback/Callback.js'
import * as JsonRpcVersion from '../JsonRpcVersion/JsonRpcVersion.js'

export const invoke = (ipc, method, ...params) => {
  return new Promise((resolve, reject) => {
    const callbackId = Callback.register(resolve, reject)
    ipc.send({
      jsonrpc: JsonRpcVersion.Two,
      id: callbackId,
      method,
      params,
    })
  })
}

export const invokeAndTransfer = (ipc, method, transfer, ...params) => {
  return new Promise((resolve, reject) => {
    const callbackId = Callback.register(resolve, reject)
    ipc.sendAndTransfer(
      {
        jsonrpc: JsonRpcVersion.Two,
        id: callbackId,
        method,
        params,
      },
      transfer
    )
  })
}

export const addCanvas = (ipc, canvasId, offscreenCanvas) => {
  return invokeAndTransfer(
    ipc,
    'OffscreenCanvas.add',
    [offscreenCanvas],
    canvasId,
    offscreenCanvas
  )
}

export const render = (ipc, canvasId) => {
  return invoke(ipc, 'Terminal.render', canvasId)
}
