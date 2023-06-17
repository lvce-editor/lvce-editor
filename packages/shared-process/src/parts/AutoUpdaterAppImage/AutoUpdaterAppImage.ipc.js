import * as AutoUpdaterAppImage from './AutoUpdaterAppImage.js'

export const name = 'AutoUpdaterAppImage'

export const Commands = {
  downloadUpdate: AutoUpdaterAppImage.downloadUpdate,
  installAndRestart: AutoUpdaterAppImage.installAndRestart,
}
