import * as Icon from '../Icon/Icon.js'
import * as IconTheme from '../IconTheme/IconTheme.js'
import * as Workspace from '../Workspace/Workspace.js'

export const getTitle = (uri) => {
  if (!uri) {
    return ''
  }
  const homeDir = Workspace.getHomeDir()
  // TODO tree shake this out in web
  if (homeDir && uri.startsWith(homeDir)) {
    return `~${uri.slice(homeDir.length)}`
  }
  return uri
}

export const getLabel = (uri) => {
  if (uri.startsWith('settings://')) {
    return 'Settings'
  }
  return Workspace.pathBaseName(uri)
}

/**
 *
 * @param {string} uri
 * @returns
 */
export const getFileIcon = (uri) => {
  if (uri === 'app://keybindings') {
    return `MaskIcon${Icon.RecordKey}`
  }
  if (uri.startsWith('extension-detail://')) {
    return `MaskIcon${Icon.Extensions}`
  }
  const baseName = Workspace.pathBaseName(uri)
  const icon = IconTheme.getFileIcon({ name: baseName })
  return icon
}
