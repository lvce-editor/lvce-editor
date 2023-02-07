import * as Platform from '../Platform/Platform.js'
import * as DesktopType from '../DesktopType/DesktopType.js'

const getClipboard = () => {
  const desktop = Platform.getDesktop()
  switch (desktop) {
    case DesktopType.Gnome:
      return import('./ClipBoardGnome.js')
    case DesktopType.Windows:
      return import('./ClipBoardWindows.js')
    default:
      return import('./ClipBoardNoop.js')
  }
}

export const readFiles = async () => {
  const clipboard = await getClipboard()
  return clipboard.readFiles()
}

export const writeFiles = async (type, files) => {
  const clipboard = await getClipboard()
  await clipboard.writeFiles(type, files)
}
