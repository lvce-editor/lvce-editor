import * as Command from '../Command/Command.js'
import * as Platform from '../Platform/Platform.js'

export const __initialize__ = () => {
  Command.register('Platform.getConfigDir', Platform.getConfigDir)
  Command.register('Platform.getAppDir', Platform.getAppDir)
  Command.register('Platform.getHomeDir', Platform.getHomeDir)
  Command.register('Platform.getDataDir', Platform.getDataDir)
  Command.register('Platform.getExtensionsPath', Platform.getExtensionsPath)
  Command.register('Platform.getBuiltinExtensionsPath', Platform.getBuiltinExtensionsPath)
  Command.register('Platform.getDisabledExtensionsPath', Platform.getDisabledExtensionsPath)
  Command.register('Platform.getCachedExtensionsPath', Platform.getCachedExtensionsPath)
  Command.register('Platform.getMarketplaceUrl', Platform.getMarketplaceUrl)
  Command.register('Platform.getLogsDir', Platform.getLogsDir)
  Command.register('Platform.getUserSettingsPath', Platform.getUserSettingsPath)
  Command.register('Platform.getRecentlyOpenedPath', Platform.getRecentlyOpenedPath)
  Command.register('Platform.getCacheDir', Platform.getCacheDir)
}
