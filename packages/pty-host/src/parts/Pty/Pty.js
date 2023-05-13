import { spawn } from 'node-pty'
import * as Platform from '../Platform/Platform.js'
import * as Assert from '../Assert/Assert.js'
import VError from 'verror'

const getSpawnOptions = () => {
  if (Platform.isWindows) {
    return {
      command: 'powershell.exe',
      args: [],
    }
  }
  return {
    command: 'bash',
    args: ['-i'],
  }
}

export const create = ({ env = {}, cwd } = {}) => {
  try {
    console.log({ cwd })
    Assert.string(cwd)
    const spawnOptions = getSpawnOptions()
    const pty = spawn(spawnOptions.command, spawnOptions.args, {
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
