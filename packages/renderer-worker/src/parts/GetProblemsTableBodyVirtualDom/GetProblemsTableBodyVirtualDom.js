import * as ClassNames from '../ClassNames/ClassNames.js'
import * as GetProblemsTableRowVirtualDom from '../GetProblemsTableRowVirtualDom/GetProblemsTableRowVirtualDom.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'

export const getProblemsTableBodyVirtualDom = (problems) => {
  const dom = [
    {
      type: VirtualDomElements.TBody,
      className: ClassNames.ProblemsTableBody,
      childCount: problems.length,
    },
    ...problems.flatMap(GetProblemsTableRowVirtualDom.getProblemsTableRowVirtualDom),
  ]
  return dom
}
