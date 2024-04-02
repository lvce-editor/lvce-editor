import * as ProblemStrings from '../ProblemStrings/ProblemStrings.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.js'

export const getProblemsTableHeaderVirtualDom = () => {
  const textCode = ProblemStrings.code()
  const textSource = ProblemStrings.source()
  const textMessage = ProblemStrings.message()
  const textFile = ProblemStrings.file()
  const dom = [
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
    text(textCode),
    {
      type: VirtualDomElements.Th,
      className: 'ProblemsTableRowItem',
      childCount: 1,
    },
    text(textMessage),
    {
      type: VirtualDomElements.Th,
      className: 'ProblemsTableRowItem',
      childCount: 1,
    },
    text(textFile),
    {
      type: VirtualDomElements.Th,
      className: 'ProblemsTableRowItem',
      childCount: 1,
    },
    text(textSource),
  ]
  return dom
}
