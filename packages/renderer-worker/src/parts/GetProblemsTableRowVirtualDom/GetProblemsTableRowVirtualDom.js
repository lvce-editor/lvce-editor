import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.js'

const getClassName = (isEven) => {
  if (isEven) {
    return 'ProblemsTableRow'
  }
  return 'ProblemsTableRow ProblemsTableRowOdd'
}

export const getProblemsTableRowVirtualDom = (problem) => {
  const { code, source, uri, message, file, isEven } = problem
  // TODO problems are grouped by uri, depending
  // on which renderer is used the data needs to look different
  if (!message) {
    return []
  }
  const dom = [
    {
      type: VirtualDomElements.Tr,
      className: getClassName(isEven),
      childCount: 5,
    },
    {
      type: VirtualDomElements.Td,
      className: 'ProblemsTableRowItem',
      childCount: 1,
    },
    text('problem'),
    {
      type: VirtualDomElements.Td,
      className: 'ProblemsTableRowItem',
      childCount: 1,
    },
    text(code),
    {
      type: VirtualDomElements.Td,
      className: 'ProblemsTableRowItem',
      childCount: 1,
    },
    text(message),
    {
      type: VirtualDomElements.Td,
      className: 'ProblemsTableRowItem',
      childCount: 1,
    },
    text(uri),
    {
      type: VirtualDomElements.Td,
      className: 'ProblemsTableRowItem',
      childCount: 1,
    },
    text(source),
  ]
  return dom
}
