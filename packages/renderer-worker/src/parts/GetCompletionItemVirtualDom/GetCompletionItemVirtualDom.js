import * as AriaRoles from '../AriaRoles/AriaRoles.js'
import * as ClassNames from '../ClassNames/ClassNames.js'
import * as GetCompletionItemIconVirtualDom from '../GetCompletionItemIconVirtualDom/GetCompletionItemIconVirtualDom.js'
import * as GetHighlightedLabelDom from '../GetHighlightedLabelDom/GetHighlightedLabelDom.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'

export const getCompletionItemVirtualDom = (visibleItem) => {
  const { top, label, symbolName, highlights, focused, deprecated, fileIcon } = visibleItem
  let className = ClassNames.EditorCompletionItem
  if (focused) {
    className += ' ' + ClassNames.EditorCompletionItemFocused
  }
  if (deprecated) {
    className += ' ' + ClassNames.EditorCompletionItemDeprecated
  }
  return [
    {
      type: VirtualDomElements.Div,
      role: AriaRoles.Option,
      className,
      top,
      childCount: 2,
    },
    GetCompletionItemIconVirtualDom.getIconDom(fileIcon, symbolName),
    ...GetHighlightedLabelDom.getHighlightedLabelDom(label, highlights),
  ]
}
