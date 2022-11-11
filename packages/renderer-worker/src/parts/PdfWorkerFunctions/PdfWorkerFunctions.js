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

export const sendCanvas = (ipc, canvasId, offscreenCanvas) => {
  return invokeAndTransfer(
    ipc,
    'Canvas.addCanvas',
    [offscreenCanvas],
    canvasId,
    offscreenCanvas
  )
}

export const setContent = (ipc, canvasId, content) => {
  return invoke(ipc, 'Canvas.setContent', canvasId, content)
}

export const resize = (ipc, canvasId, width, height) => {
  return invoke(ipc, 'Canvas.resize', canvasId, width, height)
}
export const render = (ipc, canvasId) => {
  return invoke(ipc, 'Canvas.render', canvasId)
}

export const focusPage = (ipc, canvasId, page) => {
  return invoke(ipc, 'Canvas.focusPage', canvasId, page)
}
