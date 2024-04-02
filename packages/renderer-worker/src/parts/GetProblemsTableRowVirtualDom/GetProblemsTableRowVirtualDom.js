import * as ClassNames from '../ClassNames/ClassNames.js'
import * as GetProblemSourceDetail from '../GetProblemSourceDetail/GetProblemSourceDetail.js'
import * as GetProblemsIconVirtualDom from '../GetProblemsIconVirtualDom/GetProblemsIconVirtualDom.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.js'

const getClassName = (isEven) => {
  if (isEven) {
    return ClassNames.ProblemsTableRow
  }
  return `${ClassNames.ProblemsTableRow} ${ClassNames.ProblemsTableRowOdd}`
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
      className: ClassNames.ProblemsTableRowItem,
      childCount: 1,
    },
    GetProblemsIconVirtualDom.getProblemsIconVirtualDom(),
    {
      type: VirtualDomElements.Td,
      className: ClassNames.ProblemsTableRowItem,
      childCount: 1,
    },
    text(GetProblemSourceDetail.getProblemSourceDetail(source, code)),
    {
      type: VirtualDomElements.Td,
      className: ClassNames.ProblemsTableRowItem,
      childCount: 1,
    },
    text(message),
    {
      type: VirtualDomElements.Td,
      className: ClassNames.ProblemsTableRowItem,
      childCount: 1,
    },
    text(uri),
    {
      type: VirtualDomElements.Td,
      className: ClassNames.ProblemsTableRowItem,
      childCount: 1,
    },
    text(source),
  ]
  return dom
}
