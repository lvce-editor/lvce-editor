import * as HandleIpc from '../HandleIpc/HandleIpc.js'
import * as IpcParent from '../IpcParent/IpcParent.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'
import * as IsElectron from '../IsElectron/IsElectron.js'
import * as TypeScriptCompileProcessPath from '../TypeScriptCompileProcessPath/TypeScriptCompileProcessPath.js'

export const launchTypeScriptCompileProcess = async () => {
  const method = IsElectron.isElectron ? IpcParentType.ElectronUtilityProcess : IpcParentType.NodeForkedProcess
  const typescriptCompileProcess = await IpcParent.create({
    method,
    path: TypeScriptCompileProcessPath.typescriptCompileProcessPath,
    argv: [],
    stdio: 'inherit',
    name: 'TypeScript Compile Process',
  })
  HandleIpc.handleIpc(typescriptCompileProcess)
  return typescriptCompileProcess
}
