import { spawn } from 'node-pty'
import VError from 'verror'
import * as Assert from '../Assert/Assert.js'

export const create = ({ env = {}, cwd, command, args } = {}) => {
  try {
    Assert.string(cwd)
    Assert.string(command)
    Assert.array(args)
    const pty = spawn(command, args, {
      encoding: null,
      cwd,
      // cols: 10,
      // rows: 10,
    })
    return pty
  } catch (error) {
    // @ts-ignore
    throw new VError(error, `Failed to create terminal`)
  }
}

export const onData = (pty, fn) => {
  Assert.object(pty)
  pty.onData(fn)
}

export const write = (pty, data) => {
  try {
    Assert.object(pty)
    pty.write(data)
  } catch (error) {
    // @ts-ignore
    throw new VError(error, `Failed to write data to terminal`)
  }
}

export const resize = (pty, columns, rows) => {
  Assert.object(pty)
  Assert.number(columns)
  Assert.number(rows)
  pty.resize(columns, rows)
}

export const dispose = (pty) => {
  pty.kill()
}
