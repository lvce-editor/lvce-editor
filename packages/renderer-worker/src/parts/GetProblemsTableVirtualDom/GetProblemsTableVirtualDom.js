import * as ClassNames from '../ClassNames/ClassNames.js'
import * as GetProblemsTableRowVirtualDom from '../GetProblemsTableRowVirtualDom/GetProblemsTableRowVirtualDom.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.js'

export const getProblemsTableVirtualDom = (problems) => {
  const dom = [
    {
      type: VirtualDomElements.Table,
      className: ClassNames.ProblemsTable,
      childCount: 2,
    },
    {
      type: VirtualDomElements.THead,
      className: 'ProblemsTableHeader',
      childCount: 1,
    },
    {
      type: VirtualDomElements.Tr,
      className: 'ProblemsTableRow',
      childCount: 5,
    },
    {
      type: VirtualDomElements.Th,
      className: 'ProblemsTableRowItem',
      childCount: 0,
    },
    {
      type: VirtualDomElements.Th,
      className: 'ProblemsTableRowItem',
      childCount: 1,
    },
    text('Code'),
    {
      type: VirtualDomElements.Th,
      className: 'ProblemsTableRowItem',
      childCount: 1,
    },
    text('Message'),
    {
      type: VirtualDomElements.Th,
      className: 'ProblemsTableRowItem',
      childCount: 1,
    },
    text('File'),
    {
      type: VirtualDomElements.Th,
      className: 'ProblemsTableRowItem',
      childCount: 1,
    },
    text('Source'),
    {
      type: VirtualDomElements.TBody,
      className: 'ProblemsTableBody',
      childCount: problems.length,
    },
    ...problems.flatMap(GetProblemsTableRowVirtualDom.getProblemsTableRowVirtualDom),
  ]
  return dom
}
