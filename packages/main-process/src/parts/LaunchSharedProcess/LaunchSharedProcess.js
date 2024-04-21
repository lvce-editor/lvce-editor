import * as ExitCode from '../ExitCode/ExitCode.js'
import * as GetPortTuple from '../GetPortTuple/GetPortTuple.js'
import * as GetSharedProcessArgv from '../GetSharedProcessArgv/GetSharedProcessArgv.js'
import * as HandleIpc from '../HandleIpc/HandleIpc.js'
import * as IpcChild from '../IpcChild/IpcChild.js'
import * as IpcChildType from '../IpcChildType/IpcChildType.js'
import * as IpcParent from '../IpcParent/IpcParent.js'
import * as JsonRpc from '../JsonRpc/JsonRpc.js'
import * as Logger from '../Logger/Logger.js'
import * as Performance from '../Performance/Performance.js'
import * as PerformanceMarkerType from '../PerformanceMarkerType/PerformanceMarkerType.js'
import * as Platform from '../Platform/Platform.js'
import * as Process from '../Process/Process.js'
import * as SharedProcessState from '../SharedProcessState/SharedProcessState.js'

const handleChildError = (error) => {
  Process.exit(ExitCode.Error)
}

const handleChildExit = (code) => {
  Logger.info(`[main process] shared process exited with code ${code}`)
  Process.exit(code)
}

const handleChildDisconnect = () => {
  Logger.info('[main process] shared process disconnected')
}

export const launchSharedProcess = async ({ method, env = {} }) => {
  Performance.mark(PerformanceMarkerType.WillStartSharedProcess)
  const sharedProcessPath = Platform.getSharedProcessPath()
  const execArgv = GetSharedProcessArgv.getSharedProcessArgv()
  const fullEnv = {
    ...process.env,
    ...env,
  }
  if (!Platform.isProduction) {
    // fullEnv['NODE_OPTIONS'] = '--import=@swc-node/register/esm-register'
  }
  const sharedProcess = await IpcParent.create({
    method,
    env: fullEnv,
    argv: [],
    execArgv,
    path: sharedProcessPath,
    name: 'shared-process',
  })
  sharedProcess._rawIpc.on('error', handleChildError)
  sharedProcess._rawIpc.on('exit', handleChildExit)
  sharedProcess._rawIpc.on('disconnect', handleChildDisconnect)
  HandleIpc.handleIpc(sharedProcess)

  // create secondary ipc to support transferring objects
  // from shared process to main process
  // TODO let shared process ask for secondary
  // ipc instead of sending it directly?
  const { port1, port2 } = GetPortTuple.getPortTuple()
  const childIpc = await IpcChild.listen({
    method: IpcChildType.ElectronMessagePort,
    messagePort: port1,
  })
  HandleIpc.handleIpc(childIpc)
  await JsonRpc.invokeAndTransfer(sharedProcess, [port2], 'HandleElectronMessagePort.handleElectronMessagePort', -5)
  SharedProcessState.state.sharedProcess = sharedProcess
  Performance.mark(PerformanceMarkerType.DidStartSharedProcess)
  return sharedProcess
}
