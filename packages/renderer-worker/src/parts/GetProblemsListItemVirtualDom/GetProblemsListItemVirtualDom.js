import * as ClassNames from '../ClassNames/ClassNames.js'
import * as GetBadgeVirtualDom from '../GetBadgeVirtualDom/GetBadgeVirtualDom.js'
import * as GetChevronVirtualDom from '../GetChevronVirtualDom/GetChevronVirtualDom.js'
import * as GetFileIconVirtualDom from '../GetFileIconVirtualDom/GetFileIconVirtualDom.js'
import * as GetProblemSourceDetail from '../GetProblemSourceDetail/GetProblemSourceDetail.js'
import * as GetProblemsIconVirtualDom from '../GetProblemsIconVirtualDom/GetProblemsIconVirtualDom.js'
import * as GetTreeItemIndent from '../GetTreeItemIndent/GetTreeItemIndent.js'
import * as ViewletProblemsStrings from '../ViewletProblems/ViewletProblemsStrings.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.js'

export const getProblemVirtualDom = (problem) => {
  const { message, rowIndex, columnIndex, isActive, uri, icon, source, relativePath, messageMatchIndex, filterValueLength, code, type } = problem
  let className = ClassNames.Problem
  if (isActive) {
    className += ' ' + ClassNames.ProblemSelected
  }
  if (uri) {
    return [
      {
        type: VirtualDomElements.Div,
        className,
        childCount: 5,
        paddingLeft: GetTreeItemIndent.getTreeItemIndent(1),
      },
      GetChevronVirtualDom.getChevronDownVirtualDom(),
      GetFileIconVirtualDom.getFileIconVirtualDom(icon),
      text(uri),
      {
        type: VirtualDomElements.Div,
        className: ClassNames.LabelDetail,
        childCount: 1,
      },
      text(relativePath),
      ...GetBadgeVirtualDom.getBadgeVirtualDom(ClassNames.ProblemBadge, problem.count),
    ]
  }
  const lineColumn = ViewletProblemsStrings.atLineColumn(rowIndex, columnIndex)
  const label = {
    type: VirtualDomElements.Div,
    className: ClassNames.Label,
    childCount: 1,
  }
  /**
   * @type {any}
   */
  const dom = [
    {
      type: VirtualDomElements.Div,
      className,
      childCount: 3,
      paddingLeft: GetTreeItemIndent.getTreeItemIndent(2),
    },
    GetProblemsIconVirtualDom.getProblemsIconVirtualDom(type),
    label,
  ]
  if (filterValueLength) {
    const before = message.slice(0, messageMatchIndex)
    const middle = message.slice(messageMatchIndex, messageMatchIndex + filterValueLength)
    const after = message.slice(messageMatchIndex + filterValueLength)
    label.childCount += 2
    dom.push(
      text(before),
      {
        type: VirtualDomElements.Div,
        className: ClassNames.Highlight,
        childCount: 1,
      },
      text(middle),
      text(after),
    )
  } else {
    dom.push(text(message))
  }
  dom.push(
    {
      type: VirtualDomElements.Span,
      className: ClassNames.ProblemAt,
      childCount: 2,
    },
    text(GetProblemSourceDetail.getProblemSourceDetail(source, code)),
    text(lineColumn),
  )
  return dom
}
