const { IpcError } = require('../IpcError/IpcError.js')
const { utilityProcess } = require('electron')
const Assert = require('../Assert/Assert.cjs')
const CamelCase = require('../CamelCase/CamelCase.js')
const FirstNodeWorkerEventType = require('../FirstNodeWorkerEventType/FirstNodeWorkerEventType.js')
const GetFirstUtilityProcessEvent = require('../GetFirstUtilityProcessEvent/GetFirstUtilityProcessEvent.js')
const Path = require('../Path/Path.js')
const Root = require('../Root/Root.js')
const UtilityProcessState = require('../UtilityProcessState/UtilityProcessState.js')

exports.create = async ({ path, argv = [], execArgv = [], name = 'electron-utility-process' }) => {
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
    serviceName: name,
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

exports.effects = ({ rawIpc, name = 'electron-utility-process' }) => {
  if (!rawIpc.pid) {
    return
  }
  const camelCaseName = CamelCase.camelCase(name)
  UtilityProcessState.add(rawIpc.pid, camelCaseName)
  const cleanup = () => {
    UtilityProcessState.remove(rawIpc.pid)
    rawIpc.off('exit', handleExit)
  }
  const handleExit = () => {
    cleanup()
  }
  rawIpc.on('exit', handleExit)
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
