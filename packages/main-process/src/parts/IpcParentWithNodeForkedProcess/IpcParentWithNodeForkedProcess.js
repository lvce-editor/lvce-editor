const Assert = require('../Assert/Assert.js')
const { fork } = require('node:child_process')

exports.create = async ({ path, argv, env, execArgv }) => {
  Assert.string(path)
  const childProcess = fork(path, argv, {
    env,
    execArgv,
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
