import * as AutoUpdateType from '../AutoUpdateType/AutoUpdateType.js'
import * as CompareVersion from '../CompareVersion/CompareVersion.js'
import * as GetLatestReleaseVersion from '../GetLatestReleaseVersion/GetLatestReleaseVersion.js'
import * as Platform from '../Platform/Platform.js'
import { VError } from '../VError/VError.js'

export const getAutoUpdateType = async () => {
  try {
    if (Platform.isWindows) {
      return AutoUpdateType.WindowsNsis
    }
    if (Platform.isAppImage()) {
      return AutoUpdateType.AppImage
    }
    return AutoUpdateType.None
  } catch (error) {
    throw new VError(error, `Failed to get auto update type`)
  }
}

export const getLatestVersion = async () => {
  const repository = Platform.getRepository()
  const version = await GetLatestReleaseVersion.getLatestReleaseVersion(repository)
  const currentVersion = Platform.version
  if (CompareVersion.isGreater(version, currentVersion)) {
    return {
      version,
    }
  } else {
    console.log('not update is available')
  }
}
