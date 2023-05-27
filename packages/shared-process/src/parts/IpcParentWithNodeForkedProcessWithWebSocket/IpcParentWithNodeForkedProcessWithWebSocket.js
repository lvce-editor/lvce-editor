import { fork } from 'node:child_process'
import * as Assert from '../Assert/Assert.js'
import { VError } from '../VError/VError.js'
import * as IsSocket from '../IsSocket/IsSocket.js'
import { IpcError } from '../IpcError/IpcError.js'

export const create = async ({ path, argv = [], env, execArgv = [], stdio = 'inherit', name = 'child process', message, handle }) => {
  try {
    Assert.string(path)
    Assert.object(message)
    if (!IsSocket.isSocket(handle)) {
      throw new IpcError(`handle must be of type Socket`)
    }
    const actualArgv = ['--ipc-type=websocket', '--max-old-space-size=60', ...argv]
    const childProcess = fork(path, actualArgv, {
      env,
      execArgv,
      stdio: 'pipe',
    })
    if (stdio === 'inherit' && childProcess.stdout && childProcess.stderr) {
      childProcess.stdout.pipe(process.stdout)
      childProcess.stderr.pipe(process.stderr)
    }
    childProcess.send(message, handle)
    return childProcess
  } catch (error) {
    throw new VError(error, `Failed to launch ${name}`)
  }
}

export const wrap = (childProcess) => {
  return {
    childProcess,
    on(event, listener) {
      this.childProcess.on(event, listener)
    },
    off(event, listener) {
      this.childProcess.off(event, listener)
    },
    send(message) {
      this.childProcess.send(message)
    },
    sendAndTransfer(message, handle) {
      this.childProcess.send(message, handle)
    },
    dispose() {
      this.childProcess.kill()
    },
  }
}
