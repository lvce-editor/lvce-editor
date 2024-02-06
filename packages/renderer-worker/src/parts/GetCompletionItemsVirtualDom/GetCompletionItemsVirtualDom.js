import * as AriaRoles from '../AriaRoles/AriaRoles.js'
import * as ClassNames from '../ClassNames/ClassNames.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.js'

const label1 = {
  type: VirtualDomElements.Div,
  className: ClassNames.Label,
  childCount: 1,
}

const completionHighlight = {
  type: VirtualDomElements.Span,
  className: ClassNames.EditorCompletionItemHighlight,
  childCount: 1,
}

const getLabelDom = (label, highlights) => {
  if (highlights.length === 0) {
    return [label1, text(label)]
  }
  const dom = []
  const labelDom = {
    type: VirtualDomElements.Div,
    className: ClassNames.Label,
    childCount: 0,
  }
  dom.push(labelDom)
  let position = 0
  for (let i = 0; i < highlights.length; i += 2) {
    const highlightStart = highlights[i]
    const highlightEnd = highlights[i + 1]
    if (position < highlightStart) {
      const beforeText = label.slice(position, highlightStart)
      labelDom.childCount++
      dom.push(text(beforeText))
    }
    const highlightText = label.slice(highlightStart, highlightEnd)
    labelDom.childCount++
    dom.push(completionHighlight, text(highlightText))
    position = highlightEnd
  }
  if (position < label.length) {
    const afterText = label.slice(position)
    labelDom.childCount++
    dom.push(text(afterText))
  }
  return dom
}

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
    ...getLabelDom(label, highlights),
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
