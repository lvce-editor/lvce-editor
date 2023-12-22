import * as AttachEvents from '../AttachEvents/AttachEvents.js'
import * as DomEventOptions from '../DomEventOptions/DomEventOptions.js'
import * as DomEventType from '../DomEventType/DomEventType.js'
import * as VirtualDom from '../VirtualDom/VirtualDom.js'
import * as ViewletDiffEditorEvents from './ViewletDiffEditorEvents.js'

export const create = () => {
  const $Viewlet = document.createElement('div')
  $Viewlet.className = 'Viewlet DiffEditor'
  return {
    $Viewlet,
  }
}

export const attachEvents = (state) => {
  const { $Viewlet, $ScrollBar } = state
  // AttachEvents.attachEvents($ScrollBar, {
  //   [DomEventType.PointerDown]: ViewletDiffEditorEvents.handleScrollBarPointerDown,
  // })
  $Viewlet.addEventListener(DomEventType.Wheel, ViewletDiffEditorEvents.handleWheel, DomEventOptions.Passive)
}

export const setDom = (state, dom) => {
  const { $Viewlet } = state
  console.log({ dom })
  VirtualDom.renderInto($Viewlet, dom)
}

export * from '../ViewletScrollable/ViewletScrollable.js'
