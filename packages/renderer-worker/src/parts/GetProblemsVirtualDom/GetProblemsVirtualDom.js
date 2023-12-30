import * as ClassNames from '../ClassNames/ClassNames.js'
import * as GetBadgeVirtualDom from '../GetBadgeVirtualDom/GetBadgeVirtualDom.js'
import * as GetFileIconVirtualDom from '../GetFileIconVirtualDom/GetFileIconVirtualDom.js'
import * as GetTreeItemIndent from '../GetTreeItemIndent/GetTreeItemIndent.js'
import * as ViewletProblemsStrings from '../ViewletProblems/ViewletProblemsStrings.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.js'

const getProblemVirtualDom = (problem) => {
  const {
    message,
    rowIndex,
    columnIndex,
    isActive,
    uri,
    icon,
    source,
    relativePath,
    uriMatchIndex,
    sourceMatchIndex,
    messageMatchIndex,
    filterValueLength,
  } = problem
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
      {
        type: VirtualDomElements.Div,
        className: ClassNames.Chevron,
        childCount: 1,
      },
      {
        type: VirtualDomElements.Div,
        className: 'MaskIcon MaskIconChevronDown',
        childCount: 0,
      },
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
    {
      type: VirtualDomElements.Div,
      className: `${ClassNames.MaskIconError} ${ClassNames.ProblemsErrorIcon}`,
      childCount: 0,
    },
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
    text(source + ' '),
    text(lineColumn),
  )
  return dom
}

export const getProblemsVirtualDom = (problems) => {
  if (problems.length === 0) {
    return [
      {
        type: VirtualDomElements.Div,
        className: ClassNames.Message,
        childCount: 1,
      },
      text(ViewletProblemsStrings.noProblemsDetected()),
    ]
  }
  const dom = [
    {
      type: VirtualDomElements.Div,
      className: ClassNames.ProblemsList,
      childCount: problems.length,
    },
    ...problems.flatMap(getProblemVirtualDom),
  ]
  return dom
}
