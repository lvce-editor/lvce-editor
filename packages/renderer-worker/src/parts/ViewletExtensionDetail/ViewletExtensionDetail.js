import * as ExtensionDisplay from '../ExtensionDisplay/ExtensionDisplay.js'
import * as ExtensionManagement from '../ExtensionManagement/ExtensionManagement.js'
import * as FileSystem from '../FileSystem/FileSystem.js'
import * as Icon from '../Icon/Icon.js'
import * as MarkDown from '../Markdown/Markdown.js'
import * as Path from '../Path/Path.js'
import * as Platform from '../Platform/Platform.js'
import * as PlatformType from '../PlatformType/PlatformType.js'
import * as SanitizeHtml from '../SanitizeHtml/SanitizeHtml.js'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'
import * as ViewletSize from '../ViewletSize/ViewletSize.js'

export const create = (id, uri, top, left, width, height) => {
  return {
    name: '',
    uri,
    top,
    left,
    width,
    height,
    size: ViewletSize.None,
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
  switch (Platform.platform) {
    case PlatformType.Remote:
    case PlatformType.Electron:
      return `/remote` + extensionPath + '/'
    default:
      return extensionPath
  }
}

const getSize = (width) => {
  if (width < 180) {
    return ViewletSize.Small
  }
  if (width < 768) {
    return ViewletSize.Normal
  }
  return ViewletSize.Large
}

// first heading is usually extension name, since it is alreay present
// at the top, remove this heading
// const removeFirstHeading = (readme) => {
//   console.log({ readme })
//   return readme.replace(/<h1.*?>.*?<\/h1>/s, '')
// }

// TODO when there are multiple extension with the same id,
// probably need to pass extension location from extensions viewlet
export const loadContent = async (state) => {
  const { uri, width } = state
  const id = uri.slice('extension-detail://'.length)
  const extension = await ExtensionManagement.getExtension(id)
  const readmeContent = await loadReadmeContent(extension.path)
  const baseUrl = getBaseUrl(extension.path)
  const readmeHtml = MarkDown.toHtml(readmeContent, {
    baseUrl,
  })
  const sanitizedReadmeHtml = await SanitizeHtml.sanitizeHtml(readmeHtml)
  const normalizedReadmeHtml = sanitizedReadmeHtml
  const iconSrc = getIconSrc(extension)
  const description = ExtensionDisplay.getDescription(extension)
  const name = ExtensionDisplay.getName(extension)
  const size = getSize(width)
  return {
    ...state,
    sanitizedReadmeHtml: normalizedReadmeHtml,
    iconSrc,
    name,
    description,
    size,
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

export const hasFunctionalResize = true

export const resize = (state, dimensions) => {
  const size = getSize(dimensions.width)
  return {
    ...state,
    ...dimensions,
    size,
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
  apply(oldState, newState) {
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
  apply(oldState, newState) {
    return [
      /* Viewlet.send */ 'Viewlet.send',
      /* id */ 'ExtensionDetail',
      /* method */ 'setIconSrc',
      /* src */ newState.iconSrc,
    ]
  },
}

const renderSize = {
  isEqual(oldState, newState) {
    return oldState.size === newState.size
  },
  apply(oldState, newState) {
    return [
      /* Viewlet.send */ 'Viewlet.send',
      /* id */ 'ExtensionDetail',
      /* method */ 'setSize',
      /* oldSize */ oldState.size,
      /* newSize */ newState.size,
    ]
  },
}

export const render = [
  renderName,
  renderReadme,
  renderDescription,
  renderIcon,
  renderSize,
]
