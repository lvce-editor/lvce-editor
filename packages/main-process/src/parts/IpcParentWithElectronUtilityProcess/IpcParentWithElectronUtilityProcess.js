import { utilityProcess } from 'electron'
import * as Assert from '../Assert/Assert.cjs'
import * as CamelCase from '../CamelCase/CamelCase.js'
import * as FirstNodeWorkerEventType from '../FirstNodeWorkerEventType/FirstNodeWorkerEventType.js'
import * as GetFirstUtilityProcessEvent from '../GetFirstUtilityProcessEvent/GetFirstUtilityProcessEvent.js'
import { IpcError } from '../IpcError/IpcError.js'
import * as Path from '../Path/Path.cjs'
import * as Root from '../Root/Root.cjs'
import * as UtilityProcessState from '../UtilityProcessState/UtilityProcessState.js'

export const create = async ({ path, argv = [], execArgv = [], name }) => {
  Assert.string(path)
  const utilityProcessEntryPoint = Path.join(
    Root.root,
    'packages',
    'main-process',
    'src',
    'parts',
    'UtilityProcessEntryPoint',
    'UtilityProcessEntryPoint.cjs',
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

export const effects = ({ rawIpc, name }) => {
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

export const wrap = (process) => {
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
