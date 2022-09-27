import * as ExtensionManagement from '../ExtensionManagement/ExtensionManagement.js'
import * as FileSystem from '../FileSystem/FileSystem.js'
import * as MarkDown from '../Markdown/Markdown.js'
import * as Path from '../Path/Path.js'
import * as SanitizeHtml from '../SanitizeHtml/SanitizeHtml.js'

export const name = 'ExtensionDetail'

export const create = (id, uri) => {
  return {
    name: '',
    uri,
  }
}

const loadReadmeContent = async (path) => {
  const readmeUrl = Path.join('/', path, 'README.md')
  const readmeContent = await FileSystem.readFile(readmeUrl)
  return readmeContent
}

const DEFAULT_ICON_SRC = '/icons/extensionDefaultIcon.png'
const DEFAULT_ICON_LANGUAGE_BASICS = '/icons/language-icon.svg'
const DEFAULT_ICON_THEME = '/icons/theme-icon.png'

const getIconSrc = (extension) => {
  if (extension.icon) {
    return extension.icon
  }
  if (extension.name && extension.name.startsWith('Language Basics')) {
    return DEFAULT_ICON_LANGUAGE_BASICS
  }
  if (extension.name && extension.name.endsWith(' Theme')) {
    return DEFAULT_ICON_THEME
  }
  return DEFAULT_ICON_SRC
}

// TODO when there are multiple extension with the same id,
// probably need to pass extension location from extensions viewlet
export const loadContent = async (state) => {
  const { uri } = state
  const id = uri.slice('extension-detail://'.length)
  const extension = await ExtensionManagement.getExtension(id)
  const readmeContent = await loadReadmeContent(extension.path)
  const readmeHtml = MarkDown.toHtml(readmeContent)
  const sanitzedReadmeHtml = await SanitizeHtml.sanitizeHtml(readmeHtml)
  const iconSrc = getIconSrc(extension)
  return {
    ...state,
    name: id,
    sanitzedReadmeHtml,
    iconSrc,
  }
}

export const hasFunctionalRender = true

const renderName = {
  isEqual(oldState, newState) {
    return oldState.name === newState.name
  },
  apply(oldState, newState) {
    return [
      /* Viewlet.send */ 'Viewlet.send',
      /* id */ 'ExtensionDetail',
      /* method */ 'setName',
      /* name */ newState.name,
    ]
  },
}

const renderReadme = {
  isEqual(oldState, newState) {
    return oldState.sanitzedReadmeHtml === newState.sanitzedReadmeHtml
  },
  apply(pldState, newState) {
    return [
      /* Viewlet.send */ 'Viewlet.send',
      /* id */ 'ExtensionDetail',
      /* method */ 'setReadmeHtml',
      /* sanizedHtml */ newState.sanitzedReadmeHtml,
    ]
  },
}

const renderIcon = {
  isEqual(oldState, newState) {
    return oldState.iconSrc === newState.iconSrc
  },
  apply(pldState, newState) {
    return [
      /* Viewlet.send */ 'Viewlet.send',
      /* id */ 'ExtensionDetail',
      /* method */ 'setIconSrc',
      /* src */ newState.iconSrc,
    ]
  },
}

export const render = [renderName, renderReadme, renderIcon]
