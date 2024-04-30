import * as GetCompletionItemsVirtualDom from '../GetCompletionItemsVirtualDom/GetCompletionItemsVirtualDom.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.js'
import * as AriaRoles from '../AriaRoles/AriaRoles.js'

export const getEditorCompletionVirtualDom = (visibleItems) => {
  const dom = []
  dom.push(
    {
      type: VirtualDomElements.Div,
      className: 'Viewlet EditorCompletion',
      id: 'Completions',
      childCount: 2,
      onWheel: DomEventListenerFunctions.HandleWheel,
    },
    {
      type: VirtualDomElements.Div,
      className: 'ListItems',
      role: AriaRoles.ListBox,
      ariaLabel: 'Suggest',
      childCount: visibleItems.length,
      onMouseDown: DomEventListenerFunctions.HandleMouseDown,
    },
    ...GetCompletionItemsVirtualDom.getCompletionItemsVirtualDom(visibleItems),
    {
      type: VirtualDomElements.Div,
      className: 'ScrollBarSmall',
      childCount: 1,
      onPointerDown: DomEventListenerFunctions.HandleScrollBarPointerDown,
    },
    {
      type: VirtualDomElements.Div,
      className: 'ScrollBarThumb',
      childCount: 0,
    },
  )
  return dom
}
