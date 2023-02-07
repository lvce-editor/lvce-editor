import * as Assert from '../Assert/Assert.js'
import * as Command from '../Command/Command.js'
import * as JsonRpcVersion from '../JsonRpcVersion/JsonRpcVersion.js'
import * as OutputChannel from './OutputChannel.js'

export const state = {
  outputChannels: Object.create(null),
}

const open = (socket, id, path) => {
  console.log({ path })
  Assert.object(socket)
  // Assert.string(id)
  Assert.string(path)
  if (!socket) {
    console.warn('socket not available')
    return
  }
  if (state.outputChannels[id]) {
    OutputChannel.dispose(state.outputChannels[id])
  }
  const onData = (data) => {
    console.log('send data', data)
    socket.send({
      jsonrpc: JsonRpcVersion.Two,
      method: 2133,
      params: ['Output', 'handleData', data],
    })
  }
  const onError = (error) => {
    console.info(`[shared process] output channel error: ${error}`)
    socket.send({
      jsonrpc: JsonRpcVersion.Two,
      method: 2133,
      params: ['Output', 'handleError', error],
    })
  }
  state.outputChannels[id] = OutputChannel.open(path, onData, onError)
}

const close = (socket, id) => {
  OutputChannel.dispose(state.outputChannels[id])
  delete state.outputChannels[id]
}

export const name = 'OutputChannel'

export const Commands = {
  close: close,
  open: open,
}
