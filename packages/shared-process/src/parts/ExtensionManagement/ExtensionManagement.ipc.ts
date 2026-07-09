import * as ExtensionHostIconTheme from '../ExtensionManagement/ExtensionManagementIconTheme.ts'
import * as ExtensionManagement from './ExtensionManagement.ts'
import * as ExtensionHostColorTheme from './ExtensionManagementColorTheme.ts'
import * as ExtensionHostLanguages from './ExtensionManagementLanguages.ts'
import * as WatchForHotReload from '../WatchForHotReload/WatchForHotReload.ts'

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
  'ExtensionManagement.getExtensionsEtag': ExtensionManagement.getExtensionsEtag,
  'ExtensionHost.watchForHotReload': WatchForHotReload.watchForHotReload,
}
