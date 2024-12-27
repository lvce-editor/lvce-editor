import * as JsonRpc from '../JsonRpc/JsonRpc.js'
import * as SerializeHeaders from '../SerializeHeaders/SerializeHeaders.js'

export const create = (ipc) => {
  const handleRequest = async (request) => {
    const { method, url, headers } = request
    const serializedHeaders = SerializeHeaders.serializeHeaders(headers)
    const { body, init } = await JsonRpc.invoke(ipc, 'WebViewProtocol.getResponse', method, url, serializedHeaders)
    return new Response(body, init)
  }
  return handleRequest
}
