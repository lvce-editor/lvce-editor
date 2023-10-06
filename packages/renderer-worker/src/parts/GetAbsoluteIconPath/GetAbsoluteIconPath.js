import * as IconThemeState from '../IconThemeState/IconThemeState.js'

export const getAbsoluteIconPath = (iconTheme, icon) => {
  const result = iconTheme.iconDefinitions[icon]
  const extensionPath = IconThemeState.state.extensionPath || ''
  if (result) {
    if (extensionPath.startsWith('http://') || extensionPath.startsWith('https://')) {
      return `${extensionPath}${result}`
    }
    if (extensionPath.includes('\\')) {
      const extensionUri = extensionPath.replaceAll('\\', '/')
      return `/remote/${extensionUri}/${result}`
    }
    return `/remote${extensionPath}/${result}`
  }
  return ''
}
