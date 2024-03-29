import * as AriaRoles from '../AriaRoles/AriaRoles.js'
import * as VirtualDom from '../VirtualDom/VirtualDom.js'
import * as ViewletExtensionDetailEvents from './ViewletExtensionDetailEvents.js'
import * as AttachEvents from '../AttachEvents/AttachEvents.js'
import * as DomEventType from '../DomEventType/DomEventType.js'

export const create = () => {
  const $ReadmeHtml = document.createElement('div')
  $ReadmeHtml.className = 'Markdown'
  $ReadmeHtml.role = AriaRoles.Document

  const $ExtensionDetailHeader = document.createElement('div')
  $ExtensionDetailHeader.className = 'ExtensionDetailHeader'

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
  AttachEvents.attachEvents($ReadmeHtml, {
    [DomEventType.ContextMenu]: ViewletExtensionDetailEvents.handleReadmeContextMenu,
  })
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
