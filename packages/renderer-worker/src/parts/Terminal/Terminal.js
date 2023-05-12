import * as TerminalProcess from '../TerminalProcess/TerminalProcess.js'

export const create = async (id, cwd) => {
  await TerminalProcess.listen()
  await TerminalProcess.invoke('Terminal.create', id, cwd)
}

export const write = async (id, input) => {
  await TerminalProcess.invoke('Terminal.write', id, input)
}

export const resize = async (id, columns, rows) => {
  await TerminalProcess.invoke('Terminal.resize', id, columns, rows)
}

export const clear = async (id) => {
  // TODO
}
