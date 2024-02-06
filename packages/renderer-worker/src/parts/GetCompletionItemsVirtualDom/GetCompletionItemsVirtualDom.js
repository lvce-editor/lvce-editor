import * as AriaRoles from '../AriaRoles/AriaRoles.js'
import * as ClassNames from '../ClassNames/ClassNames.js'
import * as GetHighlightedLabelDom from '../GetHighlightedLabelDom/GetHighlightedLabelDom.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.js'

const getCompletionItemVirtualDom = (visibleItem) => {
  const { top, label, symbolName, highlights, focused, deprecated } = visibleItem
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
    {
      type: VirtualDomElements.Div,
      className: `${ClassNames.ColoredMaskIcon} ${symbolName}`,
      childCount: 0,
    },
    ...GetHighlightedLabelDom.getHighlightedLabelDom(label, highlights),
  ]
}

export const getCompletionItemsVirtualDom = (visibleItems) => {
  if (visibleItems.length === 0) {
    return [
      {
        type: VirtualDomElements.Div,
        childCount: 1,
      },
      text('No Results'),
    ]
  }
  const root = {
    type: VirtualDomElements.Div,
    childCount: visibleItems.length,
  }
  const dom = [root, ...visibleItems.flatMap(getCompletionItemVirtualDom)]
  return dom
}
