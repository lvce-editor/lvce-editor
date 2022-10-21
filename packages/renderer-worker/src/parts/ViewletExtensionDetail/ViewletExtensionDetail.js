import * as Command from '../Command/Command.js'
import * as ExtensionDisplay from '../ExtensionDisplay/ExtensionDisplay.js'
import * as ExtensionManagement from '../ExtensionManagement/ExtensionManagement.js'
import * as FileSystem from '../FileSystem/FileSystem.js'
import * as Icon from '../Icon/Icon.js'
import * as MarkDown from '../Markdown/Markdown.js'
import * as MenuEntryId from '../MenuEntryId/MenuEntryId.js'
import * as Path from '../Path/Path.js'
import * as Platform from '../Platform/Platform.js'
import * as PlatformType from '../PlatformType/PlatformType.js'
import * as SanitizeHtml from '../SanitizeHtml/SanitizeHtml.js'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'

export const name = ViewletModuleId.ExtensionDetail

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

// TODO duplicate code with viewletExtensions
const getIconSrc = (extension) => {
  if (extension.icon) {
    return ExtensionDisplay.getIcon(extension)
  }
  if (extension.name && extension.name.startsWith('Language Basics')) {
    return Icon.EXtensionLanguageBasics
  }
  if (extension.name && extension.name.endsWith(' Theme')) {
    return Icon.ExtensionTheme
  }
  return Icon.ExtensionDefaultIcon
}

const getBaseUrl = (extensionPath) => {
  console.log({ platform: Platform.platform })
  switch (Platform.platform) {
    case PlatformType.Remote:
    case PlatformType.Electron:
      return `/remote` + extensionPath + '/'
    default:
      return extensionPath
  }
}

// TODO when there are multiple extension with the same id,
// probably need to pass extension location from extensions viewlet
export const loadContent = async (state) => {
  const { uri } = state
  const id = uri.slice('extension-detail://'.length)
  const extension = await ExtensionManagement.getExtension(id)
  const readmeContent = await loadReadmeContent(extension.path)
  const baseUrl = getBaseUrl(extension.path)
  const readmeHtml = MarkDown.toHtml(readmeContent, {
    baseUrl,
  })
  const sanitizedReadmeHtml = await SanitizeHtml.sanitizeHtml(readmeHtml)
  const iconSrc = getIconSrc(extension)
  const description = ExtensionDisplay.getDescription(extension)
  const name = ExtensionDisplay.getName(extension)
  return {
    ...state,
    sanitizedReadmeHtml,
    iconSrc,
    name,
    description,
  }
}

export const handleIconError = (state) => {
  const { iconSrc } = state
  if (iconSrc === Icon.ExtensionDefaultIcon) {
    return state
  }
  return {
    ...state,
    iconSrc: Icon.ExtensionDefaultIcon,
  }
}

export const handleReadmeContextMenu = async (state, x, y) => {
  await Command.execute(
    /* ContextMenu.show */ 'ContextMenu.show',
    /* x */ x,
    /* y */ y,
    /* id */ MenuEntryId.ExtensionDetailReadme
  )
  return state
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

const renderDescription = {
  isEqual(oldState, newState) {
    return oldState.description === newState.description
  },
  apply(oldState, newState) {
    return [
      /* Viewlet.send */ 'Viewlet.send',
      /* id */ 'ExtensionDetail',
      /* method */ 'setDescription',
      /* description */ newState.description,
    ]
  },
}

const renderReadme = {
  isEqual(oldState, newState) {
    return oldState.sanitizedReadmeHtml === newState.sanitizedReadmeHtml
  },
  apply(pldState, newState) {
    return [
      /* Viewlet.send */ 'Viewlet.send',
      /* id */ 'ExtensionDetail',
      /* method */ 'setReadmeHtml',
      /* sanizedHtml */ newState.sanitizedReadmeHtml,
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

export const render = [renderName, renderReadme, renderDescription, renderIcon]
