const { IpcError } = require('../IpcError/IpcError.js')
const { utilityProcess } = require('electron')
const Assert = require('../Assert/Assert.js')
const FirstNodeWorkerEventType = require('../FirstNodeWorkerEventType/FirstNodeWorkerEventType.js')
const GetFirstUtilityProcessEvent = require('../GetFirstUtilityProcessEvent/GetFirstUtilityProcessEvent.js')
const Path = require('../Path/Path.js')
const Root = require('../Root/Root.js')

const RE_JS_FILE_EXTENSION = /\.js$/

exports.create = async ({ path, argv = [], execArgv = [] }) => {
  Assert.string(path)
  const utilityProcessEntryPoint = Path.join(
    Root.root,
    'packages',
    'main-process',
    'src',
    'parts',
    'UtilityProcessEntryPoint',
    'UtilityProcessEntryPoint.js'
  )
  const actualArgv = [path, '--ipc-type=electron-utility-process', ...argv]
  const childProcess = utilityProcess.fork(utilityProcessEntryPoint, actualArgv, {
    execArgv,
    stdio: 'pipe',
  })
  // @ts-ignore
  childProcess.stdout.pipe(process.stdout)
  const { type, event, stdout, stderr } = await GetFirstUtilityProcessEvent.getFirstUtilityProcessEvent(childProcess)
  if (type === FirstNodeWorkerEventType.Exit) {
    throw new IpcError(`Utility process exited before ipc connection was established`, stdout, stderr)
  }
  // @ts-ignore
  childProcess.stderr.pipe(process.stderr)
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
      Assert.array(transfer)
      this.process.postMessage(message, transfer)
    },
    dispose() {
      this.process.kill()
    },
  }
}
