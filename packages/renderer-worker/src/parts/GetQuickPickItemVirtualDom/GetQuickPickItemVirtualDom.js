import * as AriaRoles from '../AriaRoles/AriaRoles.js'
import * as ClassNames from '../ClassNames/ClassNames.js'
import * as GetFileIconVirtualDom from '../GetFileIconVirtualDom/GetFileIconVirtualDom.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.js'

const quickPickHighlight = {
  type: VirtualDomElements.Span,
  className: ClassNames.QuickPickHighlight,
  childCount: 1,
}

const addHighlights = (dom, highlights, label) => {
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
    dom.push(quickPickHighlight, text(highlightText))
    position = highlightEnd
  }
  if (position < label.length) {
    const afterText = label.slice(position)
    labelDom.childCount++
    dom.push(text(afterText))
  }
}

export const getQuickPickItemVirtualDom = (visibleItem) => {
  const { posInSet, label, setSize, isActive, description, icon, matches } = visibleItem
  const highlights = matches.slice(1)
  const dom = []
  dom.push({
    type: VirtualDomElements.Div,
    className: ClassNames.QuickPickItem,
    role: AriaRoles.Option,
    ariaPosInSet: posInSet,
    ariaSetSize: setSize,
    childCount: 1,
  })
  const parent = dom[0]
  if (isActive) {
    // @ts-ignore
    parent.id = 'QuickPickItemActive'
    parent.className += ' ' + ClassNames.QuickPickItemActive
  }
  if (icon) {
    parent.childCount++
    dom.push(GetFileIconVirtualDom.getFileIconVirtualDom(icon))
  }
  addHighlights(dom, highlights, label)
  if (description) {
    parent.childCount++
    dom.push(
      {
        type: VirtualDomElements.Div,
        className: ClassNames.QuickPickItemDescription,
        childCount: 1,
      },
      text(description),
    )
  }
  return dom
}
