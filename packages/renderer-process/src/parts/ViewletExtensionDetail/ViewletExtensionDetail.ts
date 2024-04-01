import * as AriaRoles from '../AriaRoles/AriaRoles.ts'
import * as AttachEvents from '../AttachEvents/AttachEvents.ts'
import * as DomEventType from '../DomEventType/DomEventType.ts'
import * as VirtualDom from '../VirtualDom/VirtualDom.ts'
import * as ViewletExtensionDetailEvents from './ViewletExtensionDetailEvents.ts'

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

export * from '../ViewletSizable/ViewletSizable.ts'
