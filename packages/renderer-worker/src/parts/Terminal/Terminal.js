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
  if (_separateConnection) {
    await TerminalProcess.invoke('Terminal.dispose', id)
  } else {
    await SharedProcess.invoke('Terminal.dispose', id)
  }
}

export const write = async (id, input) => {
  if (_separateConnection) {
    await TerminalProcess.send('Terminal.write', id, input)
  } else {
    await SharedProcess.invoke('Terminal.write', id, input)
  }
}

export const resize = async (id, columns, rows) => {
  if (_separateConnection) {
    await TerminalProcess.invoke('Terminal.resize', id, columns, rows)
  } else {
    await SharedProcess.invoke('Terminal.resize', id, columns, rows)
  }
}

export const clear = async (id) => {
  // TODO
}
