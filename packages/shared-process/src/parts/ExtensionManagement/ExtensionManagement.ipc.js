import * as ExtensionHostIconTheme from '../ExtensionManagement/ExtensionManagementIconTheme.js'
import * as ExtensionManagement from './ExtensionManagement.js'
import * as ExtensionHostColorTheme from './ExtensionManagementColorTheme.js'
import * as ExtensionHostLanguages from './ExtensionManagementLanguages.js'

// prettier-ignore
export const Commands = {
  'ExtensionManagement.install': ExtensionManagement.install,
  'ExtensionManagement.uninstall': ExtensionManagement.uninstall,
  'ExtensionManagement.enable': ExtensionManagement.enable,
  'ExtensionManagement.disable': ExtensionManagement.disable,
  'ExtensionManagement.getAllExtensions': ExtensionManagement.getAllExtensions,
  'ExtensionManagement.getExtensions': ExtensionManagement.getExtensions,
  'ExtensionHost.getColorThemeJson': ExtensionHostColorTheme.getColorThemeJson,
  'ExtensionHost.getColorThemeNames': ExtensionHostColorTheme.getColorThemeNames,
  'ExtensionHost.getLanguages': ExtensionHostLanguages.getLanguages,
  'ExtensionHost.getLanguageConfiguration': ExtensionHostLanguages.getLanguageConfiguration,
  'ExtensionHost.getIconThemeJson': ExtensionHostIconTheme.getIconTheme,
}
