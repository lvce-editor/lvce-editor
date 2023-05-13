import * as Assert from '../Assert/Assert.js'
import { fork } from 'node:child_process'
import * as GetFirstNodeChildProcessEvent from '../GetFirstNodeChildProcessEvent/GetFirstNodeChildProcessEvent.js'
import * as FirstNodeWorkerEventType from '../FirstNodeWorkerEventType/FirstNodeWorkerEventType.js'
import { ChildProcessError } from '../ChildProcessError/ChildProcessError.js'
import { VError } from '../VError/VError.js'

export const create = async ({ path, argv = [], env, execArgv = [], stdio = 'inherit', name = 'child process' }) => {
  try {
    Assert.string(path)
    const childProcess = fork(path, argv, {
      env,
      execArgv,
      stdio: 'pipe',
    })
    const { type, event, stdout, stderr } = await GetFirstNodeChildProcessEvent.getFirstNodeChildProcessEvent(childProcess)
    if (type === FirstNodeWorkerEventType.Exit) {
      throw new ChildProcessError(stderr)
    }
    if (type === FirstNodeWorkerEventType.Error) {
      throw new Error(`child process had an error ${event}`)
    }
    if (stdio === 'inherit' && childProcess.stdout && childProcess.stderr) {
      childProcess.stdout.pipe(process.stdout)
      childProcess.stderr.pipe(process.stderr)
    }
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
