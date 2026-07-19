import * as Icon from '../Icon/Icon.js'
import * as IconTheme from '../IconTheme/IconTheme.js'
import * as Workspace from '../Workspace/Workspace.js'

const getDisplayUri = (uri) => {
  if (!uri.startsWith('diff://') && !uri.startsWith('inline-diff://')) {
    return uri
  }
  const separatorIndex = uri.indexOf('<->')
  return separatorIndex === -1 ? uri : uri.slice(separatorIndex + 3)
}

const getDisplayPath = (uri) => {
  if (!uri.startsWith('file://')) {
    return uri
  }
  try {
    return decodeURIComponent(new URL(uri).pathname)
  } catch {
    return uri
  }
}

export const getTitle = (uri) => {
  if (!uri) {
    return ''
  }
  uri = getDisplayPath(getDisplayUri(uri))
  const homeDir = Workspace.getHomeDir()
  // TODO tree shake this out in web
  if (homeDir && (uri === homeDir || uri.startsWith(`${homeDir}/`))) {
    return `~${uri.slice(homeDir.length)}`
  }
  return uri
}

export const getLabel = (uri) => {
  if (uri.startsWith('settings://')) {
    return 'Settings'
  }
  if (uri.startsWith('simple-browser://')) {
    return 'Simple Browser'
  }
  if (uri.startsWith('language-models://')) {
    return 'Language Models'
  }
  if (uri.startsWith('process-explorer://')) {
    return 'Process Explorer'
  }
  if (uri.startsWith('running-extensions://')) {
    return 'Running Extensions'
  }
  return Workspace.pathBaseName(getDisplayUri(uri))
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
  if (uri.startsWith('process-explorer://')) {
    return `MaskIcon${Icon.DebugAlt2}`
  }
  if (uri.startsWith('running-extensions://')) {
    return `MaskIcon${Icon.Extensions}`
  }
  const baseName = Workspace.pathBaseName(getDisplayUri(uri))
  const icon = IconTheme.getFileIcon({ name: baseName })
  return icon
}
