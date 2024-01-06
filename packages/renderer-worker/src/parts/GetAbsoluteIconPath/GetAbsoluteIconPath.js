import * as IconThemeState from '../IconThemeState/IconThemeState.js'
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
    if (extensionPath.includes('\\')) {
      const extensionUri = extensionPath.replaceAll('\\', '/')
      return GetRemoteSrc.getRemoteSrc(`${extensionUri}/${result}`)
    }
    return GetRemoteSrc.getRemoteSrc(`${extensionPath}/${result}`)
  }
  return ''
}
