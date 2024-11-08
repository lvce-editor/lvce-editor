import * as JsonRpc from '../JsonRpc/JsonRpc.js'

export const create = (ipc) => {
  const handleRequest = async (request) => {
    const { method, url } = request
    const { body, init } = await JsonRpc.invoke(ipc, 'WebViewProtocol.getResponse', method, url)
    return new Response(body, init)
  }
  return handleRequest
}
