import * as ClassNames from '../ClassNames/ClassNames.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.js'

export const getProblemsTableVirtualDom = (problems) => {
  const dom = [
    {
      type: VirtualDomElements.Div,
      className: ClassNames.ProblemsList,
      childCount: 1,
    },
    text('table'),
  ]
  return dom
}
