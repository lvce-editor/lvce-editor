import * as ClassNames from '../ClassNames/ClassNames.js'
import * as GetProblemsListItemVirtualDom from '../GetProblemsListItemVirtualDom/GetProblemsListItemVirtualDom.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'

export const getProblemsListVirtualDom = (problems) => {
  const dom = [
    {
      type: VirtualDomElements.Div,
      className: ClassNames.ProblemsList,
      childCount: problems.length,
    },
    ...problems.flatMap(GetProblemsListItemVirtualDom.getProblemVirtualDom),
  ]
  return dom
}
