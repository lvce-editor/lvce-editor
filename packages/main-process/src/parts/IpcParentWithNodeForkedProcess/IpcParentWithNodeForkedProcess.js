import { fork } from 'node:child_process'
import * as Assert from '../Assert/Assert.js'

/**
 *
 * @param {{path:string, argv?:string[], env?:any, execArgv?:string[], stdio?:'inherit'}} param0
 * @returns
 */
export const create = async ({ path, argv = [], env = process.env, execArgv = [], stdio = 'inherit' }) => {
  Assert.string(path)
  const actualArgv = ['--ipc-type=node-forked-process', ...argv]
  const childProcess = fork(path, actualArgv, {
    env,
    execArgv,
    stdio,
  })
  return childProcess
}

export const wrap = (childProcess) => {
  return {
    childProcess,
    on(event, listener) {
      this.childProcess.on(event, listener)
    },
    send(message) {
      this.childProcess.send(message)
    },
    sendAndTransfer(message, transfer) {
      throw new Error('transfer is not supported')
    },
    dispose() {
      this.childProcess.kill()
    },
    pid: childProcess.pid,
  }
}
