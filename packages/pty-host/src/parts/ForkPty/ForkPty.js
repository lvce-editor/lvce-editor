import { spawn } from 'node-pty'
import * as Platform from '../Platform/Platform.js'
import * as Assert from '../Assert/Assert.js'
import VError from 'verror'
import { forkPtyAndExecvp } from 'fork-pty'
import { ReadStream } from 'tty'

const getSpawnOptions = () => {
  if (Platform.isWindows) {
    return {
      command: 'powershell.exe',
      args: [],
    }
  }
  return {
    command: 'bash',
    args: ['bash', '-i'],
  }
}

export const create = ({ env = {}, cwd } = {}) => {
  try {
    Assert.string(cwd)
    const spawnOptions = getSpawnOptions()
    const pty = forkPtyAndExecvp(spawnOptions.command, spawnOptions.args)
    return pty
  } catch (error) {
    // @ts-ignore
    throw new VError(error, `Failed to create terminal`)
  }
}

let stream

export const onData = (pty, fn) => {
  Assert.object(pty)
  stream = new ReadStream(pty.fd)
  stream.on('data', fn)
}

export const write = (pty, data) => {
  try {
    // Assert.object(pty)
    stream.write(data)
  } catch (error) {
    // @ts-ignore
    throw new VError(error, `Failed to write data to terminal`)
  }
}

export const resize = (pty, columns, rows) => {
  Assert.object(pty)
  Assert.number(columns)
  Assert.number(rows)
  // pty.resize(columns, rows)
}

export const dispose = (pty) => {
  // pty.kill()
}
