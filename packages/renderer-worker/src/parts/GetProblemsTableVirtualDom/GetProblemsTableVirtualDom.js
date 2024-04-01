import * as ClassNames from '../ClassNames/ClassNames.js'
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
      childCount: 1,
    },
    {
      type: VirtualDomElements.Tr,
      childCount: 1,
    },
    {
      type: VirtualDomElements.Th,
      childCount: 1,
    },
    text('Code'),
    {
      type: VirtualDomElements.TBody,
      childCount: 1,
    },
    {
      type: VirtualDomElements.Tr,
      childCount: 1,
    },
    {
      type: VirtualDomElements.Td,
      childCount: 1,
    },
    text('123'),
  ]
  return dom
}
