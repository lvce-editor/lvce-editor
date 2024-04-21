import * as JsonRpc from '../JsonRpc/JsonRpc.js'

const state = {
  ipc: undefined,
}

export const set = (ipc) => {
  state.ipc = ipc
}

export const invoke = (method, ...params) => {
  const { ipc } = state
  if (!ipc) {
    return
  }
  return JsonRpc.invoke(ipc, method, ...params)
}

export const send = (method, ...params) => {
  const { ipc } = state
  if (!ipc) {
    return
  }
  return JsonRpc.send(ipc, method, ...params)
}
