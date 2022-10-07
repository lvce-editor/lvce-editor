import * as RendererProcess from '../RendererProcess/RendererProcess.js'

// workaround for https://bugs.chromium.org/p/chromium/issues/detail?id=1211923
export const create = async ({ url, name }) => {
  const messageChannel = new MessageChannel()
  const { port1, port2 } = messageChannel
  await RendererProcess.state.ipc.send({
    jsonrpc: '2.0',
    method: 'get-worker-port',
    params: [{ url, name }],
  })
  return {
    send() {},
  }
}
