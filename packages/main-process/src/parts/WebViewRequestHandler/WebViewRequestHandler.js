import * as JsonRpc from '../JsonRpc/JsonRpc.js'

export const state = {
  ipc: undefined,
}

export const setIpc = (ipc) => {
  state.ipc = ipc
}

export const handleRequest = async (request) => {
  // TODO avoid relying on global variable
  const { ipc } = state
  const { method, url } = request
  const { body, init } = await JsonRpc.invoke(ipc, 'WebViewProtocol.getResponse', method, url)
  return new Response(body, init)
}
