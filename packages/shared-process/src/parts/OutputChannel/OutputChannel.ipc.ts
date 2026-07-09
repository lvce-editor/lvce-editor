import * as Assert from '../Assert/Assert.ts'
import { JsonRpcEvent } from '../JsonRpc/JsonRpc.ts'
import * as OutputChannelState from '../OutputChannelState/OutputChannelState.ts'
import * as OutputChannel from './OutputChannel.ts'

const open = (socket: any, id: any, path: any): any => {
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
  const onData = (data: any): any => {
    console.log('send data', data)
    const message = JsonRpcEvent.create('Output.handleData', [data])
    socket.send(message)
  }
  const onError = (error: any): any => {
    console.info(`[shared process] output channel error: ${error}`)
    const message = JsonRpcEvent.create('Output.handleError', [error])
    socket.send(message)
  }
  const outputChannel = OutputChannel.open(path, onData, onError)
  OutputChannelState.set(id, outputChannel)
}

const close = (socket: any, id: any): any => {
  OutputChannel.dispose(OutputChannelState.get(id))
  OutputChannelState.remove(id)
}

export const name = 'OutputChannel'

export const Commands = {
  close: close,
  open: open,
}
