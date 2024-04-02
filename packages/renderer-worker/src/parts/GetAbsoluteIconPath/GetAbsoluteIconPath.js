import * as IconThemeState from '../IconThemeState/IconThemeState.js'
import * as PathSeparator from '../PathSeparator/PathSeparator.js'
import * as GetRemoteSrc from '../GetRemoteSrc/GetRemoteSrc.js'

export const getAbsoluteIconPath = (iconTheme, icon) => {
  if (!iconTheme) {
    return ''
  }
  const result = iconTheme.iconDefinitions[icon]
  const extensionPath = IconThemeState.state.extensionPath || ''
  if (result) {
    if (extensionPath.startsWith('http://') || extensionPath.startsWith('https://')) {
      return `${extensionPath}${result}`
    }
    if (extensionPath.includes(PathSeparator.BackSlash)) {
      const extensionUri = extensionPath.replaceAll(PathSeparator.BackSlash, PathSeparator.Slash)
      return `/remote/${extensionUri}${result}`
    }
    return GetRemoteSrc.getRemoteSrc(`${extensionPath}${result}`)
  }
  return ''
}
