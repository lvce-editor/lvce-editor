import * as ElectronWindowProcessExplorer from '../ElectronWindowProcessExplorer/ElectronWindowProcessExplorer.js'
import * as Platform from '../Platform/Platform.js'
import * as PlatformType from '../PlatformType/PlatformType.js'

const openProcessExplorerElectron = () => {
  return ElectronWindowProcessExplorer.open()
}

const openProcessExplorerRemote = () => {
  throw new Error('not implemented')
}

const openProcessExplorerWeb = () => {
  throw new Error('not implemented')
}

export const open = () => {
  switch (Platform.platform) {
    case PlatformType.Electron:
      return openProcessExplorerElectron()
    case PlatformType.Remote:
      return openProcessExplorerRemote()
    case PlatformType.Web:
      return openProcessExplorerWeb()
  }
}
