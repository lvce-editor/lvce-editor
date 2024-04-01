// based on the video editor by vscode

import * as AttachEvents from '../AttachEvents/AttachEvents.ts'
import * as DomEventType from '../DomEventType/DomEventType.ts'
import * as VirtualDom from '../VirtualDom/VirtualDom.js'
import * as ViewletVideoEvents from './ViewletVideoEvents.js'

export const create = () => {
  const $Viewlet = document.createElement('div')
  $Viewlet.className = 'Viewlet Media Video'
  return {
    $Viewlet,
  }
}

export const attachEvents = (state) => {
  const { $Viewlet } = state
  AttachEvents.attachEvents($Viewlet, {
    [DomEventType.Error]: ViewletVideoEvents.handleVideoError,
  })
}

export const setDom = (state, dom) => {
  const { $Viewlet } = state
  VirtualDom.renderInto($Viewlet, dom)
}
