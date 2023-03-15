import * as SharedProcess from '../SharedProcess/SharedProcess.js'
import * as SharedProcessCommandType from '../SharedProcessCommandType/SharedProcessCommandType.js'

export const install = (id) => {
  return SharedProcess.invoke(SharedProcessCommandType.InstallExtensionInstallExtension, /* id */ id)
}
