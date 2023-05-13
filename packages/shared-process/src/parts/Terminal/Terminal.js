import * as Assert from '../Assert/Assert.js'
import * as JsonRpcVersion from '../JsonRpcVersion/JsonRpcVersion.js'
import * as PtyHost from '../PtyHost/PtyHost.js'

export const state = {
  socketMap: Object.create(null),
}

export const create = async (socket, id, cwd) => {
  Assert.object(socket)
  Assert.number(id)
  Assert.string(cwd)
  // TODO dispose entry
  state.socketMap[id] = socket
  const ptyHost = await PtyHost.getOrCreate()

  const handleMessage = (message) => {
    socket.send(message)
  }
  const handleClose = () => {
    // socket.off('close', handleClose)
    ptyHost.off('message', handleMessage)
    ptyHost.dispose()
  }
  ptyHost.on('message', handleMessage)
  socket.on('close', handleClose)

  // TODO use invoke
  ptyHost.send({
    jsonrpc: JsonRpcVersion.Two,
    method: 'Terminal.create',
    params: [id, cwd],
  })
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
