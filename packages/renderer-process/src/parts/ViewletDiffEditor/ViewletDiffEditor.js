import * as AttachEvents from '../AttachEvents/AttachEvents.js'
import * as DomEventOptions from '../DomEventOptions/DomEventOptions.js'
import * as DomEventType from '../DomEventType/DomEventType.js'
import * as ViewletSash from '../ViewletSash/ViewletSash.js'
import * as VirtualDom from '../VirtualDom/VirtualDom.js'
import * as ViewletDiffEditorEvents from './ViewletDiffEditorEvents.js'

export const create = () => {
  const $ContentLeft = document.createElement('div')
  $ContentLeft.className = 'DiffEditorContent DiffEditorContentLeft'
  const $ContentRight = document.createElement('div')
  $ContentRight.className = 'DiffEditorContent DiffEditorContentRight'

  const $Sash = ViewletSash.create()

  const $ScrollBarThumb = document.createElement('div')
  $ScrollBarThumb.className = 'ScrollBarThumb'

  const $ScrollBar = document.createElement('div')
  $ScrollBar.className = 'ScrollBar'
  $ScrollBar.onpointerdown = ViewletDiffEditorEvents.handleScrollBarPointerDown
  $ScrollBar.append($ScrollBarThumb)

  const $Viewlet = document.createElement('div')
  $Viewlet.className = 'Viewlet DiffEditor'
  $Viewlet.append($ContentLeft, $Sash, $ContentRight, $ScrollBar)

  return {
    $Viewlet,
    $ContentLeft,
    $ContentRight,
    $ScrollBar,
    $ScrollBarThumb,
  }
}

export const attachEvents = (state) => {
  const { $Viewlet, $ScrollBar } = state
  AttachEvents.attachEvents($ScrollBar, {
    [DomEventType.PointerDown]: ViewletDiffEditorEvents.handleScrollBarPointerDown,
  })
  $Viewlet.addEventListener(DomEventType.Wheel, ViewletDiffEditorEvents.handleWheel, DomEventOptions.Passive)
}

export const setDom = (state, leftDom, rightDom) => {
  const { $ContentLeft, $ContentRight } = state
  VirtualDom.renderInto($ContentLeft, leftDom)
  VirtualDom.renderInto($ContentRight, rightDom)
}

export * from '../ViewletScrollable/ViewletScrollable.js'
