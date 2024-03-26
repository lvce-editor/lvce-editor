import * as TerminalProcess from '../TerminalProcess/TerminalProcess.js'
import * as SharedProcess from '../SharedProcess/SharedProcess.js'

let _separateConnection = false

export const create = async (separateConnection, id, cwd, command, args) => {
  _separateConnection = separateConnection
  if (separateConnection) {
    await TerminalProcess.listen()
    await TerminalProcess.invoke('Terminal.create', id, cwd, command, args)
  } else {
    await SharedProcess.invoke('Terminal.create', id, cwd, command, args)
  }
}

export const dispose = async (id) => {
  await (_separateConnection ? TerminalProcess.invoke('Terminal.dispose', id) : SharedProcess.invoke('Terminal.dispose', id))
}

export const write = async (id, input) => {
  await (_separateConnection ? TerminalProcess.send('Terminal.write', id, input) : SharedProcess.invoke('Terminal.write', id, input))
}

export const resize = async (id, columns, rows) => {
  await (_separateConnection
    ? TerminalProcess.invoke('Terminal.resize', id, columns, rows)
    : SharedProcess.invoke('Terminal.resize', id, columns, rows))
}

export const clear = async (id) => {
  // TODO
}
