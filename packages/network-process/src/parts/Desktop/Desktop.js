import * as DesktopType from '../DesktopType/DesktopType.js'
import * as Platform from '../Platform/Platform.js'

export const getDesktop = () => {
  const { ORIGINAL_XDG_CURRENT_DESKTOP, XDG_CURRENT_DESKTOP } = process.env
  if (ORIGINAL_XDG_CURRENT_DESKTOP && ORIGINAL_XDG_CURRENT_DESKTOP !== 'undefined') {
    if (ORIGINAL_XDG_CURRENT_DESKTOP === 'ubuntu:GNOME') {
      return DesktopType.Gnome
    }
    return ORIGINAL_XDG_CURRENT_DESKTOP
  }
  if (XDG_CURRENT_DESKTOP) {
    if (XDG_CURRENT_DESKTOP === 'ubuntu:GNOME') {
      return DesktopType.Gnome
    }
    return XDG_CURRENT_DESKTOP
  }
  if (Platform.isWindows) {
    return DesktopType.Windows
  }
  return DesktopType.Unknown
}
