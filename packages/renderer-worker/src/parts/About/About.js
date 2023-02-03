import * as ElectronProcess from '../ElectronProcess/ElectronProcess.js'
import * as Logger from '../Logger/Logger.js'
import * as Platform from '../Platform/Platform.js'
import * as PlatformType from '../PlatformType/PlatformType.js'

const showAboutDefault = async () => {
  Logger.warn('show about - not implemented')
}

const showAboutElectron = async () => {
  ElectronProcess.invoke('About.showAbout')
}

const getFn = () => {
  switch (Platform.platform) {
    case PlatformType.Electron:
      return showAboutElectron
    default:
      return showAboutDefault
  }
}

export const showAbout = async () => {
  const fn = getFn()
  await fn()
}
