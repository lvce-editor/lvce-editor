import * as ClassNames from '../ClassNames/ClassNames.js'
import * as GetProblemsTableBodyVirtualDom from '../GetProblemsTableBodyVirtualDom/GetProblemsTableBodyVirtualDom.js'
import * as GetProblemsTableHeaderVirtualDom from '../GetProblemsTableHeaderVirtualDom/GetProblemsTableHeaderVirtualDom.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'

export const getProblemsTableVirtualDom = (problems) => {
  const dom = [
    {
      type: VirtualDomElements.Table,
      className: ClassNames.ProblemsTable,
      childCount: 2,
    },
    ...GetProblemsTableHeaderVirtualDom.getProblemsTableHeaderVirtualDom(),
    ...GetProblemsTableBodyVirtualDom.getProblemsTableBodyVirtualDom(problems),
  ]
  return dom
}
