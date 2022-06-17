import { spawn } from 'node-pty'
import * as Platform from '../Platform/Platform.js'
import * as Assert from '../Assert/Assert.js'

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
  const spawnOptions = getSpawnOptions()
  const pty = spawn(spawnOptions.command, spawnOptions.args, {
    encoding: null,
    cwd,
    // cols: 10,
    // rows: 10,
  })
  return pty
}

export const onData = (pty, fn) => {
  Assert.object(pty)
  pty.onData(fn)
}

export const write = (pty, data) => {
  Assert.object(pty)
  pty.write(data)
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
