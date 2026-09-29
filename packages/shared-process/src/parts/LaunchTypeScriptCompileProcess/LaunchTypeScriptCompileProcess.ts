import * as GetTypeScriptPath from '../GetTypeScriptPath/GetTypeScriptPath.ts'
import * as HandleIpc from '../HandleIpc/HandleIpc.ts'
import * as IpcId from '../IpcId/IpcId.ts'
import * as IpcParent from '../IpcParent/IpcParent.ts'
import * as IpcParentType from '../IpcParentType/IpcParentType.ts'
import * as IsElectron from '../IsElectron/IsElectron.ts'
import * as JsonRpc from '../JsonRpc/JsonRpc.ts'

export const launchTypeScriptCompileProcess = async (): Promise<any> => {
  const method = IsElectron.isElectron ? IpcParentType.ElectronUtilityProcess : IpcParentType.NodeForkedProcess
  const TypeScriptCompileProcessPath = await import('../TypeScriptCompileProcessPath/TypeScriptCompileProcessPath.ts')
  const typescriptCompileProcess = await IpcParent.create({
    argv: [],
    execArgv: ['--disable-warning=ExperimentalWarnings'], // TODO remove this when stripTypes is stable
    ipcId: IpcId.SharedProcess,
    method,
    name: 'TypeScript Compile Process',
    path: TypeScriptCompileProcessPath.typescriptCompileProcessPath,
    stdio: 'inherit',
    targetRpcId: IpcId.TypescriptCompileProcess,
  })
  HandleIpc.handleIpc(typescriptCompileProcess)
  const typeScriptPath = GetTypeScriptPath.getTypeScriptUri()
  await JsonRpc.invoke(typescriptCompileProcess, 'TypeScript.setTypeScriptPath', typeScriptPath)
  return typescriptCompileProcess
}
