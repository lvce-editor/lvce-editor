import * as Assert from '../Assert/Assert.ts'
import { JsonRpcEvent } from '../JsonRpc/JsonRpc.ts'
import * as PtyHost from '../PtyHost/PtyHost.ts'
import * as TerminalState from '../TerminalState/TerminalState.ts'
import { VError } from '../VError/VError.ts'

const createTerminal = (ptyHost: any, socket: any): any => {
  const handleMessage = (message: any): any => {
    socket.send(message)
  }
  const handleClose = (): any => {
    // socket.off('close', handleClose)
    ptyHost.off('message', handleMessage)
    ptyHost.dispose()
  }
  const dispose = (): any => {
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

export const create = async (ipc: any, id: any, cwd: any, command: any, args: any): Promise<any> => {
  try {
    Assert.object(ipc)
    Assert.number(id)
    Assert.string(cwd)
    // TODO race condition because of await
    const ptyHost = await PtyHost.getOrCreate()
    const terminal = createTerminal(ptyHost, ipc)
    TerminalState.add(id, terminal)
    // TODO improve ipc error handling and await promise
    // current can't await promise because when process exits
    // because of native module error, promise is not resolved
    // causing application which waits on this promise to hang
    PtyHost.invoke('Terminal.create', id, cwd, command, args)
  } catch (error) {
    throw new VError(error, `Failed to create terminal`)
  }
}

export const write = (id: any, data: any): any => {
  Assert.number(id)
  Assert.string(data)
  const ptyHost = PtyHost.getCurrentInstance()
  if (!ptyHost) {
    console.log('[shared-process] pty host not ready')
    return
  }
  // TODO should use invoke
  const message = JsonRpcEvent.create('Terminal.write', [id, data])
  ptyHost.send(message)
}

export const resize = (state: any, columns: any, rows: any): any => {
  // state.pty.resize(columns, rows)
}

export const dispose = async (id: any): Promise<any> => {
  const terminal = TerminalState.get(id)
  terminal.dispose()
  TerminalState.remove(id)
  const ptyHost = await PtyHost.getOrCreate()
  const message = JsonRpcEvent.create('Terminal.dispose', [id])
  // TODO use invoke
  ptyHost.send(message)
}

export const disposeAll = (): any => {
  PtyHost.disposeAll()
}
