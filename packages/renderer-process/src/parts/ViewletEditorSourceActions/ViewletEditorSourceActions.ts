import * as AttachEvents from '../AttachEvents/AttachEvents.ts'
import * as DomEventType from '../DomEventType/DomEventType.ts'
import * as SetBounds from '../SetBounds/SetBounds.ts'
import * as VirtualDom from '../VirtualDom/VirtualDom.js'
import * as ViewletEditorSourceActions from './ViewletEditorSourceActionsEvents.js'

export const create = () => {
  const $Viewlet = document.createElement('div')
  $Viewlet.tabIndex = -1
  $Viewlet.className = 'Viewlet EditorSourceActions'
  return {
    $Viewlet,
  }
}

export const attachEvents = (state) => {
  const { $Viewlet } = state
  AttachEvents.attachEvents($Viewlet, {
    [DomEventType.FocusIn]: ViewletEditorSourceActions.handleFocusIn,
  })
}

export const setDom = (state, dom) => {
  const { $Viewlet } = state
  VirtualDom.renderInto($Viewlet, dom)
}

export const setBounds = (state, x, y) => {
  const { $Viewlet } = state
  SetBounds.setXAndYTransform($Viewlet, x, -y)
}
