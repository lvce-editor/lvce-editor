import * as ElectronWindowProcessExplorer from '../ElectronWindowProcessExplorer/ElectronWindowProcessExplorer.js'
import * as Platform from '../Platform/Platform.js'
import * as PlatformType from '../PlatformType/PlatformType.js'
import * as ProcessExplorerRemote from './ProcessExplorerRemote.js'
import * as ProcessExplorerWeb from './ProcessExplorerWeb.js'

export const open = () => {
  switch (Platform.platform) {
    case PlatformType.Electron:
      return ElectronWindowProcessExplorer.open()
    case PlatformType.Remote:
      return ProcessExplorerRemote.open()
    case PlatformType.Web:
      return ProcessExplorerWeb.open()
  }
}
