import * as ElectronWindowAbout from '../ElectronWindowAbout/ElectronWindowAbout.js'

export const showAboutElectron = async () => {
  return ElectronWindowAbout.open()
}
