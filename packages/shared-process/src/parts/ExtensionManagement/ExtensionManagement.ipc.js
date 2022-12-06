import * as ExtensionHostIconTheme from '../ExtensionManagement/ExtensionManagementIconTheme.js'
import * as ExtensionManagement from './ExtensionManagement.js'
import * as ExtensionHostColorTheme from './ExtensionManagementColorTheme.js'
import * as ExtensionHostLanguages from './ExtensionManagementLanguages.js'

// prettier-ignore
export const Commands = {
  'ExtensionHostColorTheme.getColorThemeJson': ExtensionHostColorTheme.getColorThemeJson,
  'ExtensionHostColorTheme.getColorThemeNames': ExtensionHostColorTheme.getColorThemeNames,
  'ExtensionHostIconTheme.getIconThemeJson': ExtensionHostIconTheme.getIconTheme,
  'ExtensionHostLanguages.getLanguageConfiguration': ExtensionHostLanguages.getLanguageConfiguration,
  'ExtensionHostLanguages.getLanguages': ExtensionHostLanguages.getLanguages,
  'ExtensionHostColorTheme.watchColorTheme':ExtensionHostColorTheme.watch,
  'ExtensionManagement.disable': ExtensionManagement.disable,
  'ExtensionManagement.enable': ExtensionManagement.enable,
  'ExtensionManagement.getAllExtensions': ExtensionManagement.getExtensions,
  'ExtensionManagement.getExtensions': ExtensionManagement.getExtensions,
  'ExtensionManagement.install': ExtensionManagement.install,
  'ExtensionManagement.uninstall': ExtensionManagement.uninstall,
}
