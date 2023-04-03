const Assert = require('../Assert/Assert.js')
const { utilityProcess } = require('electron')
const GetFirstUtilityProcessEvent = require('../GetFirstUtilityProcessEvent/GetFirstUtilityProcessEvent.js')
const FirstNodeWorkerEventType = require('../FirstNodeWorkerEventType/FirstNodeWorkerEventType.js')

exports.create = async ({ path, argv, execArgv = [] }) => {
  Assert.string(path)
  const childProcess = utilityProcess.fork(path, argv, {
    execArgv,
    stdio: 'pipe',
  })
  // @ts-ignore
  childProcess.stdout.pipe(process.stdout)
  // @ts-ignore
  childProcess.stderr.pipe(process.stderr)
  const { type, event } = await GetFirstUtilityProcessEvent.getFirstUtilityProcessEvent(childProcess)
  if (type === FirstNodeWorkerEventType.Exit) {
    throw new Error(`utility process exited before ipc connection was established`)
  }
  return childProcess
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
