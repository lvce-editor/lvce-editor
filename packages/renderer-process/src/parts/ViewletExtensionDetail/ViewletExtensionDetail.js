import * as AriaRoles from '../AriaRoles/AriaRoles.js'
import * as ViewletExtensionDetailEvents from './ViewletExtensionDetailEvents.js'

export const create = () => {
  const $NameText = document.createTextNode('')

  const $ReadmeHtml = document.createElement('div')
  $ReadmeHtml.className = 'Markdown'
  // @ts-ignore
  $ReadmeHtml.role = AriaRoles.Document
  $ReadmeHtml.oncontextmenu =
    ViewletExtensionDetailEvents.handleReadmeContextMenu

  const $ExtensionDetailIcon = document.createElement('img')
  $ExtensionDetailIcon.className = 'ExtensionDetailIcon'
  $ExtensionDetailIcon.alt = ''
  $ExtensionDetailIcon.draggable = false
  $ExtensionDetailIcon.width = 150
  $ExtensionDetailIcon.height = 150
  $ExtensionDetailIcon.onerror = ViewletExtensionDetailEvents.handleIconError

  const $Name = document.createElement('h3')
  $Name.className = 'ExtensionDetailName'
  $Name.append($NameText)

  const $Description = document.createElement('div')
  $Description.className = 'ExtensionDetailDescription'

  const $ExtensionDetailHeaderDetails = document.createElement('div')
  $ExtensionDetailHeaderDetails.className = 'ExtensionDetailHeaderDetails'
  $ExtensionDetailHeaderDetails.append($Name, $Description)

  const $ExtensionDetailHeader = document.createElement('div')
  $ExtensionDetailHeader.className = 'ExtensionDetailHeader'
  $ExtensionDetailHeader.append(
    $ExtensionDetailIcon,
    $ExtensionDetailHeaderDetails
  )

  const $Viewlet = document.createElement('div')
  $Viewlet.className = 'Viewlet ExtensionDetail'
  $Viewlet.append($ExtensionDetailHeader, $ReadmeHtml)
  return {
    $Viewlet,
    $Name,
    $NameText,
    $ReadmeHtml,
    $ExtensionDetailIcon,
    $Description,
  }
}

export const setName = (state, name) => {
  const { $NameText } = state
  $NameText.nodeValue = name
}

export const setReadmeHtml = (state, sanitizedHtml) => {
  const { $ReadmeHtml } = state
  $ReadmeHtml.innerHTML = sanitizedHtml
}

export const setIconSrc = (state, src) => {
  const { $ExtensionDetailIcon } = state
  // TODO handle error and load fallback icon
  $ExtensionDetailIcon.src = src
}

export const setDescription = (state, description) => {
  const { $Description } = state
  $Description.textContent = description
}

export * from '../ViewletSizable/ViewletSizable.js'
