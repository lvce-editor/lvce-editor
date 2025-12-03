import * as AboutElectron from '../AboutElectron/AboutElectron.js'
import * as Platform from '../Platform/Platform.js'
import * as PlatformType from '../PlatformType/PlatformType.js'
import * as Viewlet from '../Viewlet/Viewlet.js'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'

const showAboutDefault = async () => {
  await Viewlet.openWidget(ViewletModuleId.About)
}

const getFn = () => {
  switch (Platform.getPlatform()) {
    case PlatformType.Electron:
      return AboutElectron.showAboutElectron
    default:
      return showAboutDefault
  }
}

export const showAbout = async () => {
  const fn = getFn()
  await fn()
}
