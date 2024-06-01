import * as HandleIpc from '../HandleIpc/HandleIpc.js'
import * as IpcParent from '../IpcParent/IpcParent.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'
import * as IsElectron from '../IsElectron/IsElectron.js'
import * as GetTypeScriptPath from '../GetTypeScriptPath/GetTypeScriptPath.js'
import * as JsonRpc from '../JsonRpc/JsonRpc.js'

export const launchTypeScriptCompileProcess = async () => {
  const method = IsElectron.isElectron ? IpcParentType.ElectronUtilityProcess : IpcParentType.NodeForkedProcess
  const TypeScriptCompileProcessPath = await import('../TypeScriptCompileProcessPath/TypeScriptCompileProcessPath.js')
  const typescriptCompileProcess = await IpcParent.create({
    method,
    path: TypeScriptCompileProcessPath.typescriptCompileProcessPath,
    argv: [],
    stdio: 'inherit',
    name: 'TypeScript Compile Process',
  })
  HandleIpc.handleIpc(typescriptCompileProcess)
  const typeScriptPath = GetTypeScriptPath.getTypeScriptUri()
  await JsonRpc.invoke(typescriptCompileProcess, 'TypeScript.setTypeScriptPath', typeScriptPath)
  return typescriptCompileProcess
}
