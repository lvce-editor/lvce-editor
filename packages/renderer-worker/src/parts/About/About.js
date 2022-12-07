import * as Platform from '../Platform/Platform.js'
import * as ElectronProcess from '../ElectronProcess/ElectronProcess.js'

const showAboutWeb = () => {
  console.warn('show about - not implemented')
}

const showAboutRemote = () => {
  console.warn('show about - not implemented')
}

const showAboutElectron = async () => {
  await ElectronProcess.invoke('About.showAbout')
}

export const showAbout = async () => {
  switch (Platform.platform) {
    case 'web':
      return showAboutWeb()
    case 'remote':
      return showAboutRemote()
    case 'electron':
      return showAboutElectron()
    default:
      return
  }
}
