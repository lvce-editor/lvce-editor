import * as Callback from '../Callback/Callback.js'
import * as JsonRpcVersion from '../JsonRpcVersion/JsonRpcVersion.js'

export const invoke = (ipc, method, ...params) => {
  const { id, promise } = Callback.registerPromise()
  ipc.send({
    jsonrpc: JsonRpcVersion.Two,
    id,
    method,
    params,
  })
  return promise
}

export const invokeAndTransfer = (ipc, method, transfer, ...params) => {
  const { id, promise } = Callback.registerPromise()
  ipc.sendAndTransfer(
    {
      jsonrpc: JsonRpcVersion.Two,
      id,
      method,
      params,
    },
    transfer
  )
  return promise
}

export const sendCanvas = (ipc, canvasId, offscreenCanvas) => {
  return invokeAndTransfer(ipc, 'Canvas.addCanvas', [offscreenCanvas], canvasId, offscreenCanvas)
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
