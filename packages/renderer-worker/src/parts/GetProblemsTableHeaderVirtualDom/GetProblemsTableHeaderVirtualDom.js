import * as ClassNames from '../ClassNames/ClassNames.js'
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
      type: VirtualDomElements.Div,
      className: ClassNames.ProblemsTableHeader,
      childCount: 1,
    },
    {
      type: VirtualDomElements.Div,
      className: ClassNames.ProblemsTableRow,
      childCount: 5,
    },
    {
      type: VirtualDomElements.Div,
      className: ClassNames.ProblemsTableRowItem,
      childCount: 0,
    },
    {
      type: VirtualDomElements.Div,
      className: ClassNames.ProblemsTableRowItem,
      childCount: 1,
    },
    text(textCode),
    {
      type: VirtualDomElements.Div,
      className: ClassNames.ProblemsTableRowItem,
      childCount: 1,
    },
    text(textMessage),
    {
      type: VirtualDomElements.Div,
      className: ClassNames.ProblemsTableRowItem,
      childCount: 1,
    },
    text(textFile),
    {
      type: VirtualDomElements.Div,
      className: ClassNames.ProblemsTableRowItem,
      childCount: 1,
    },
    text(textSource),
  ]
  return dom
}
