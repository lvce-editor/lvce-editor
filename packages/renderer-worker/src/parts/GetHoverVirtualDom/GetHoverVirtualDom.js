import * as ClassNames from '../ClassNames/ClassNames.js'
import * as GetLineInfosVirtualDom from '../GetLineInfosVirtualDom/GetLineInfosVirtualDom.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.js'

const hoverProblemMessage = {
  type: VirtualDomElements.Span,
  className: 'HoverProblemMessage',
  childCount: 1,
}

const hoverProblemDetail = {
  type: VirtualDomElements.Span,
  className: 'HoverProblemDetail',
  childCount: 1,
}

const getChildCount = (lineInfos, documentation, diagnostics) => {
  return lineInfos.length + documentation ? 1 : 0 + (diagnostics && diagnostics.length > 0) ? 1 : 0
}

export const getHoverVirtualDom = (lineInfos, documentation, diagnostics) => {
  const dom = []
  dom.push({
    type: VirtualDomElements.Div,
    className: 'Viewlet EditorHover',
    childCount: getChildCount(lineInfos, documentation, diagnostics),
  })
  if (diagnostics && diagnostics.length > 0) {
    dom.push({
      type: VirtualDomElements.Div,
      className: 'HoverDisplayString HoverProblem',
      childCount: diagnostics.length * 2,
    })
    for (const diagnostic of diagnostics) {
      dom.push(hoverProblemMessage, text(diagnostic.message), hoverProblemDetail, text(`${diagnostic.source} (${diagnostic.code})`))
    }
  }

  const lineInfosDom = GetLineInfosVirtualDom.getLineInfosVirtualDom(lineInfos)
  dom.push(
    {
      type: VirtualDomElements.Div,
      className: ClassNames.HoverDisplayString,
      childCount: lineInfos.length,
    },
    ...lineInfosDom,
  )
  if (documentation) {
    dom.push(
      {
        type: VirtualDomElements.Div,
        className: ClassNames.HoverDocumentation,
        childCount: 1,
      },
      text(documentation),
    )
  }

  return dom
}
