const Assert = require('../Assert/Assert.js')
const { fork } = require('node:child_process')

exports.create = async ({ path, argv, env, execArgv, stdio }) => {
  Assert.string(path)
  const actualArgv = ['--ipc-type=node-forked-process', ...argv]
  const childProcess = fork(path, actualArgv, {
    env,
    execArgv,
    stdio,
  })
  return childProcess
}

exports.wrap = (childProcess) => {
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
  }
}
