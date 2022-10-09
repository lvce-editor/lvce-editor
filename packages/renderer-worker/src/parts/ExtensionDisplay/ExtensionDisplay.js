import * as Icon from '../Icon/Icon.js'
import * as Platform from '../Platform/Platform.js'

export const getIcon = (extension) => {
  if (!extension) {
    return Icon.ExtensionDefaultIcon
  }
  if (!extension.path || !extension.icon) {
    if (extension.name && extension.name.startsWith('Language Basics')) {
      return Icon.EXtensionLanguageBasics
    }
    if (extension.name && extension.name.endsWith(' Theme')) {
      return Icon.ExtensionTheme
    }
    return Icon.ExtensionDefaultIcon
  }
  if (Platform.platform === 'remote') {
    return `/remote/${extension.path}/${extension.icon}` // TODO support windows paths
  }
  if (Platform.platform === 'electron') {
    return `/remote/${extension.path}/${extension.icon}` // TODO support windows paths
  }
  return ''
}

const RE_PUBLISHER = /^[a-z\d\-]+/

// TODO handle case when extension is of type number|array|null|string
export const getPublisher = (extension) => {
  if (!extension || !extension.id) {
    return 'n/a'
  }
  // TODO handle case when id is not of type string -> should not crash application
  const match = extension.id.match(RE_PUBLISHER)
  if (!match) {
    return 'n/a'
  }
  return match[0]
}

export const getName = (extension) => {
  if (extension && extension.name) {
    return extension.name
  }
  if (extension && extension.id) {
    return extension.id
  }
  return 'n/a'
}

export const getVersion = (extension) => {
  if (!extension || !extension.version) {
    return 'n/a'
  }
  return extension.version
}

export const getDescription = (extension) => {
  if (!extension || !extension.description) {
    return 'n/a'
  }
  return extension.description
}

export const getId = (extension) => {
  if (!extension || !extension.id) {
    return 'n/a'
  }
  return extension.id
}
