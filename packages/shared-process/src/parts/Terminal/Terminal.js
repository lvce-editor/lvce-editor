import * as Assert from '../Assert/Assert.js'
import * as JsonRpcVersion from '../JsonRpcVersion/JsonRpcVersion.js'
import * as PtyHost from '../PtyHost/PtyHost.js'
import * as TerminalState from '../TerminalState/TerminalState.js'
import { VError } from '../VError/VError.js'

const createTerminal = (ptyHost, socket) => {
  const handleMessage = (message) => {
    socket.send(message)
  }
  const handleClose = () => {
    // socket.off('close', handleClose)
    ptyHost.off('message', handleMessage)
    ptyHost.dispose()
  }
  const dispose = () => {
    ptyHost.off('message', handleMessage)
    socket.off('close', handleClose)
  }
  ptyHost.on('message', handleMessage)
  socket.on('close', handleClose)
  return {
    ptyHost,
    socket,
    handleMessage,
    handleClose,
    dispose,
  }
}

export const create = async (socket, id, cwd, command, args) => {
  try {
    Assert.object(socket)
    Assert.number(id)
    Assert.string(cwd)
    // TODO race condition because of await
    const ptyHost = await PtyHost.getOrCreate()
    const terminal = createTerminal(ptyHost, socket)
    TerminalState.add(id, terminal)
    // TODO use invoke
    ptyHost.send({
      jsonrpc: JsonRpcVersion.Two,
      method: 'Terminal.create',
      params: [id, cwd, command, args],
    })
  } catch (error) {
    throw new VError(error, `Failed to create terminal`)
  }
}

export const write = (id, data) => {
  Assert.number(id)
  Assert.string(data)
  const ptyHost = PtyHost.getCurrentInstance()
  if (!ptyHost) {
    console.log('[shared-process] pty host not ready')
    return
  }
  // TODO should use invoke
  ptyHost.send({
    jsonrpc: JsonRpcVersion.Two,
    method: 'Terminal.write',
    params: [id, data],
  })
}

export const resize = (state, columns, rows) => {
  // state.pty.resize(columns, rows)
}

export const dispose = async (id) => {
  const terminal = TerminalState.get(id)
  terminal.dispose()
  TerminalState.remove(id)
  const ptyHost = await PtyHost.getOrCreate()
  // TODO use invoke
  ptyHost.send({
    jsonrpc: JsonRpcVersion.Two,
    method: 'Terminal.dispose',
    params: [id],
  })
}

export const disposeAll = () => {
  PtyHost.disposeAll()
}
