import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.js'

export const getProblemsTableRowVirtualDom = (problem) => {
  const { code, source, message, file } = problem
  const dom = [
    {
      type: VirtualDomElements.Tr,
      className: 'ProblemsTableRow',
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
    text(file),
    {
      type: VirtualDomElements.Td,
      className: 'ProblemsTableRowItem',
      childCount: 1,
    },
    text(source),
  ]
  return dom
}
