import * as AutoUpdateType from '../AutoUpdateType/AutoUpdateType.ts'
import * as CompareVersion from '../CompareVersion/CompareVersion.ts'
import * as GetLatestReleaseVersion from '../GetLatestReleaseVersion/GetLatestReleaseVersion.ts'
import * as IsAppImage from '../IsAppImage/IsAppImage.ts'
import * as Platform from '../Platform/Platform.ts'
import { VError } from '../VError/VError.ts'

export const getAutoUpdateType = async (): Promise<any> => {
  try {
    if (Platform.isDeb) {
      return AutoUpdateType.Deb
    }
    if (Platform.isWindows) {
      return AutoUpdateType.WindowsNsis
    }
    if (IsAppImage.isAppImage()) {
      return AutoUpdateType.AppImage
    }
    return AutoUpdateType.None
  } catch (error) {
    throw new VError(error, `Failed to get auto update type`)
  }
}

export const getLatestVersion = async (): Promise<any> => {
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
