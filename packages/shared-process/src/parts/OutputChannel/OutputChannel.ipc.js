import * as Assert from '../Assert/Assert.js'
import * as JsonRpcEvent from '../JsonRpcEvent/JsonRpcEvent.js'
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
    const message = JsonRpcEvent.create('Output.handleData', [data])
    socket.send(message)
  }
  const onError = (error) => {
    console.info(`[shared process] output channel error: ${error}`)
    const message = JsonRpcEvent.create('Output.handleError', [error])
    socket.send(message)
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
