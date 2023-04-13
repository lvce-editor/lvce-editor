import * as Assert from '../Assert/Assert.js'
import * as JsonRpcVersion from '../JsonRpcVersion/JsonRpcVersion.js'
import * as OutputChannelState from '../OutputChannelState/OutputChannelState.js'
import * as OutputChannel from './OutputChannel.js'

const open = (socket, id, path) => {
  console.log({ path })
  Assert.object(socket)
  // Assert.string(id)
  Assert.string(path)
  if (!socket) {
    console.warn('socket not available')
    return
  }
  if (OutputChannelState.has(id)) {
    OutputChannel.dispose(OutputChannelState.get(id))
  }
  const onData = (data) => {
    console.log('send data', data)
    socket.send({
      jsonrpc: JsonRpcVersion.Two,
      method: 'Output.handleData',
      params: [data],
    })
  }
  const onError = (error) => {
    console.info(`[shared process] output channel error: ${error}`)
    socket.send({
      jsonrpc: JsonRpcVersion.Two,
      method: 'Output.handleError',
      params: [error],
    })
  }
  const outputChannel = OutputChannel.open(path, onData, onError)
  OutputChannelState.set(id, outputChannel)
}

const close = (socket, id) => {
  OutputChannel.dispose(OutputChannelState.get(id))
  OutputChannelState.remove(id)
}

export const name = 'OutputChannel'

export const Commands = {
  close: close,
  open: open,
}
