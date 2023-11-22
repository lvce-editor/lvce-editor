import * as ViewletProblemsStrings from '../ViewletProblems/ViewletProblemsStrings.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.js'

const getProblemVirtualDom = (problem) => {
  const { message, rowIndex, columnIndex } = problem
  const lineColumn = ViewletProblemsStrings.atLineColumn(rowIndex, columnIndex)
  return [
    {
      type: VirtualDomElements.Div,
      className: 'Problem',
      childCount: 3,
    },
    {
      type: VirtualDomElements.Div,
      className: 'MaskIconError ProblemsErrorIcon',
      childCount: 0,
    },
    text(message),
    {
      type: VirtualDomElements.Span,
      className: 'ProblemAt',
      childCount: 1,
    },
    text(lineColumn),
  ]
}

export const getProblemsVirtualDom = (problems) => {
  if (problems.length === 0) {
    return [
      {
        type: VirtualDomElements.Div,
        className: 'Message',
        childCount: 1,
      },
      text(ViewletProblemsStrings.noProblemsDetected()),
    ]
  }
  const dom = [
    {
      type: VirtualDomElements.Div,
      className: 'ProblemsList',
      childCount: problems.length,
    },
    ...problems.flatMap(getProblemVirtualDom),
  ]
  return dom
}
