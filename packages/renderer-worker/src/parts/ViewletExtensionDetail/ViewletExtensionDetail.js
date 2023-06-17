import * as ExtensionDisplay from '../ExtensionDisplay/ExtensionDisplay.js'
import * as ExtensionManagement from '../ExtensionManagement/ExtensionManagement.js'
import * as GetExtensionReadme from '../GetExtensionReadme/GetExtensionReadme.js'
import * as GetViewletSize from '../GetViewletSize/GetViewletSize.js'
import * as Icon from '../Icon/Icon.js'
import * as MarkDown from '../Markdown/Markdown.js'
import * as Platform from '../Platform/Platform.js'
import * as PlatformType from '../PlatformType/PlatformType.js'
import * as SanitizeHtml from '../SanitizeHtml/SanitizeHtml.js'
import * as ViewletSize from '../ViewletSize/ViewletSize.js'

export const create = (id, uri, x, y, width, height) => {
  return {
    name: '',
    uri,
    x,
    y,
    width,
    height,
    size: ViewletSize.None,
  }
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
  const readmeContent = await GetExtensionReadme.loadReadmeContent(extension.path)
  const baseUrl = getBaseUrl(extension.path)
  const readmeHtml = MarkDown.toHtml(readmeContent, {
    baseUrl,
  })
  const sanitizedReadmeHtml = await SanitizeHtml.sanitizeHtml(readmeHtml)
  const normalizedReadmeHtml = sanitizedReadmeHtml
  const iconSrc = ExtensionDisplay.getIcon(extension)
  const description = ExtensionDisplay.getDescription(extension)
  const name = ExtensionDisplay.getName(extension)
  const size = GetViewletSize.getViewletSize(width)
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
  const size = GetViewletSize.getViewletSize(dimensions.width)
  return {
    ...state,
    ...dimensions,
    size,
  }
}
