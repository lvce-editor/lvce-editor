import * as ClassNames from '../ClassNames/ClassNames.js'
import * as GetProblemsTableHeaderVirtualDom from '../GetProblemsTableHeaderVirtualDom/GetProblemsTableHeaderVirtualDom.js'
import * as GetProblemsTableRowVirtualDom from '../GetProblemsTableRowVirtualDom/GetProblemsTableRowVirtualDom.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'

export const getProblemsTableVirtualDom = (problems) => {
  const dom = [
    {
      type: VirtualDomElements.Table,
      className: ClassNames.ProblemsTable,
      childCount: 2,
    },
    ...GetProblemsTableHeaderVirtualDom.getProblemsTableHeaderVirtualDom(),
    {
      type: VirtualDomElements.TBody,
      className: 'ProblemsTableBody',
      childCount: problems.length,
    },
    ...problems.flatMap(GetProblemsTableRowVirtualDom.getProblemsTableRowVirtualDom),
  ]
  return dom
}
