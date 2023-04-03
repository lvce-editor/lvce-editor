const Assert = require('../Assert/Assert.js')
const { utilityProcess } = require('electron')
const GetFirstUtilityProcessEvent = require('../GetFirstUtilityProcessEvent/GetFirstUtilityProcessEvent.js')

exports.create = async ({ path, argv, env, execArgv }) => {
  Assert.string(path)
  const process = utilityProcess.fork(path, argv, {
    env,
    execArgv,
  })
  const { type, event } = await GetFirstUtilityProcessEvent.getFirstUtilityProcessEvent(process)
  return process
}

exports.wrap = (process) => {
  return {
    process,
    on(event, listener) {
      this.process.on(event, listener)
    },
    send(message) {
      this.process.postMessage(message)
    },
    sendAndTransfer(message, transfer) {
      this.process.postMessage(message, transfer)
    },
    dispose() {
      this.process.kill()
    },
  }
}
