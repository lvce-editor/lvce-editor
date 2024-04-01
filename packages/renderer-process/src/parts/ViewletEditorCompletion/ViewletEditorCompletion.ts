import * as AriaRoles from '../AriaRoles/AriaRoles.ts'
import * as AttachEvents from '../AttachEvents/AttachEvents.ts'
import * as DomEventOptions from '../DomEventOptions/DomEventOptions.ts'
import * as DomEventType from '../DomEventType/DomEventType.ts'
import * as SetBounds from '../SetBounds/SetBounds.ts'
import * as VirtualDom from '../VirtualDom/VirtualDom.js'
import * as Widget from '../Widget/Widget.js'
import * as ViewletEditorCompletionEvents from './ViewletEditorCompletionEvents.js'

export const create = () => {
  const $ListItems = document.createElement('div')
  $ListItems.className = 'ListItems'
  $ListItems.role = AriaRoles.ListBox
  $ListItems.ariaLabel = 'Suggest'

  const $ScrollBarThumb = document.createElement('div')
  $ScrollBarThumb.className = 'ScrollBarThumb'

  const $ScrollBar = document.createElement('div')
  $ScrollBar.className = 'ScrollBarSmall'
  $ScrollBar.append($ScrollBarThumb)

  // TODO only create scrollbar when necessary
  // TODO recycle nodes
  const $Viewlet = document.createElement('div')
  $Viewlet.className = 'Viewlet EditorCompletion'
  $Viewlet.id = 'Completions'
  $Viewlet.append($ListItems, $ScrollBar)
  return {
    $Viewlet,
    $ListItems,
    $ScrollBar,
    $ScrollBarThumb,
  }
}

export const attachEvents = (state) => {
  const { $Viewlet, $ListItems, $ScrollBar } = state
  $Viewlet.addEventListener(DomEventType.Wheel, ViewletEditorCompletionEvents.handleWheel, DomEventOptions.Passive)
  AttachEvents.attachEvents($ListItems, {
    [DomEventType.MouseDown]: ViewletEditorCompletionEvents.handleMousedown,
  })
  AttachEvents.attachEvents($ScrollBar, {
    [DomEventType.PointerDown]: ViewletEditorCompletionEvents.handleScrollBarPointerDown,
  })
}
// TODO show should be passed active cursor position
// this would make this function easier to test as it would avoid dependency on globals of other files

export const setDom = (state, dom) => {
  const { $ListItems, $Viewlet } = state
  const $Root = VirtualDom.render(dom)
  $ListItems.replaceChildren(...$Root.firstChild.childNodes)
  Widget.append($Viewlet)
  // TODO recycle nodes
  // TODO set right aria attributes on $EditorInput
}

export const dispose = (state) => {
  Widget.remove(state.$Viewlet)
  // state.$EditorInput.removeAttribute('aria-activedescendant')
}

export const showLoading = (state, x, y) => {
  const { $Viewlet } = state
  SetBounds.setXAndYTransform($Viewlet, x, y)
  const $Loading = document.createElement('div')
  $Loading.textContent = 'Loading'
  $Viewlet.append($Loading)
  Widget.append($Viewlet)
}

export const handleError = (state, error) => {
  const { $Viewlet } = state
  $Viewlet.textContent = `${error}`
}

export const setBounds = (state, x, y, width, height) => {
  const { $Viewlet } = state
  SetBounds.setBounds($Viewlet, x, y, width, height)
}
export * from '../ViewletList/ViewletList.js'
