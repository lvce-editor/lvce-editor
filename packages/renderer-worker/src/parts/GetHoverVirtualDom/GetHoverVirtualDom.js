import * as ClassNames from '../ClassNames/ClassNames.js'
import * as GetLineInfosVirtualDom from '../GetLineInfosVirtualDom/GetLineInfosVirtualDom.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.js'

export const getHoverVirtualDom = (lineInfos, documentation, diagnostics) => {
  const dom = []

  if (diagnostics) {
    dom.push({
      type: VirtualDomElements.Div,
      className: 'HoverProblems',
      childCount: diagnostics.length,
    })
    for (const diagnostic of diagnostics) {
      dom.push(
        {
          type: VirtualDomElements.Div,
          className: 'HoverProblem',
          childCount: 1,
        },
        text(diagnostic.message),
      )
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
