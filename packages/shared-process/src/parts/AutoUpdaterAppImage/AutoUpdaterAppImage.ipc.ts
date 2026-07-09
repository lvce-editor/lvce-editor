import * as AutoUpdaterAppImage from './AutoUpdaterAppImage.ts'

export const name = 'AutoUpdaterAppImage'

export const Commands = {
  downloadUpdate: AutoUpdaterAppImage.downloadUpdate,
  installAndRestart: AutoUpdaterAppImage.installAndRestart,
}
