import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.js'

const descriptionWrapper = {
  type: VirtualDomElements.Div,
  className: 'QuickPickItemDescription',
  childCount: 1,
}

const label1 = {
  type: VirtualDomElements.Div,
  className: 'Label',
  childCount: 1,
}

const quickPickHighlight = {
  type: VirtualDomElements.Span,
  className: 'QuickPickHighlight',
  childCount: 1,
}

const addHighlights = (dom, highlights, label) => {
  const labelDom = {
    type: VirtualDomElements.Div,
    className: 'Label',
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

const getQuickPickItemVirtualDom = (visibleItem) => {
  const { posInSet, label, setSize, isActive, description, icon, matches } = visibleItem
  const highlights = matches.slice(1)
  const dom = []
  dom.push({
    type: VirtualDomElements.Div,
    className: 'QuickPickItem',
    role: 'option',
    ariaPosInSet: posInSet,
    ariaSetSize: setSize,
    childCount: 1,
  })
  if (isActive) {
    // @ts-ignore
    dom[0].id = 'QuickPickItemActive'
  }
  if (icon) {
    dom[0].childCount++
    dom.push({
      type: VirtualDomElements.I,
      className: `FileIcon FileIcon${icon}`,
      childCount: 0,
    })
  }
  addHighlights(dom, highlights, label)
  return dom
}

export const getQuickPickItemsVirtualDom = (visibleItems) => {
  if (visibleItems.length === 0) {
    return [
      {
        type: VirtualDomElements.Div,
        className: 'QuickPickStatus',
        childCount: 1,
      },
      text('No Results'),
    ]
  }
  const dom = visibleItems.flatMap(getQuickPickItemVirtualDom)
  return dom
}
