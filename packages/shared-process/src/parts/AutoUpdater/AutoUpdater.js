import * as AutoUpdaterAppImage from '../AutoUpdaterAppImage/AutoUpdaterAppImage.js'
import { VError } from '../VError/VError.js'

export const checkForUpdatesAndNotify = async () => {
  try {
    return await AutoUpdaterAppImage.checkForUpdatesAndNotify()
  } catch (error) {
    // @ts-ignore
    throw new VError(error, `Failed to check for updates`)
  }
}

export const downloadUpdate = async (version) => {
  try {
    return await AutoUpdaterAppImage.downloadUpdate(version)
  } catch (error) {
    // @ts-ignore
    throw new VError(error, `Failed to download update`)
  }
}

export const installAndRestart = async (downloadPath) => {
  try {
    return await AutoUpdaterAppImage.installAndRestart(downloadPath)
  } catch (error) {
    // @ts-ignore
    throw new VError(error, `Failed to install and restart`)
  }
}
