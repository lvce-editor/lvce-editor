import * as AriaRoles from '../AriaRoles/AriaRoles.js'
import * as AttachEvents from '../AttachEvents/AttachEvents.js'
import * as DomEventOptions from '../DomEventOptions/DomEventOptions.js'
import * as DomEventType from '../DomEventType/DomEventType.js'
import * as Focus from '../Focus/Focus.js'
import * as SetBounds from '../SetBounds/SetBounds.js'
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
  Focus.setAdditionalFocus('editorCompletions')
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
  Focus.removeAdditionalFocus('editorCompletions')
}

export const showLoading = (state, x, y) => {
  const { $Viewlet } = state
  SetBounds.setXAndYTransform($Viewlet, x, y)
  const $Loading = document.createElement('div')
  $Loading.textContent = 'Loading'
  $Viewlet.append($Loading)
  Widget.append($Viewlet)
  Focus.setAdditionalFocus('editorCompletions')
}

export const handleError = (state, error) => {
  const { $Viewlet } = state
  $Viewlet.textContent = `${error}`
}

export * from '../ViewletList/ViewletList.js'
