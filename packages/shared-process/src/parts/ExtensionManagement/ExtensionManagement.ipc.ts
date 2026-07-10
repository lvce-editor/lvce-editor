import * as ExtensionHostIconTheme from '../ExtensionManagement/ExtensionManagementIconTheme.ts'
import * as WatchForHotReload from '../WatchForHotReload/WatchForHotReload.ts'
import * as ExtensionManagement from './ExtensionManagement.ts'
import * as ExtensionHostColorTheme from './ExtensionManagementColorTheme.ts'
import * as ExtensionHostLanguages from './ExtensionManagementLanguages.ts'

// prettier-ignore
export const Commands = {
  'ExtensionHost.getColorThemeJson': ExtensionHostColorTheme.getColorThemeJson,
  'ExtensionHost.getColorThemeNames': ExtensionHostColorTheme.getColorThemeNames,
  'ExtensionHost.getIconThemeJson': ExtensionHostIconTheme.getIconTheme,
  'ExtensionHost.getLanguageConfiguration': ExtensionHostLanguages.getLanguageConfiguration,
  'ExtensionHost.getLanguages': ExtensionHostLanguages.getLanguages,
  'ExtensionHost.getWebViews': ExtensionHostLanguages.getWebViews,
  'ExtensionHost.watchColorTheme': ExtensionHostColorTheme.watch,
  'ExtensionHost.watchForHotReload': WatchForHotReload.watchForHotReload,
  'ExtensionManagement.disable': ExtensionManagement.disable,
  'ExtensionManagement.enable': ExtensionManagement.enable,
  'ExtensionManagement.getAllExtensions': ExtensionManagement.getExtensions,
  'ExtensionManagement.getExtensions': ExtensionManagement.getExtensions,
  'ExtensionManagement.getExtensionsEtag': ExtensionManagement.getExtensionsEtag,
  'ExtensionManagement.uninstall': ExtensionManagement.uninstall,
}
