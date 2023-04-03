const Assert = require('../Assert/Assert.js')
const { utilityProcess } = require('electron')
const GetFirstUtilityProcessEvent = require('../GetFirstUtilityProcessEvent/GetFirstUtilityProcessEvent.js')
const FirstNodeWorkerEventType = require('../FirstNodeWorkerEventType/FirstNodeWorkerEventType.js')

exports.create = async ({ path, argv, env, execArgv }) => {
  Assert.string(path)
  const process = utilityProcess.fork(path, argv, {
    env,
    execArgv,
    stdio: 'pipe',
  })
  // @ts-ignore
  process.stdout.pipe(childProcess.stdout)
  // @ts-ignore
  process.stderr.pipe(childProcess.stderr)
  const { type, event } = await GetFirstUtilityProcessEvent.getFirstUtilityProcessEvent(process)
  if (type === FirstNodeWorkerEventType.Exit) {
    throw new Error(`utility process exited before ipc connection was established`)
  }
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
