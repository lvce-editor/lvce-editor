// based on the audio editor by vscode
import * as AttachEvents from '../AttachEvents/AttachEvents.js'
import * as DomEventType from '../DomEventType/DomEventType.js'
import * as VirtualDom from '../VirtualDom/VirtualDom.js'
import * as ViewletAudioEvents from './ViewletAudioEvents.js'

export const create = () => {
  const $Viewlet = document.createElement('div')
  $Viewlet.className = 'Viewlet Audio'
  return {
    $Viewlet,
  }
}

export const attachEvents = (state) => {
  const { $Viewlet } = state
  AttachEvents.attachEvents($Viewlet, {
    [DomEventType.Error]: ViewletAudioEvents.handleAudioError,
  })
}

export const setDom = (state, dom) => {
  const { $Viewlet } = state
  VirtualDom.renderInto($Viewlet, dom)
}
