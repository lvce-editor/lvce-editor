import * as GetCompletionItemsVirtualDom from '../GetCompletionItemsVirtualDom/GetCompletionItemsVirtualDom.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'

export const getEditorCompletionVirtualDom = (visibleItems) => {
  const dom = []
  dom.push(
    {
      type: VirtualDomElements.Div,
      className: 'Viewlet EditorCompletion',
      id: 'Completions',
      childCount: 2,
      onWheel: 'handleWheel',
    },
    {
      type: VirtualDomElements.Div,
      className: 'ListItems',
      role: 'listbox',
      ariaLabel: 'Suggest',
      childCount: visibleItems.length,
      onMouseDown: 'handleMousedown',
    },
    ...GetCompletionItemsVirtualDom.getCompletionItemsVirtualDom(visibleItems),
    {
      type: VirtualDomElements.Div,
      className: 'ScrollBarSmall',
      childCount: 1,
      onPointerDown: 'handleScrollBarPointerDown',
    },
    {
      type: VirtualDomElements.Div,
      className: 'ScrollBarThumb',
      childCount: 0,
    },
  )
  return dom
}
