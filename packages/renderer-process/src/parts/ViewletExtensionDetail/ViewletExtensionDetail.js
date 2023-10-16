import * as AriaRoles from '../AriaRoles/AriaRoles.js'
import * as VirtualDom from '../VirtualDom/VirtualDom.js'
import * as ViewletExtensionDetailEvents from './ViewletExtensionDetailEvents.js'

export const create = () => {
  const $ReadmeHtml = document.createElement('div')
  $ReadmeHtml.className = 'Markdown'
  $ReadmeHtml.role = AriaRoles.Document

  const $ExtensionDetailHeader = document.createElement('div')

  const $Viewlet = document.createElement('div')
  $Viewlet.className = 'Viewlet ExtensionDetail'
  $Viewlet.append($ExtensionDetailHeader, $ReadmeHtml)
  return {
    $Viewlet,
    $ReadmeHtml,
    $ExtensionDetailHeader,
  }
}

export const attachEvents = (state) => {
  const { $ReadmeHtml } = state
  $ReadmeHtml.oncontextmenu = ViewletExtensionDetailEvents.handleReadmeContextMenu
  // TODO
  // $ExtensionDetailIcon.onerror = ViewletExtensionDetailEvents.handleIconError
}

export const setReadmeDom = (state, dom) => {
  const { $ReadmeHtml } = state
  VirtualDom.renderInto($ReadmeHtml, dom)
}

export const setHeaderDom = (state, dom) => {
  const { $ExtensionDetailHeader } = state
  VirtualDom.renderInto($ExtensionDetailHeader, dom)
}

export * from '../ViewletSizable/ViewletSizable.js'
