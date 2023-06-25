import { div, span, text } from '../VirtualDomHelpers/VirtualDomHelpers.js'

const getLabelDom = (label, highlights) => {
  if (highlights.length === 0) {
    return [
      div(
        {
          className: 'Label',
        },
        1
      ),
      text(label),
    ]
  }
  const labelDom = div(
    {
      className: 'Label',
    },
    0
  )
  const dom = [labelDom]
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
    dom.push(
      span(
        {
          className: 'CompletionHighlight',
        },
        1
      ),
      text(highlightText)
    )
    position = highlightEnd
  }
  if (position < label.length) {
    const afterText = label.slice(position)
    labelDom.childCount++
    dom.push(text(afterText))
  }
  return dom
}

export const getCompletionItemsVirtualDom = (visibleItems) => {
  if (visibleItems.length === 0) {
    return [div({}, 1), text('No Results')]
  }
  const root = div({}, visibleItems.length)
  const dom = [root]
  for (const visibleItem of visibleItems) {
    const { top, label, symbolName, highlights, focused } = visibleItem
    let className = 'EditorCompletionItem'
    if (focused) {
      className += ' Focused'
    }
    dom.push(
      div(
        {
          role: 'option',
          className,
          top,
        },
        2
      ),
      div(
        {
          className: `ColoredMaskIcon ${symbolName}`,
        },
        0
      ),
      ...getLabelDom(label, highlights)
    )
  }
  return dom
}
