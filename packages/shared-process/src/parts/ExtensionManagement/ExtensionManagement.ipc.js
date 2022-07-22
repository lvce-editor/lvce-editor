import * as Command from '../Command/Command.js'
import * as ExtensionHostColorTheme from './ExtensionManagementColorTheme.js'
import * as ExtensionHostIconTheme from '../ExtensionManagement/ExtensionManagementIconTheme.js'
import * as ExtensionHostLanguages from './ExtensionManagementLanguages.js'
import * as ExtensionManagement from './ExtensionManagement.js'

// prettier-ignore
export const __initialize__ = () => {
  Command.register('ExtensionManagement.install', ExtensionManagement.install)
  Command.register('ExtensionManagement.uninstall', ExtensionManagement.uninstall)
  Command.register('ExtensionManagement.enable', ExtensionManagement.enable)
  Command.register('ExtensionManagement.disable', ExtensionManagement.disable)
  Command.register('ExtensionManagement.getAllExtensions', ExtensionManagement.getAllExtensions)
  Command.register('ExtensionManagement.getExtensions', ExtensionManagement.getExtensions)

  Command.register('ExtensionHost.getColorThemeJson', ExtensionHostColorTheme.getColorThemeJson)
  Command.register('ExtensionHost.getColorThemeNames', ExtensionHostColorTheme.getColorThemeNames)

  Command.register('ExtensionHost.getLanguages', ExtensionHostLanguages.getLanguages)
  Command.register('ExtensionHost.getLanguageConfiguration', ExtensionHostLanguages.getLanguageConfiguration)
  Command.register('ExtensionHost.getIconThemeJson', ExtensionHostIconTheme.getIconTheme)
}
