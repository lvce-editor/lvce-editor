import * as JsonRpc from '../JsonRpc/JsonRpc.js'

export const create = (ipc) => {
  const handleRequest = async (request) => {
    const { method, url, headers } = request
    const { body, init } = await JsonRpc.invoke(ipc, 'WebViewProtocol.getResponse', method, url, headers)
    return new Response(body, init)
  }
  return handleRequest
}
