import * as Command from '../Command/Command.js'
import * as ExtensionManagement from './ExtensionManagement.js'

export const __initialize__ = () => {
  Command.register('ExtensionManagement.install', ExtensionManagement.install)
  Command.register('ExtensionManagement.uninstall', ExtensionManagement.uninstall)
  Command.register('ExtensionManagement.enable', ExtensionManagement.enable)
  Command.register('ExtensionManagement.disable', ExtensionManagement.disable)
  Command.register('ExtensionManagement.getAllExtensions', ExtensionManagement.getAllExtensions)
  Command.register('ExtensionManagement.getExtensions', ExtensionManagement.getExtensions)
}
