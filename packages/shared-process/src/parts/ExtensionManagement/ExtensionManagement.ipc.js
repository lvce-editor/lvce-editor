import * as ExtensionHostIconTheme from '../ExtensionManagement/ExtensionManagementIconTheme.js'
import * as ExtensionManagement from './ExtensionManagement.js'
import * as ExtensionHostColorTheme from './ExtensionManagementColorTheme.js'
import * as ExtensionHostLanguages from './ExtensionManagementLanguages.js'

// prettier-ignore
export const Commands = {
  'ExtensionHost.getColorThemeJson': ExtensionHostColorTheme.getColorThemeJson,
  'ExtensionHost.getColorThemeNames': ExtensionHostColorTheme.getColorThemeNames,
  'ExtensionHost.getIconThemeJson': ExtensionHostIconTheme.getIconTheme,
  'ExtensionHost.getLanguageConfiguration': ExtensionHostLanguages.getLanguageConfiguration,
  'ExtensionHost.getLanguages': ExtensionHostLanguages.getLanguages,
  'ExtensionHost.getWebViews': ExtensionHostLanguages.getWebViews,
  'ExtensionHost.watchColorTheme': ExtensionHostColorTheme.watch,
  'ExtensionManagement.disable': ExtensionManagement.disable,
  'ExtensionManagement.enable': ExtensionManagement.enable,
  'ExtensionManagement.getAllExtensions': ExtensionManagement.getExtensions,
  'ExtensionManagement.getExtensions': ExtensionManagement.getExtensions,
  'ExtensionManagement.uninstall': ExtensionManagement.uninstall,
}
